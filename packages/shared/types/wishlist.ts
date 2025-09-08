export interface Wishlist {
  id: string;
  userId: string;
  bookId: string;
  notifyOnPriceDrop: boolean;
  
  // Relations
  user?: User;
  book?: Book;
  
  createdAt: string;
}

export interface AddToWishlistRequest {
  bookId: string;
  notifyOnPriceDrop?: boolean;
}

export interface WishlistNotification {
  type: 'price_drop' | 'back_in_stock';
  bookId: string;
  bookTitle: string;
  oldPriceCents?: number;
  newPriceCents?: number;
  message: string;
}

// Import types from other files
import type { User } from './user';
import type { Book } from './book';
