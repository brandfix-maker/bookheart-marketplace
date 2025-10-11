import { db } from '@bookheart/database';
import { sql } from 'drizzle-orm';

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

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string,
    relatedType?: NotificationRelatedType
  ): Promise<Notification> {
    try {
      const result = await db.execute(sql`
        INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
        VALUES (${userId}, ${type}, ${title}, ${message}, ${relatedId || null}, ${relatedType || null})
        RETURNING *
      `);

      const notification = result.rows[0] as any;

      console.log('🔔 NotificationService.createNotification: Created notification:', notification.id);

      return this.formatNotification(notification);
    } catch (error) {
      console.error('🔔 NotificationService.createNotification: Error:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  static async getNotifications(
    userId: string,
    options: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<Notification[]> {
    try {
      const { unreadOnly = false, limit = 50, offset = 0 } = options;

      let query = sql`
        SELECT * FROM notifications
        WHERE user_id = ${userId}
      `;

      if (unreadOnly) {
        query = sql`${query} AND is_read = false`;
      }

      query = sql`${query}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      const result = await db.execute(query);

      return result.rows.map((row: any) => this.formatNotification(row));
    } catch (error) {
      console.error('🔔 NotificationService.getNotifications: Error:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(id: string, userId: string): Promise<Notification> {
    try {
      const result = await db.execute(sql`
        UPDATE notifications
        SET is_read = true
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `);

      if (result.rows.length === 0) {
        throw new Error('Notification not found or access denied');
      }

      const notification = result.rows[0] as any;

      console.log('🔔 NotificationService.markAsRead: Marked notification as read:', id);

      return this.formatNotification(notification);
    } catch (error) {
      console.error('🔔 NotificationService.markAsRead: Error:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await db.execute(sql`
        UPDATE notifications
        SET is_read = true
        WHERE user_id = ${userId} AND is_read = false
        RETURNING id
      `);

      const count = result.rows.length;

      console.log('🔔 NotificationService.markAllAsRead: Marked', count, 'notifications as read');

      return count;
    } catch (error) {
      console.error('🔔 NotificationService.markAllAsRead: Error:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = ${userId} AND is_read = false
      `);

      const count = parseInt(String(result.rows[0]?.count || '0'), 10);

      return count;
    } catch (error) {
      console.error('🔔 NotificationService.getUnreadCount: Error:', error);
      throw error;
    }
  }

  /**
   * Delete old read notifications (cleanup)
   */
  static async deleteOldReadNotifications(userId: string, daysOld: number = 30): Promise<number> {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysOld);

      const result = await db.execute(sql`
        DELETE FROM notifications
        WHERE user_id = ${userId} 
        AND is_read = true 
        AND created_at < ${dateThreshold.toISOString()}
        RETURNING id
      `);

      const count = result.rows.length;

      console.log('🔔 NotificationService.deleteOldReadNotifications: Deleted', count, 'old notifications');

      return count;
    } catch (error) {
      console.error('🔔 NotificationService.deleteOldReadNotifications: Error:', error);
      throw error;
    }
  }

  /**
   * Format notification for API response
   */
  private static formatNotification(notification: any): Notification {
    return {
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      relatedId: notification.related_id,
      relatedType: notification.related_type,
      isRead: notification.is_read,
      createdAt: new Date(notification.created_at).toISOString(),
    };
  }
}

