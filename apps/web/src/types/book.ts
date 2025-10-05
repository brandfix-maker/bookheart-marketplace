export type BookCondition = 'new' | 'like-new' | 'very-good' | 'good' | 'acceptable';

// 8 common special-edition subscription boxes
export type SubscriptionBox =
  | 'FairyLoot'
  | 'OwlCrate'
  | 'Illumicrate'
  | 'The Broken Binding'
  | 'Fae Crate'
  | 'BookishBox'
  | 'LitJoy'
  | 'Goldsboro';

export interface BookImage {
  id: string;
  cloudinaryUrl: string;
  cloudinaryPublicId?: string;
  url?: string; // Legacy support
  altText?: string;
  isPrimary: boolean;
  order?: number;
  width?: number;
  height?: number;
  createdAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  images: BookImage[];
  priceCents: number;
  shippingPriceCents?: number; // API uses this name
  shippingCents?: number; // Legacy support
  condition: BookCondition;
  subscriptionBox?: SubscriptionBox | string;
  isSigned?: boolean;
  tropes?: string[];
  specialEditionDetails?: {
    paintedEdges?: boolean;
    firstEdition?: boolean;
    dustJacket?: boolean;
  };

  // Seller info (populated by API)
  seller?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    location?: string;
    sellerVerified?: boolean;
    rating?: {
      average: number;
      count: number;
    };
  };

  // Optional extras
  description?: string;
  isbn?: string;
  seriesName?: string;
  seriesNumber?: number;
  spiceLevel?: number;
  sellerId?: string;
  sellerUsername?: string;
  sellerRating?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  slug?: string;
  status?: string;
  localPickupAvailable?: boolean;
  acceptsOffers?: boolean;
  conditionNotes?: string;
  signatureType?: string;
  viewCount?: number;
  publishedAt?: string;
  soldAt?: string;
  createdAt?: string;
  updatedAt?: string;
}