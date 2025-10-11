import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { validate } from '../middleware/validation';
import { TransactionService } from '../services/transaction.service';
import { ApiResponse, TransactionStatus } from '@bookheart/shared';
import { z } from 'zod';

const router: Router = Router();

// Validation schemas
const updateTrackingSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  trackingCarrier: z.string().min(1, 'Carrier is required'),
});

// Get user's transactions
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { status, role } = req.query;

  const filters: any = {};
  
  if (status) {
    filters.status = Array.isArray(status) 
      ? status as TransactionStatus[]
      : status as TransactionStatus;
  }
  
  if (role) {
    filters.role = role as 'buyer' | 'seller';
  }

  const transactions = await TransactionService.getTransactions(userId, filters);

  const response: ApiResponse = {
    success: true,
    data: transactions,
  };

  res.json(response);
}));

// Get single transaction by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const transaction = await TransactionService.getTransactionById(id, userId);

  if (!transaction) {
    res.status(404).json({
      success: false,
      error: 'Transaction not found',
    });
    return;
  }

  const response: ApiResponse = {
    success: true,
    data: transaction,
  };

  res.json(response);
}));

// Update tracking information
router.patch('/:id/tracking', authenticate, validate(updateTrackingSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user!.userId;
  const { trackingNumber, trackingCarrier } = req.body;

  try {
    const transaction = await TransactionService.updateTracking(
      id,
      sellerId,
      trackingNumber,
      trackingCarrier
    );

    const response: ApiResponse = {
      success: true,
      data: transaction,
      message: 'Tracking information updated successfully',
    };

    res.json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}));

export default router;
