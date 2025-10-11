import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { TransactionService } from '../services/transaction.service';
import { MessageService } from '../services/message.service';
import { ApiResponse } from '@bookheart/shared';
import { db, books, eq, and, sql } from '@bookheart/database';
import { gte } from 'drizzle-orm';

const router: Router = Router();

// Get dashboard metrics for seller
router.get('/metrics', authenticate, asyncHandler(async (req, res) => {
  const sellerId = req.user!.userId;

  // Get active listings count
  const [activeListingsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(books)
    .where(and(
      eq(books.sellerId, sellerId),
      eq(books.status, 'active')
    ));

  const activeListings = activeListingsResult?.count || 0;

  // Get views this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [viewsResult] = await db
    .select({ totalViews: sql<number>`COALESCE(SUM(${books.viewCount}), 0)` })
    .from(books)
    .where(and(
      eq(books.sellerId, sellerId),
      gte(books.updatedAt, oneWeekAgo)
    ));

  const viewsThisWeek = viewsResult?.totalViews || 0;

  // Get unread messages count
  const unreadMessages = await MessageService.getUnreadCount(sellerId);

  // Get sales this month
  const salesThisMonth = await TransactionService.getSalesCount(sellerId, 30);

  const metrics = {
    activeListings,
    viewsThisWeek,
    unreadMessages,
    salesThisMonth,
  };

  const response: ApiResponse = {
    success: true,
    data: metrics,
  };

  res.json(response);
}));

export default router;

