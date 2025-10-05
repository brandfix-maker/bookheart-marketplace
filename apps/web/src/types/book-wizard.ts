import { BookCondition, SubscriptionBox, SignatureType } from '@bookheart/shared';

export interface BookWizardData {
  // Step 1: Book Identification
  bookIdentification: {
    searchMethod: 'api' | 'manual';
    selectedBook?: ExternalBookData;
    title: string;
    author: string;
    isbn?: string;
    seriesName?: string;
    seriesNumber?: string;
  };

  // Step 2: Edition Details
  editionDetails: {
    editionType: 'special' | 'first' | 'standard';
    subscriptionBoxes: SubscriptionBox[];
    isSigned: boolean;
    signatureType?: SignatureType | 'other';
    specialFeatures: {
      paintedEdges: boolean;
      paintedEdgesColor?: string;
      dustJacket: boolean;
      firstEdition: boolean;
      exclusiveCover: boolean;
    };
    additionalDetails?: string;
  };

  // Step 3: Condition Grading
  conditionGrading: {
    condition: BookCondition;
    conditionNotes: string;
  };

  // Step 4: Photos
  photos: {
    images: ImageUpload[];
  };

  // Step 5: Tropes & Tags
  tropesAndTags: {
    tropes: string[];
    spiceLevel: number;
  };

  // Step 6: Pricing & Shipping
  pricingAndShipping: {
    price: string;
    acceptsOffers: boolean;
    enableAuction: boolean;
    startingBid?: string;
    reservePrice?: string;
    shippingPrice: string;
    localPickupAvailable: boolean;
    zipCode?: string;
    allowBundles: boolean;
  };

  // Step 7: Your Story
  yourStory: {
    description: string;
  };
}

export interface ImageUpload {
  id: string;
  file?: File;
  preview: string;
  type: ImageType;
  uploaded: boolean;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  order: number;
}

export type ImageType =
  | 'front-cover'
  | 'back-cover'
  | 'dust-jacket-spine'
  | 'end-pages'
  | 'fore-edge'
  | 'top-edge'
  | 'bottom-edge'
  | 'signature'
  | 'flaws'
  | 'additional';

export interface ExternalBookData {
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  description?: string;
  publishedYear?: number;
  publisher?: string;
}

export interface PriceSuggestion {
  min: number;
  max: number;
  average: number;
  confidence: 'high' | 'medium' | 'low';
}

export const IMAGE_SLOT_CONFIG: Array<{ type: ImageType; label: string; required: boolean; description: string }> = [
  { type: 'front-cover', label: 'Front Cover', required: true, description: 'With dust jacket if applicable' },
  { type: 'back-cover', label: 'Back Cover', required: true, description: 'Clear view of back' },
  { type: 'dust-jacket-spine', label: 'Dust Jacket/Spine', required: true, description: 'Full jacket or spine view' },
  { type: 'end-pages', label: 'End Pages', required: true, description: 'Show decorative elements' },
  { type: 'fore-edge', label: 'Fore-Edge', required: true, description: 'Longest edge opposite spine' },
  { type: 'top-edge', label: 'Top Edge', required: true, description: 'Top of pages' },
  { type: 'bottom-edge', label: 'Bottom Edge', required: true, description: 'Bottom of pages' },
  { type: 'signature', label: 'Signature Page', required: false, description: 'If book is signed' },
  { type: 'flaws', label: 'Any Flaws', required: false, description: 'Show condition issues' },
];
