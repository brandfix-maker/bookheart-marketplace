export type TransactionType = 'buy_now' | 'accepted_offer' | 'auction_win';
export type TransactionStatus = 
  | 'pending_payment' 
  | 'paid' 
  | 'shipped' 
  | 'delivered' 
  | 'inspection_approved'
  | 'disputed' 
  | 'completed' 
  | 'cancelled'
  | 'refunded';

export interface Transaction {
  id: string;
  bookId: string;
  buyerId: string;
  sellerId: string;
  
  transactionType: TransactionType;
  
  itemPriceCents: number;
  shippingCents: number;
  platformFeeCents: number;
  sellerPayoutCents: number;
  totalCents: number;
  status: TransactionStatus;
  
  // Stripe
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  stripeRefundId?: string;
  
  // Milestones
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  inspectionDeadline?: string; // 72 hours after delivery
  inspectionApprovedAt?: string;
  completedAt?: string;
  disputedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  
  // Shipping
  shippingMethod?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  
  // Local pickup
  pickupLocation?: string;
  pickupScheduledAt?: string;
  pickupConfirmedAt?: string;
  
  // Relations
  book?: Book;
  buyer?: User;
  seller?: User;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  bookId: string;
  shippingMethod?: string;
  pickupLocation?: string;
  pickupScheduledAt?: string;
}

export interface UpdateTransactionRequest {
  trackingNumber?: string;
  trackingCarrier?: string;
  pickupConfirmedAt?: string;
}

export interface ShipTransactionRequest {
  trackingNumber: string;
  trackingCarrier: string;
}

export interface DisputeTransactionRequest {
  reason: string;
  details?: string;
}

// Import types from other files
import type { Book } from './book';
import type { User } from './user';
