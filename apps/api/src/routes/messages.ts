import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { validate } from '../middleware/validation';
import { MessageService } from '../services/message.service';
import { ApiResponse } from '@bookheart/shared';
import { z } from 'zod';

const router: Router = Router();

// Validation schemas
const sendMessageSchema = z.object({
  recipientId: z.string().uuid('Invalid recipient ID'),
  messageText: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  bookId: z.string().uuid().optional(),
  transactionId: z.string().uuid().optional(),
});

// Send a message
router.post(
  '/',
  authenticate,
  validate(sendMessageSchema),
  asyncHandler(async (req, res) => {
    const { recipientId, messageText, bookId, transactionId } = req.body;
    const senderId = req.user!.userId;

    try {
      const message = await MessageService.sendMessage(
        senderId,
        recipientId,
        messageText,
        bookId,
        transactionId
      );

      const response: ApiResponse = {
        success: true,
        data: message,
        message: 'Message sent successfully',
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

// Get conversations list
router.get(
  '/conversations',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const conversations = await MessageService.getConversations(userId);

    const response: ApiResponse = {
      success: true,
      data: conversations,
    };

    res.json(response);
  })
);

// Get conversation thread with a specific user
router.get(
  '/thread/:userId',
  authenticate,
  asyncHandler(async (req, res) => {
    const currentUserId = req.user!.userId;
    const { userId: otherUserId } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const thread = await MessageService.getThread(currentUserId, otherUserId, limit, offset);

    // Mark messages from other user as read
    await MessageService.markThreadAsRead(currentUserId, otherUserId);

    const response: ApiResponse = {
      success: true,
      data: thread,
    };

    res.json(response);
  })
);

// Mark a specific message as read
router.put(
  '/:id/read',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    try {
      const message = await MessageService.markAsRead(id, userId);

      const response: ApiResponse = {
        success: true,
        data: message,
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

// Get unread message count
router.get(
  '/unread-count',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const count = await MessageService.getUnreadCount(userId);

    const response: ApiResponse = {
      success: true,
      data: { count },
    };

    res.json(response);
  })
);

export default router;

