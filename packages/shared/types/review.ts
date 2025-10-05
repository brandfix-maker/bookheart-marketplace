export type ReviewType = 'seller' | 'buyer';

export interface Review {
  id: string;
  transactionId: string;
  reviewerId: string;
  reviewedUserId: string;
  reviewType: ReviewType;
  rating: number; // 1-5
  comment?: string;
  conditionAccurate?: boolean;
  shippingSpeed?: number; // 1-5
  communication?: number; // 1-5
  sellerResponse?: string;
  sellerRespondedAt?: string;
  
  // Relations
  reviewer?: User;
  reviewedUser?: User;
  transaction?: Transaction;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  transactionId: string;
  rating: number;
  comment?: string;
  conditionAccurate?: boolean;
  shippingSpeed?: number;
  communication?: number;
}

export interface SellerResponseRequest {
  response: string;
}

export interface UserReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  averageShippingSpeed?: number;
  averageCommunication?: number;
  conditionAccuratePercentage?: number;
}

// Import types from other files
import type { User } from './user';
import type { Transaction } from './transaction';
