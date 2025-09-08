export interface Message {
  id: string;
  transactionId?: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  
  // Relations
  sender?: User;
  recipient?: User;
  transaction?: Transaction;
  
  createdAt: string;
}

export interface SendMessageRequest {
  recipientId: string;
  content: string;
  transactionId?: string;
}

export interface MessageThread {
  userId: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface MarkAsReadRequest {
  messageIds: string[];
}

// Import types from other files
import type { User } from './user';
import type { Transaction } from './transaction';
