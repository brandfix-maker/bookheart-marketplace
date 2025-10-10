import { db, auctions, auctionBids, books, eq, and, desc, sql } from '@bookheart/database';
import { Auction, AuctionBid } from '@bookheart/shared';

export class AuctionService {
  /**
   * Create a new auction for a book
   */
  static async createAuction(
    bookId: string,
    sellerId: string,
    startingBidCents: number,
    reservePriceCents: number | null,
    endTime: Date
  ): Promise<Auction> {
    console.log('🔨 AuctionService.createAuction: Creating auction for book:', bookId);

    // Verify book exists and seller owns it
    const [book] = await db.select().from(books).where(eq(books.id, bookId));

    if (!book) {
      throw new Error('Book not found');
    }

    if (book.sellerId !== sellerId) {
      throw new Error('Unauthorized: You do not own this book');
    }

    if (book.status !== 'draft' && book.status !== 'active') {
      throw new Error('Book must be in draft or active status to create an auction');
    }

    // Check if auction already exists for this book
    const [existingAuction] = await db
      .select()
      .from(auctions)
      .where(eq(auctions.bookId, bookId));

    if (existingAuction) {
      throw new Error('An auction already exists for this book');
    }

    // Create auction
    const [newAuction] = await db
      .insert(auctions)
      .values({
        bookId,
        sellerId,
        startingBidCents,
        currentBidCents: startingBidCents,
        reservePriceCents,
        status: 'active',
        startTime: new Date(),
        endTime,
        totalBids: 0,
        uniqueBidders: 0,
      })
      .returning();

    // Update book status to pending (auction active)
    await db
      .update(books)
      .set({ status: 'pending' })
      .where(eq(books.id, bookId));

    console.log('🔨 AuctionService.createAuction: Auction created with ID:', newAuction.id);
    return this.formatAuction(newAuction as any);
  }

  /**
   * Get auction details
   */
  static async getAuctionDetails(auctionId: string): Promise<Auction | null> {
    console.log('🔨 AuctionService.getAuctionDetails: Fetching auction:', auctionId);

    const [auction] = await db
      .select()
      .from(auctions)
      .where(eq(auctions.id, auctionId));

    if (!auction) {
      console.log('🔨 AuctionService.getAuctionDetails: Auction not found');
      return null;
    }

    return this.formatAuction(auction as any);
  }

  /**
   * Get auction by book ID
   */
  static async getAuctionByBookId(bookId: string): Promise<Auction | null> {
    console.log('🔨 AuctionService.getAuctionByBookId: Fetching auction for book:', bookId);

    const [auction] = await db
      .select()
      .from(auctions)
      .where(eq(auctions.bookId, bookId));

    if (!auction) {
      return null;
    }

    return this.formatAuction(auction as any);
  }

