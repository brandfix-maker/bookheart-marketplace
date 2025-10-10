import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { validate } from '../middleware/validation';
import { OfferService } from '../services/offer.service';
import { ApiResponse } from '@bookheart/shared';
import { z } from 'zod';

const router: Router = Router();

// Validation schemas
const createOfferSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  sellerId: z.string().uuid('Invalid seller ID'),
  offerAmountCents: z.number().int().min(500, 'Offer must be at least $5'),
  messageToSeller: z.string().max(500).optional(),
});

const counterOfferSchema = z.object({
  counterOfferAmountCents: z.number().int().min(500, 'Counter offer must be at least $5'),
  counterOfferMessage: z.string().max(500).optional(),
});

// Create a new offer
router.post(
  '/',
  authenticate,
  validate(createOfferSchema),
  asyncHandler(async (req, res) => {
    const { bookId, sellerId, offerAmountCents, messageToSeller } = req.body;
    const buyerId = req.user!.userId;

    // Validate buyer is not the seller
    if (buyerId === sellerId) {
      res.status(400).json({
        success: false,
        error: 'You cannot make an offer on your own book',
      });
      return;
    }

    const offer = await OfferService.createOffer(
      buyerId,
      sellerId,
      bookId,
      offerAmountCents,
      messageToSeller
    );

    const response: ApiResponse = {
      success: true,
      data: offer,
      message: 'Offer created successfully. The seller will be notified.',
    };

    res.status(201).json(response);
  })
);

// Get offers (filtered by query params)
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { type, status, bookId } = req.query;

    const filter: any = { status: status as string, bookId: bookId as string };

    // Filter by type (sent or received)
    if (type === 'sent') {
      filter.buyerId = userId;
    } else if (type === 'received') {
      filter.sellerId = userId;
    } else {
      // Get all offers where user is either buyer or seller
      // We'll handle this by getting both and merging
      const sentOffers = await OfferService.getOffers({ buyerId: userId, status: status as string });
      const receivedOffers = await OfferService.getOffers({ sellerId: userId, status: status as string });
      
      // Merge and deduplicate
      const allOffers = [...sentOffers, ...receivedOffers];
      const uniqueOffers = Array.from(new Map(allOffers.map(o => [o.id, o])).values());
      
      const response: ApiResponse = {
        success: true,
        data: uniqueOffers,
      };

      res.json(response);
      return;
    }

    const offers = await OfferService.getOffers(filter);

    const response: ApiResponse = {
      success: true,
      data: offers,
    };

    res.json(response);
  })
);

// Accept an offer
router.post(
  '/:id/accept',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user!.userId;

    try {
      const offer = await OfferService.acceptOffer(id, sellerId);

      const response: ApiResponse = {
        success: true,
        data: offer,
        message: 'Offer accepted! The buyer will be notified to complete the purchase.',
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

// Reject an offer
router.post(
  '/:id/reject',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user!.userId;

    try {
      const offer = await OfferService.rejectOffer(id, sellerId);

      const response: ApiResponse = {
        success: true,
        data: offer,
        message: 'Offer rejected.',
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

// Counter an offer
router.post(
  '/:id/counter',
  authenticate,
  validate(counterOfferSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { counterOfferAmountCents, counterOfferMessage } = req.body;
    const sellerId = req.user!.userId;

    try {
      const offer = await OfferService.counterOffer(
        id,
        sellerId,
        counterOfferAmountCents,
        counterOfferMessage
      );

      const response: ApiResponse = {
        success: true,
        data: offer,
        message: 'Counter offer sent! The buyer will be notified.',
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

