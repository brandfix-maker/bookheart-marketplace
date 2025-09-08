export type BookCondition = 'new' | 'like-new' | 'very-good' | 'good' | 'acceptable';
export type BookStatus = 'draft' | 'active' | 'pending' | 'sold' | 'removed';

export interface Book {
  id: string;
  sellerId: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  seriesName?: string;
  seriesNumber?: number;
  tropes: string[];
  spiceLevel?: number;
  condition: BookCondition;
  conditionNotes?: string;
  priceCents: number;
  shippingPriceCents: number;
  localPickupAvailable: boolean;
  isSpecialEdition: boolean;
  specialEditionDetails?: SpecialEditionDetails;
  status: BookStatus;
  images: BookImage[];
  seller?: User;
  slug?: string;
  viewCount: number;
  publishedAt?: string;
  soldAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialEditionDetails {
  paintedEdges?: boolean;
  signedCopy?: boolean;
  firstEdition?: boolean;
  exclusiveCover?: boolean;
  sprayed?: boolean;
  customDustJacket?: boolean;
  details?: string;
}

export interface BookImage {
  id: string;
  bookId: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  seriesName?: string;
  seriesNumber?: number;
  tropes: string[];
  spiceLevel?: number;
  condition: BookCondition;
  conditionNotes?: string;
  priceCents: number;
  shippingPriceCents?: number;
  localPickupAvailable?: boolean;
  isSpecialEdition?: boolean;
  specialEditionDetails?: SpecialEditionDetails;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  status?: BookStatus;
}

export interface BookSearchParams {
  query?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: BookCondition[];
  isSpecialEdition?: boolean;
  localPickupAvailable?: boolean;
  tropes?: string[];
  spiceLevel?: number[];
  page?: number;
  pageSize?: number;
  sortBy?: 'price' | 'newest' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Import User type from user.ts
import type { User } from './user';
