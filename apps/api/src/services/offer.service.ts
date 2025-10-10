import { db, offers, eq, and, desc } from '@bookheart/database';
import { Offer } from '@bookheart/shared';

export class OfferService {
  /**
   * Create a new offer on a book
   */
  static async createOffer(
    buyerId: string,
    sellerId: string,
    bookId: string,
    offerAmountCents: number,
    messageToSeller?: string
  ): Promise<Offer> {
    console.log('💰 OfferService.createOffer: Creating offer for book:', bookId);

    // Set expiration to 48 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const [newOffer] = await db
      .insert(offers)
      .values({
        buyerId,
        sellerId,
        bookId,
        offerAmountCents,
        messageToSeller,
        status: 'pending',
        expiresAt,
      })
      .returning();

    console.log('💰 OfferService.createOffer: Offer created with ID:', newOffer.id);
    return this.formatOffer(newOffer as any);
  }

  /**
   * Get offers with optional filters
   */
  static async getOffers(filter: {
    sellerId?: string;
    buyerId?: string;
    bookId?: string;
    status?: string;
  }): Promise<Offer[]> {
    console.log('💰 OfferService.getOffers: Fetching offers with filter:', filter);

    const conditions: any[] = [];

    if (filter.sellerId) {
      conditions.push(eq(offers.sellerId, filter.sellerId));
    }
    if (filter.buyerId) {
      conditions.push(eq(offers.buyerId, filter.buyerId));
    }
    if (filter.bookId) {
      conditions.push(eq(offers.bookId, filter.bookId));
    }
    if (filter.status) {
      conditions.push(eq(offers.status, filter.status as any));
    }

    const query = conditions.length > 0
      ? db.select().from(offers).where(and(...conditions)).orderBy(desc(offers.createdAt))
      : db.select().from(offers).orderBy(desc(offers.createdAt));

    const results = await query;

    // Auto-expire offers that are past their expiration date
    const now = new Date();
    const offersToExpire = results.filter(
      (offer) => offer.status === 'pending' && new Date(offer.expiresAt) < now
    );

    if (offersToExpire.length > 0) {
      await Promise.all(
        offersToExpire.map((offer) =>
          db
            .update(offers)
            .set({ status: 'expired' })
            .where(eq(offers.id, offer.id))
        )
      );

      // Update status in results
      results.forEach((offer) => {
        if (offersToExpire.some((o) => o.id === offer.id)) {
          offer.status = 'expired';
        }
      });
    }

    return results.map((offer) => this.formatOffer(offer as any));
  }

  /**
   * Get a single offer by ID
   */
  static async getOfferById(offerId: string): Promise<Offer | null> {
    console.log('💰 OfferService.getOfferById: Fetching offer:', offerId);

    const [offer] = await db
      .select()
      .from(offers)
      .where(eq(offers.id, offerId));

    if (!offer) {
      console.log('💰 OfferService.getOfferById: Offer not found');
      return null;
    }

    // Auto-expire if past expiration
    if (offer.status === 'pending' && new Date(offer.expiresAt) < new Date()) {
      await db
        .update(offers)
        .set({ status: 'expired' })
        .where(eq(offers.id, offerId));
      offer.status = 'expired';
    }

    return this.formatOffer(offer as any);
  }

  /**
   * Accept an offer
   */
  static async acceptOffer(offerId: string, sellerId: string): Promise<Offer> {
    console.log('💰 OfferService.acceptOffer: Accepting offer:', offerId);

    // Verify offer exists and seller owns it
    const offer = await this.getOfferById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.sellerId !== sellerId) {
      throw new Error('Unauthorized: You do not own this offer');
    }

    if (offer.status !== 'pending') {
      throw new Error(`Cannot accept offer with status: ${offer.status}`);
    }

    // Check if expired
    if (new Date(offer.expiresAt) < new Date()) {
      throw new Error('Offer has expired');
    }

    const [updatedOffer] = await db
      .update(offers)
      .set({
        status: 'accepted',
        respondedAt: new Date(),
      })
      .where(eq(offers.id, offerId))
      .returning();

    // TODO: Create transaction for this accepted offer
    // This will be handled when the buyer proceeds to checkout

    console.log('💰 OfferService.acceptOffer: Offer accepted');
    return this.formatOffer(updatedOffer as any);
  }

  /**
   * Reject an offer
   */
  static async rejectOffer(offerId: string, sellerId: string): Promise<Offer> {
    console.log('💰 OfferService.rejectOffer: Rejecting offer:', offerId);

    // Verify offer exists and seller owns it
    const offer = await this.getOfferById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.sellerId !== sellerId) {
      throw new Error('Unauthorized: You do not own this offer');
    }

    if (offer.status !== 'pending' && offer.status !== 'countered') {
      throw new Error(`Cannot reject offer with status: ${offer.status}`);
    }

    const [updatedOffer] = await db
      .update(offers)
      .set({
        status: 'rejected',
        respondedAt: new Date(),
      })
      .where(eq(offers.id, offerId))
      .returning();

    console.log('💰 OfferService.rejectOffer: Offer rejected');
    return this.formatOffer(updatedOffer as any);
  }

  /**
   * Counter an offer
   */
  static async counterOffer(
    offerId: string,
    sellerId: string,
    counterOfferAmountCents: number,
    counterOfferMessage?: string
  ): Promise<Offer> {
    console.log('💰 OfferService.counterOffer: Countering offer:', offerId);

    // Verify offer exists and seller owns it
    const offer = await this.getOfferById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.sellerId !== sellerId) {
      throw new Error('Unauthorized: You do not own this offer');
    }

    if (offer.status !== 'pending') {
      throw new Error(`Cannot counter offer with status: ${offer.status}`);
    }

    // Check if expired
    if (new Date(offer.expiresAt) < new Date()) {
      throw new Error('Offer has expired');
    }

    const [updatedOffer] = await db
      .update(offers)
      .set({
        status: 'countered',
        counterOfferAmountCents,
        counterOfferMessage,
        respondedAt: new Date(),
      })
      .where(eq(offers.id, offerId))
      .returning();

    console.log('💰 OfferService.counterOffer: Counter offer sent');
    return this.formatOffer(updatedOffer as any);
  }

  /**
   * Format offer for API response
   */
  private static formatOffer(offer: any): Offer {
    return {
      id: offer.id,
      buyerId: offer.buyerId,
      sellerId: offer.sellerId,
      bookId: offer.bookId,
      offerAmountCents: offer.offerAmountCents,
      messageToSeller: offer.messageToSeller || undefined,
      status: offer.status,
      expiresAt: offer.expiresAt.toISOString(),
      counterOfferAmountCents: offer.counterOfferAmountCents || undefined,
      counterOfferMessage: offer.counterOfferMessage || undefined,
      respondedAt: offer.respondedAt ? offer.respondedAt.toISOString() : undefined,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
    };
  }
}

