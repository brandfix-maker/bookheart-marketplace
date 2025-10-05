import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

const router = Router();

// Get reviews for a user
router.get('/user/:userId', asyncHandler(async (_req, res) => {
  // TODO: Implement get user reviews
  res.status(501).json({
    success: false,
    error: 'Not implemented',
  });
}));

// Create review
router.post('/', authenticate, asyncHandler(async (_req, res) => {
  // TODO: Implement create review
  res.status(501).json({
    success: false,
    error: 'Not implemented',
  });
}));

export default router;