  /**
   * Place a bid on an auction
   */
  static async placeBid(
    auctionId: string,
    bidderId: string,
    bidAmountCents: number
  ): Promise<AuctionBid> {
    console.log('🔨 AuctionService.placeBid: Placing bid on auction:', auctionId);

    // Get auction details
    const auction = await this.getAuctionDetails(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    // Validate auction is active
    if (auction.status !== 'active') {
      throw new Error('Auction is not active');
    }

    // Check if auction has ended
    if (new Date(auction.endTime) < new Date()) {
      throw new Error('Auction has ended');
    }

    // Validate bidder is not the seller
    if (bidderId === auction.sellerId) {
      throw new Error('You cannot bid on your own auction');
    }

    // Validate bid amount is higher than current bid
    const minimumBid = auction.currentBidCents + 100; // Minimum $1 increment
    if (bidAmountCents < minimumBid) {
      throw new Error(`Bid must be at least $${(minimumBid / 100).toFixed(2)}`);
    }

    // Check if user has already bid
    const existingBids = await db
      .select()
      .from(auctionBids)
      .where(
        and(eq(auctionBids.auctionId, auctionId), eq(auctionBids.bidderId, bidderId))
      );

    const isNewBidder = existingBids.length === 0;

    // Create bid
    const [newBid] = await db
      .insert(auctionBids)
      .values({
        auctionId,
        bidderId,
        bidAmountCents,
        isAutoBid: false,
        isWinningBid: false,
      })
      .returning();

    // Update auction with new current bid
    await db
      .update(auctions)
      .set({
        currentBidCents: bidAmountCents,
        currentHighBidderId: bidderId,
        totalBids: sql`${auctions.totalBids} + 1`,
        uniqueBidders: isNewBidder
          ? sql`${auctions.uniqueBidders} + 1`
          : sql`${auctions.uniqueBidders}`,
      })
      .where(eq(auctions.id, auctionId));

    console.log('🔨 AuctionService.placeBid: Bid placed successfully');
    return this.formatBid(newBid as any);
  }

  /**
   * Get bid history for an auction
   */
  static async getBidHistory(
    auctionId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<AuctionBid[]> {
    console.log('🔨 AuctionService.getBidHistory: Fetching bid history for auction:', auctionId);

    const bids = await db
      .select()
      .from(auctionBids)
      .where(eq(auctionBids.auctionId, auctionId))
      .orderBy(desc(auctionBids.bidTime))
      .limit(limit)
      .offset(offset);

    return bids.map((bid) => this.formatBid(bid as any));
  }

  /**
   * End an auction (manual end by seller)
   */
  static async endAuction(auctionId: string, sellerId: string): Promise<Auction> {
    console.log('🔨 AuctionService.endAuction: Ending auction:', auctionId);

    // Get auction details
    const auction = await this.getAuctionDetails(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    // Verify seller owns auction
    if (auction.sellerId !== sellerId) {
      throw new Error('Unauthorized: You do not own this auction');
    }

    // Validate auction is active
    if (auction.status !== 'active') {
      throw new Error('Auction is not active');
    }

    // Mark winning bid if there is one
    if (auction.currentHighBidderId) {
      // Get the winning bid
      const [winningBid] = await db
        .select()
        .from(auctionBids)
        .where(
          and(
            eq(auctionBids.auctionId, auctionId),
            eq(auctionBids.bidderId, auction.currentHighBidderId),
            eq(auctionBids.bidAmountCents, auction.currentBidCents)
          )
        )
        .orderBy(desc(auctionBids.bidTime))
        .limit(1);

      if (winningBid) {
        await db
          .update(auctionBids)
          .set({ isWinningBid: true })
          .where(eq(auctionBids.id, winningBid.id));
      }
    }

    // Update auction status
    const [updatedAuction] = await db
      .update(auctions)
      .set({ status: 'ended' })
      .where(eq(auctions.id, auctionId))
      .returning();

    // Update book status
    // If reserve met or no reserve, mark as sold (pending transaction)
    // Otherwise, mark as active again
    const reserveMet =
      !auction.reservePriceCents || auction.currentBidCents >= auction.reservePriceCents;

    if (reserveMet && auction.currentHighBidderId) {
      // Book will be marked as sold when transaction is created
      await db
        .update(books)
        .set({ status: 'pending' })
        .where(eq(books.id, auction.bookId));

      // TODO: Create transaction for winning bidder
      // This will be handled in the transaction service
    } else {
      // No winner or reserve not met, make book active again
      await db
        .update(books)
        .set({ status: 'active' })
        .where(eq(books.id, auction.bookId));
    }

    console.log('🔨 AuctionService.endAuction: Auction ended');
    return this.formatAuction(updatedAuction as any);
  }

  /**
   * Cancel an auction (seller can cancel if no bids)
   */
  static async cancelAuction(auctionId: string, sellerId: string): Promise<Auction> {
    console.log('🔨 AuctionService.cancelAuction: Cancelling auction:', auctionId);

    // Get auction details
    const auction = await this.getAuctionDetails(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    // Verify seller owns auction
    if (auction.sellerId !== sellerId) {
      throw new Error('Unauthorized: You do not own this auction');
    }

    // Can only cancel if no bids
    if (auction.totalBids > 0) {
      throw new Error('Cannot cancel auction with bids. You must let it end.');
    }

    // Update auction status
    const [updatedAuction] = await db
      .update(auctions)
      .set({ status: 'cancelled' })
      .where(eq(auctions.id, auctionId))
      .returning();

    // Update book status back to active
    await db
      .update(books)
      .set({ status: 'active' })
      .where(eq(books.id, auction.bookId));

    console.log('🔨 AuctionService.cancelAuction: Auction cancelled');
    return this.formatAuction(updatedAuction as any);
  }

  /**
   * Format auction for API response
   */
  private static formatAuction(auction: any): Auction {
    return {
      id: auction.id,
      bookId: auction.bookId,
      sellerId: auction.sellerId,
      startingBidCents: auction.startingBidCents,
      currentBidCents: auction.currentBidCents,
      reservePriceCents: auction.reservePriceCents || undefined,
      currentHighBidderId: auction.currentHighBidderId || undefined,
      status: auction.status,
      startTime: auction.startTime.toISOString(),
      endTime: auction.endTime.toISOString(),
      totalBids: auction.totalBids,
      uniqueBidders: auction.uniqueBidders,
      createdAt: auction.createdAt.toISOString(),
      updatedAt: auction.updatedAt.toISOString(),
    };
  }

  /**
   * Format bid for API response
   */
  private static formatBid(bid: any): AuctionBid {
    return {
      id: bid.id,
      auctionId: bid.auctionId,
      bidderId: bid.bidderId,
      bidAmountCents: bid.bidAmountCents,
      autoBidMaxCents: bid.autoBidMaxCents || undefined,
      isAutoBid: bid.isAutoBid,
      isWinningBid: bid.isWinningBid,
      bidTime: bid.bidTime.toISOString(),
      createdAt: bid.createdAt.toISOString(),
    };
  }
}

