import { z } from 'zod';

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  role: z.enum(['buyer', 'seller', 'both']).default('buyer'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Book validation schemas
export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  author: z.string().min(1, 'Author is required').max(100),
  isbn: z.string().optional(),
  description: z.string().max(2000).optional(),
  seriesName: z.string().max(200).optional(),
  seriesNumber: z.number().int().positive().optional(),
  tropes: z.array(z.string()).default([]),
  spiceLevel: z.number().int().min(0).max(5).optional(),
  condition: z.enum(['new', 'like-new', 'very-good', 'good', 'acceptable']),
  conditionNotes: z.string().max(500).optional(),
  priceCents: z.number().int().positive('Price must be positive'),
  shippingPriceCents: z.number().int().min(0).default(0),
  localPickupAvailable: z.boolean().default(false),
  isSpecialEdition: z.boolean().default(false),
  specialEditionDetails: z.object({
    paintedEdges: z.boolean().optional(),
    signedCopy: z.boolean().optional(),
    firstEdition: z.boolean().optional(),
    exclusiveCover: z.boolean().optional(),
    sprayed: z.boolean().optional(),
    customDustJacket: z.boolean().optional(),
    details: z.string().max(500).optional(),
  }).optional(),
});

export const updateBookSchema = createBookSchema.partial().extend({
  status: z.enum(['draft', 'active', 'pending', 'sold', 'removed']).optional(),
});

// Transaction validation schemas
export const createTransactionSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  shippingMethod: z.string().optional(),
  pickupLocation: z.string().optional(),
  pickupScheduledAt: z.string().datetime().optional(),
});

export const shipTransactionSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  trackingCarrier: z.string().min(1, 'Carrier is required'),
});

// Review validation schemas
export const createReviewSchema = z.object({
  transactionId: z.string().uuid('Invalid transaction ID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  conditionAccurate: z.boolean().optional(),
  shippingSpeed: z.number().int().min(1).max(5).optional(),
  communication: z.number().int().min(1).max(5).optional(),
});

// Common ID validation
export const uuidSchema = z.string().uuid('Invalid ID format');

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
