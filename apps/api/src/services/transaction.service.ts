import { db, transactions, books, users, eq, and, desc, sql, count } from '@bookheart/database';
import { gte, inArray } from 'drizzle-orm';
import { Transaction, TransactionStatus } from '@bookheart/shared';
import { calculateSellerPayout } from '@bookheart/shared/src/config/fees';

export class TransactionService {
  /**
   * Get transactions with filters
   */
  static async getTransactions(
    userId: string,
    filters: {
      status?: TransactionStatus | TransactionStatus[];
      role?: 'buyer' | 'seller';
    } = {}
  ): Promise<any[]> {
    try {
      const whereConditions = [];

      // Filter by user role (buyer or seller)
      if (filters.role === 'buyer') {
        whereConditions.push(eq(transactions.buyerId, userId));
      } else if (filters.role === 'seller') {
        whereConditions.push(eq(transactions.sellerId, userId));
      } else {
        // Get all transactions where user is either buyer or seller
        whereConditions.push(
          sql`${transactions.buyerId} = ${userId} OR ${transactions.sellerId} = ${userId}`
        );
      }

      // Filter by status
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          whereConditions.push(inArray(transactions.status, filters.status));
        } else {
          whereConditions.push(eq(transactions.status, filters.status));
        }
      }

      // Get transactions with related data
      const transactionsData = await db
        .select({
          transaction: transactions,
          buyer: {
            id: users.id,
            username: users.username,
            displayName: users.displayName,
            avatarUrl: users.avatarUrl,
          },
          book: books,
        })
        .from(transactions)
        .leftJoin(users, eq(transactions.buyerId, users.id))
        .leftJoin(books, eq(transactions.bookId, books.id))
        .where(and(...whereConditions))
        .orderBy(desc(transactions.createdAt));

