export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  bookId?: string; // Context for message
  transactionId?: string;
  messageText: string;
  isRead: boolean;
  readAt?: string;
  
  // Relations
  sender?: User;
  recipient?: User;
  book?: Book;
  transaction?: Transaction;
  
  createdAt: string;
}

export interface SendMessageRequest {
  recipientId: string;
  messageText: string;
  bookId?: string;
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
import type { Book } from './book';
import type { Transaction } from './transaction';
