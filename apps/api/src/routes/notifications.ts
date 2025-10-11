import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '@bookheart/shared';

const router: Router = Router();

// Get notifications for current user
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { unreadOnly, limit, offset } = req.query;

  const notifications = await NotificationService.getNotifications(userId, {
    unreadOnly: unreadOnly === 'true',
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });

  const response: ApiResponse = {
    success: true,
    data: notifications,
  };

  res.json(response);
}));

// Get unread notification count
router.get('/unread-count', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const count = await NotificationService.getUnreadCount(userId);

  const response: ApiResponse = {
    success: true,
    data: { count },
  };

  res.json(response);
}));

// Mark a notification as read
router.patch('/:id/read', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const notification = await NotificationService.markAsRead(id, userId);

    const response: ApiResponse = {
      success: true,
      data: notification,
    };

    res.json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}));

// Mark all notifications as read
router.patch('/read-all', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const count = await NotificationService.markAllAsRead(userId);

  const response: ApiResponse = {
    success: true,
    data: { count },
    message: `${count} notifications marked as read`,
  };

  res.json(response);
}));

export default router;

