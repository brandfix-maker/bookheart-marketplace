import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { db, users, books, reviews, transactions, eq, and, desc, sql, count } from '@bookheart/database';
import { ApiResponse } from '@bookheart/shared';

const router: Router = Router();

// Get user profile by username (public)
router.get('/:username/profile', optionalAuth, asyncHandler(async (req, res) => {
  const { username } = req.params;

  // Get user basic info
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      location: users.location,
      sellerVerified: users.sellerVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found',
    });
    return;
  }

  // Get seller stats
  const [sellerStats] = await db
    .select({
      totalListings: count(books.id),
      activeListings: sql<number>`COUNT(CASE WHEN ${books.status} = 'active' THEN 1 END)`,
      soldListings: sql<number>`COUNT(CASE WHEN ${books.status} = 'sold' THEN 1 END)`,
    })
    .from(books)
    .where(eq(books.sellerId, user.id));

  // Get completed sales as seller
  const [salesStats] = await db
    .select({
      totalSales: count(transactions.id),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.sellerId, user.id),
        eq(transactions.status, 'completed')
      )
    );

  // Get average rating as seller
  const [ratingStats] = await db
    .select({
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      totalReviews: count(reviews.id),
    })
    .from(reviews)
    .where(
      and(
        eq(reviews.reviewedUserId, user.id),
        eq(reviews.reviewType, 'seller')
      )
    );

  const response: ApiResponse = {
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
        sellerVerified: user.sellerVerified,
        memberSince: user.createdAt.toISOString(),
      },
      stats: {
        totalListings: sellerStats?.totalListings || 0,
        activeListings: sellerStats?.activeListings || 0,
        soldListings: sellerStats?.soldListings || 0,
        totalSales: salesStats?.totalSales || 0,
        avgRating: ratingStats?.avgRating || 0,
        totalReviews: ratingStats?.totalReviews || 0,
      },
    },
  };

  res.json(response);
}));

// Get user's active listings (public)
router.get('/:username/listings', optionalAuth, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = req.query.page ? Number(req.query.page) : 1;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
  const offset = (page - 1) * pageSize;

  // Get user ID from username
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found',
    });
    return;
  }

  // Get active listings
  const listings = await db
    .select()
    .from(books)
    .where(
      and(
        eq(books.sellerId, user.id),
        eq(books.status, 'active')
      )
    )
    .orderBy(desc(books.createdAt))
    .limit(pageSize)
    .offset(offset);

  // Get total count
  const [totalResult] = await db
    .select({ count: count(books.id) })
    .from(books)
    .where(
      and(
        eq(books.sellerId, user.id),
        eq(books.status, 'active')
      )
    );

  const response: ApiResponse = {
    success: true,
    data: {
      items: listings,
      total: totalResult?.count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((totalResult?.count || 0) / pageSize),
    },
  };

  res.json(response);
}));

// Get user's reviews (public)
router.get('/:username/reviews', optionalAuth, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = req.query.page ? Number(req.query.page) : 1;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
  const type = req.query.type as string; // 'seller' or 'buyer' or 'all'
  const offset = (page - 1) * pageSize;

  // Get user ID from username
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found',
    });
    return;
  }

  // Build query conditions
  const conditions = [eq(reviews.reviewedUserId, user.id)];
  if (type === 'seller') {
    conditions.push(eq(reviews.reviewType, 'seller'));
  } else if (type === 'buyer') {
    conditions.push(eq(reviews.reviewType, 'buyer'));
  }

  // Get reviews with reviewer info
  const userReviews = await db
    .select({
      review: reviews,
      reviewer: {
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.reviewerId, users.id))
    .where(and(...conditions))
    .orderBy(desc(reviews.createdAt))
    .limit(pageSize)
    .offset(offset);

  // Get total count
  const [totalResult] = await db
    .select({ count: count(reviews.id) })
    .from(reviews)
    .where(and(...conditions));

  const response: ApiResponse = {
    success: true,
    data: {
      items: userReviews.map((r) => ({
        ...r.review,
        reviewer: r.reviewer,
      })),
      total: totalResult?.count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((totalResult?.count || 0) / pageSize),
    },
  };

  res.json(response);
}));

// Update user profile (authenticated)
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { displayName, bio, location, avatarUrl } = req.body;

  const [updatedUser] = await db
    .update(users)
    .set({
      displayName,
      bio,
      location,
      avatarUrl,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  const response: ApiResponse = {
    success: true,
    data: {
      id: updatedUser.id,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      bio: updatedUser.bio,
      location: updatedUser.location,
      avatarUrl: updatedUser.avatarUrl,
    },
  };

  res.json(response);
}));

export default router;
