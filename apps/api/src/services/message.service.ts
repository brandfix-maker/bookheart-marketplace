import { db, messages, users, eq, and, or, desc, sql } from '@bookheart/database';
import { Message } from '@bookheart/shared';
import { NotificationService } from './notification.service';

interface Conversation {
  otherUserId: string;
  otherUsername: string;
  otherUserAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export class MessageService {
  /**
   * Send a message
   */
  static async sendMessage(
    senderId: string,
    recipientId: string,
    messageText: string,
    bookId?: string,
    transactionId?: string
  ): Promise<Message> {
    console.log('✉️ MessageService.sendMessage: Sending message from', senderId, 'to', recipientId);

    if (senderId === recipientId) {
      throw new Error('You cannot send a message to yourself');
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        senderId,
        recipientId,
        messageText,
        bookId: bookId || null,
        transactionId: transactionId || null,
        isRead: false,
      })
      .returning();

    // Get sender username for notification
    const [sender] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.id, senderId))
      .limit(1);
    const senderName = sender?.username || 'Someone';

    // Create notification for recipient
    await NotificationService.createNotification(
      recipientId,
      'message_received',
      'New Message',
      `${senderName} sent you a message`,
      newMessage.id,
      'message'
    ).catch(err => console.error('Failed to create notification:', err));

    console.log('✉️ MessageService.sendMessage: Message sent with ID:', newMessage.id);
    return this.formatMessage(newMessage as any);
  }

  /**
   * Get conversations for a user (grouped by other participant)
   */
  static async getConversations(userId: string): Promise<Conversation[]> {
    console.log('✉️ MessageService.getConversations: Fetching conversations for user:', userId);

    // Get all messages where user is sender or recipient
    const userMessages = await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        recipientId: messages.recipientId,
        messageText: messages.messageText,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.recipientId, userId)))
      .orderBy(desc(messages.createdAt));

    // Group by conversation (other user)
    const conversationsMap = new Map<string, any>();

    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.recipientId : message.senderId;

      if (!conversationsMap.has(otherUserId)) {
        // Get other user's details
        const [otherUser] = await db
          .select({
            username: users.username,
            displayName: users.displayName,
            avatarUrl: users.avatarUrl,
          })
          .from(users)
          .where(eq(users.id, otherUserId));

        // Count unread messages from this user
        const unreadCount = userMessages.filter(
          (m) => m.senderId === otherUserId && m.recipientId === userId && !m.isRead
        ).length;

        conversationsMap.set(otherUserId, {
          otherUserId,
          otherUsername: otherUser?.username || 'Unknown',
          otherUserAvatar: otherUser?.avatarUrl || undefined,
          lastMessage: message.messageText,
          lastMessageAt: message.createdAt.toISOString(),
          unreadCount,
        });
      }
    }

    return Array.from(conversationsMap.values());
  }

  /**
   * Get full conversation thread between two users
   */
  static async getThread(
    userId: string,
    otherUserId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    console.log('✉️ MessageService.getThread: Fetching thread between', userId, 'and', otherUserId);

    const thread = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.recipientId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.recipientId, userId))
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    // Reverse to show oldest first
    return thread.reverse().map((msg) => this.formatMessage(msg as any));
  }

  /**
   * Mark a message as read
   */
  static async markAsRead(messageId: string, userId: string): Promise<Message> {
    console.log('✉️ MessageService.markAsRead: Marking message as read:', messageId);

    // Verify user is the recipient
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.recipientId !== userId) {
      throw new Error('Unauthorized: You are not the recipient of this message');
    }

    if (message.isRead) {
      return this.formatMessage(message as any);
    }

    const [updatedMessage] = await db
      .update(messages)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(eq(messages.id, messageId))
      .returning();

    console.log('✉️ MessageService.markAsRead: Message marked as read');
    return this.formatMessage(updatedMessage as any);
  }

  /**
   * Mark all messages from a user as read
   */
  static async markThreadAsRead(userId: string, otherUserId: string): Promise<void> {
    console.log('✉️ MessageService.markThreadAsRead: Marking thread as read');

    await db
      .update(messages)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.recipientId, userId),
          eq(messages.isRead, false)
        )
      );

    console.log('✉️ MessageService.markThreadAsRead: Thread marked as read');
  }

  /**
   * Get unread message count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(and(eq(messages.recipientId, userId), eq(messages.isRead, false)));

    return result?.count || 0;
  }

  /**
   * Format message for API response
   */
  private static formatMessage(message: any): Message {
    return {
      id: message.id,
      senderId: message.senderId,
      recipientId: message.recipientId,
      bookId: message.bookId || undefined,
      transactionId: message.transactionId || undefined,
      messageText: message.messageText,
      isRead: message.isRead,
      readAt: message.readAt ? message.readAt.toISOString() : undefined,
      createdAt: message.createdAt.toISOString(),
    };
  }
}

