export type AuctionStatus = 'active' | 'ended' | 'cancelled';

export interface Auction {
  id: string;
  bookId: string;
  sellerId: string;
  
  startingBidCents: number;
  currentBidCents: number;
  reservePriceCents?: number; // Nullable - optional reserve
  currentHighBidderId?: string;
  
  status: AuctionStatus;
  
  // Timing
  startTime: string;
  endTime: string;
  
  // Stats
  totalBids: number;
  uniqueBidders: number;
  
  // Relations
  book?: Book;
  seller?: User;
  currentHighBidder?: User;
  bids?: AuctionBid[];
  
  createdAt: string;
  updatedAt: string;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  
  bidAmountCents: number;
  autoBidMaxCents?: number; // For automatic bidding
  
  isAutoBid: boolean; // Was this bid placed automatically?
  isWinningBid: boolean; // Updated when auction ends
  
  // Relations
  auction?: Auction;
  bidder?: User;
  
  bidTime: string;
  createdAt: string;
}

export interface CreateAuctionRequest {
  bookId: string;
  startingBidCents: number;
  reservePriceCents?: number;
  durationHours: number; // Duration from now
}

export interface PlaceBidRequest {
  auctionId: string;
  bidAmountCents: number;
  autoBidMaxCents?: number; // Enable automatic bidding up to this amount
}

export interface AuctionListResponse {
  auctions: Auction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuctionBidListResponse {
  bids: AuctionBid[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuctionSearchParams {
  status?: AuctionStatus;
  minBid?: number;
  maxBid?: number;
  endingSoon?: boolean; // Next 24 hours
  hasReserve?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'ending_soon' | 'newest' | 'bid_amount' | 'total_bids';
  sortOrder?: 'asc' | 'desc';
}

// Import types from other files
import type { User } from './user';
import type { Book } from './book';

