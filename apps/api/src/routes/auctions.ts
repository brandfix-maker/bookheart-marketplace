import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { validate } from '../middleware/validation';
import { AuctionService } from '../services/auction.service';
import { ApiResponse } from '@bookheart/shared';
import { z } from 'zod';

const router: Router = Router();

// Validation schemas
const createAuctionSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  startingBidCents: z.number().int().min(500, 'Starting bid must be at least $5'),
  reservePriceCents: z.number().int().min(500).optional().nullable(),
  endTime: z.string().datetime('Invalid end time'),
});

const placeBidSchema = z.object({
  bidAmountCents: z.number().int().min(500, 'Bid must be at least $5'),
});

// Create a new auction
router.post(
  '/',
  authenticate,
  validate(createAuctionSchema),
  asyncHandler(async (req, res) => {
    const { bookId, startingBidCents, reservePriceCents, endTime } = req.body;
    const sellerId = req.user!.userId;

    // Validate end time is in the future
    const endDateTime = new Date(endTime);
    if (endDateTime <= new Date()) {
      res.status(400).json({
        success: false,
        error: 'End time must be in the future',
      });
      return;
    }

    try {
      const auction = await AuctionService.createAuction(
        bookId,
        sellerId,
        startingBidCents,
        reservePriceCents || null,
        endDateTime
      );

      const response: ApiResponse = {
        success: true,
        data: auction,
        message: 'Auction created successfully',
      };

      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  })
);

// Get auction details
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const auction = await AuctionService.getAuctionDetails(id);

    if (!auction) {
      res.status(404).json({
        success: false,
        error: 'Auction not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: auction,
    };

    res.json(response);
  })
);

// Place a bid on an auction
router.post(
  '/:id/bid',
  authenticate,
  validate(placeBidSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { bidAmountCents } = req.body;
    const bidderId = req.user!.userId;

    try {
      const bid = await AuctionService.placeBid(id, bidderId, bidAmountCents);

      const response: ApiResponse = {
        success: true,
        data: bid,
        message: 'Bid placed successfully',
      };

      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  })
);

// Get bid history for an auction
router.get(
  '/:id/bids',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const bids = await AuctionService.getBidHistory(id, limit, offset);

    const response: ApiResponse = {
      success: true,
      data: bids,
    };

    res.json(response);
  })
);

// End an auction (manual end by seller)
router.post(
  '/:id/end',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user!.userId;

    try {
      const auction = await AuctionService.endAuction(id, sellerId);

      const response: ApiResponse = {
        success: true,
        data: auction,
        message: 'Auction ended successfully',
      };

      res.json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  })
);

// Cancel an auction (only if no bids)
router.post(
  '/:id/cancel',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user!.userId;

    try {
      const auction = await AuctionService.cancelAuction(id, sellerId);

      const response: ApiResponse = {
        success: true,
        data: auction,
        message: 'Auction cancelled successfully',
      };

      res.json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  })
);

export default router;