      return transactionsData.map(({ transaction, buyer, book }) => ({
        ...this.formatTransaction(transaction as any),
        buyer: buyer || undefined,
        book: book ? this.formatBook(book as any) : undefined,
      }));
    } catch (error) {
      console.error('💳 TransactionService.getTransactions: Error:', error);
      throw error;
    }
  }

  /**
   * Get single transaction by ID
   */
  static async getTransactionById(id: string, userId: string): Promise<any | null> {
    try {
      const [result] = await db
        .select({
          transaction: transactions,
          buyer: {
            id: users.id,
            username: users.username,
            displayName: users.displayName,
            avatarUrl: users.avatarUrl,
            location: users.location,
          },
          book: books,
        })
        .from(transactions)
        .leftJoin(users, eq(transactions.buyerId, users.id))
        .leftJoin(books, eq(transactions.bookId, books.id))
        .where(eq(transactions.id, id))
        .limit(1);

      if (!result) {
        return null;
      }

      // Verify user has access (either buyer or seller)
      if (result.transaction.buyerId !== userId && result.transaction.sellerId !== userId) {
        throw new Error('Access denied');
      }

      return {
        ...this.formatTransaction(result.transaction as any),
        buyer: result.buyer || undefined,
        book: result.book ? this.formatBook(result.book as any) : undefined,
      };
    } catch (error) {
      console.error('💳 TransactionService.getTransactionById: Error:', error);
      throw error;
    }
  }

  /**
   * Update tracking information
   */
  static async updateTracking(
    id: string,
    sellerId: string,
    trackingNumber: string,
    trackingCarrier: string
  ): Promise<Transaction> {
    try {
      // Verify seller owns this transaction
      const [existingTransaction] = await db
        .select()
        .from(transactions)
        .where(and(eq(transactions.id, id), eq(transactions.sellerId, sellerId)))
        .limit(1);

      if (!existingTransaction) {
        throw new Error('Transaction not found or access denied');
      }

      // Update transaction with tracking info and status
      const [updatedTransaction] = await db
        .update(transactions)
        .set({
          trackingNumber,
          trackingCarrier,
          status: 'shipped',
          shippedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(transactions.id, id))
        .returning();

      console.log('💳 TransactionService.updateTracking: Tracking updated for transaction:', id);

      return this.formatTransaction(updatedTransaction as any);
    } catch (error) {
      console.error('💳 TransactionService.updateTracking: Error:', error);
      throw error;
    }
  }

  /**
   * Get seller transaction statistics
   */
  static async getSellerTransactionStats(sellerId: string): Promise<{
    pending: number;
    shipped: number;
    delivered: number;
    completed: number;
    total: number;
  }> {
    try {
      const [stats] = await db
        .select({
          pending: sql<number>`COUNT(CASE WHEN status = 'pending_payment' OR status = 'paid' THEN 1 END)`,
          shipped: sql<number>`COUNT(CASE WHEN status = 'shipped' THEN 1 END)`,
          delivered: sql<number>`COUNT(CASE WHEN status = 'delivered' OR status = 'inspection_approved' THEN 1 END)`,
          completed: sql<number>`COUNT(CASE WHEN status = 'completed' THEN 1 END)`,
          total: count(),
        })
        .from(transactions)
        .where(eq(transactions.sellerId, sellerId));

      return {
        pending: stats.pending,
        shipped: stats.shipped,
        delivered: stats.delivered,
        completed: stats.completed,
        total: stats.total,
      };
    } catch (error) {
      console.error('💳 TransactionService.getSellerTransactionStats: Error:', error);
      throw error;
    }
  }

  /**
   * Get sales count for last N days
   */
  static async getSalesCount(sellerId: string, days: number = 30): Promise<number> {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const [result] = await db
        .select({ count: count() })
        .from(transactions)
        .where(
          and(
            eq(transactions.sellerId, sellerId),
            gte(transactions.createdAt, dateThreshold),
            inArray(transactions.status, ['completed', 'shipped', 'delivered', 'inspection_approved'])
          )
        );

      return result.count;
    } catch (error) {
      console.error('💳 TransactionService.getSalesCount: Error:', error);
      throw error;
    }
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(data: {
    bookId: string;
    buyerId: string;
    sellerId: string;
    transactionType: 'buy_now' | 'accepted_offer' | 'auction_win';
    itemPriceCents: number;
    shippingCents: number;
  }): Promise<Transaction> {
    try {
      const { itemPriceCents, shippingCents } = data;
      
      // Calculate fees using centralized config
      const feeBreakdown = calculateSellerPayout(itemPriceCents, shippingCents);

      const [newTransaction] = await db
        .insert(transactions)
        .values({
          bookId: data.bookId,
          buyerId: data.buyerId,
          sellerId: data.sellerId,
          transactionType: data.transactionType,
          itemPriceCents: feeBreakdown.itemPriceCents,
          shippingCents: feeBreakdown.shippingCents,
          totalCents: feeBreakdown.totalCents,
          platformFeeCents: feeBreakdown.platformFeeCents,
          sellerPayoutCents: feeBreakdown.sellerPayoutCents,
          status: 'pending_payment',
        })
        .returning();

      console.log('💳 TransactionService.createTransaction: Transaction created:', newTransaction.id);

      return this.formatTransaction(newTransaction as any);
    } catch (error) {
      console.error('💳 TransactionService.createTransaction: Error:', error);
      throw error;
    }
  }

  /**
   * Format transaction for API response
   */
  private static formatTransaction(transaction: any): Transaction {
    return {
      id: transaction.id,
      bookId: transaction.bookId,
      buyerId: transaction.buyerId,
      sellerId: transaction.sellerId,
      transactionType: transaction.transactionType,
      itemPriceCents: transaction.itemPriceCents,
      shippingCents: transaction.shippingCents,
      platformFeeCents: transaction.platformFeeCents,
      sellerPayoutCents: transaction.sellerPayoutCents,
      totalCents: transaction.totalCents,
      stripePaymentIntentId: transaction.stripePaymentIntentId,
      stripeTransferId: transaction.stripeTransferId,
      stripeRefundId: transaction.stripeRefundId,
      status: transaction.status,
      paidAt: transaction.paidAt?.toISOString(),
      shippedAt: transaction.shippedAt?.toISOString(),
      deliveredAt: transaction.deliveredAt?.toISOString(),
      inspectionDeadline: transaction.inspectionDeadline?.toISOString(),
      inspectionApprovedAt: transaction.inspectionApprovedAt?.toISOString(),
      completedAt: transaction.completedAt?.toISOString(),
      disputedAt: transaction.disputedAt?.toISOString(),
      cancelledAt: transaction.cancelledAt?.toISOString(),
      refundedAt: transaction.refundedAt?.toISOString(),
      shippingMethod: transaction.shippingMethod,
      trackingNumber: transaction.trackingNumber,
      trackingCarrier: transaction.trackingCarrier,
      pickupLocation: transaction.pickupLocation,
      pickupScheduledAt: transaction.pickupScheduledAt?.toISOString(),
      pickupConfirmedAt: transaction.pickupConfirmedAt?.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }

  /**
   * Format book for API response
   */
  private static formatBook(book: any): any {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      condition: book.condition,
      priceCents: book.priceCents,
      status: book.status,
    };
  }
}

