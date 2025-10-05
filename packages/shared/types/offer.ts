export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'countered';

export interface Offer {
  id: string;
  buyerId: string;
  sellerId: string;
  bookId: string;
  
  offerAmountCents: number;
  messageToSeller?: string;
  status: OfferStatus;
  
  // 48-hour expiration from creation
  expiresAt: string;
  
  // Counter offer
  counterOfferAmountCents?: number;
  counterOfferMessage?: string;
  
  // Response tracking
  respondedAt?: string;
  
  // Relations
  buyer?: User;
  seller?: User;
  book?: Book;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferRequest {
  bookId: string;
  offerAmountCents: number;
  messageToSeller?: string;
}

export interface CounterOfferRequest {
  counterOfferAmountCents: number;
  counterOfferMessage?: string;
}

export interface AcceptOfferRequest {
  offerId: string;
}

export interface RejectOfferRequest {
  offerId: string;
  reason?: string;
}

export interface OfferListResponse {
  offers: Offer[];
  total: number;
  page: number;
  pageSize: number;
}

// Import types from other files
import type { User } from './user';
import type { Book } from './book';

