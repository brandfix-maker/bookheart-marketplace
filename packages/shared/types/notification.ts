/**
 * Notification Types
 * Types for the notification system
 */

export type NotificationType =
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'offer_countered'
  | 'message_received'
  | 'book_sold';

export type NotificationRelatedType = 'offer' | 'transaction' | 'message' | 'book';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: NotificationRelatedType;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: NotificationRelatedType;
}

