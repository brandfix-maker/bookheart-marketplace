import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

const router = Router();

// Get user's transactions
router.get('/', authenticate, asyncHandler(async (req, res) => {
  // TODO: Implement get transactions
  res.status(501).json({
    success: false,
    error: 'Not implemented',
  });
}));

// Create new transaction
router.post('/', authenticate, asyncHandler(async (req, res) => {
  // TODO: Implement create transaction
  res.status(501).json({
    success: false,
    error: 'Not implemented',
  });
}));

// Update transaction status
router.patch('/:id/status', authenticate, asyncHandler(async (req, res) => {
  // TODO: Implement update transaction status
  res.status(501).json({
    success: false,
    error: 'Not implemented',
  });
}));

export default router;
