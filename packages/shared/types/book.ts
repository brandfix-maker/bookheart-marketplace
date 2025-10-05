export type BookCondition = 'new' | 'like-new' | 'very-good' | 'good' | 'acceptable';
export type BookStatus = 'draft' | 'active' | 'pending' | 'sold' | 'removed';
export type SubscriptionBox = 
  | 'FairyLoot' 
  | 'OwlCrate' 
  | 'IllumiCrate' 
  | 'Locked Library' 
  | 'Alluria' 
  | 'Acrylipics' 
  | 'Bookish' 
  | 'Bookish Darkly';
export type SignatureType = 'hand' | 'bookplate' | 'digital';

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
  acceptsOffers: boolean;
  localPickupAvailable: boolean;
  
  // Location for distance calculations
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Special editions
  isSpecialEdition: boolean;
  subscriptionBox?: SubscriptionBox;
  isSigned: boolean;
  signatureType?: SignatureType;
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
  firstEdition?: boolean;
  dustJacket?: boolean;
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
  images?: File[];
  status?: BookStatus;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  seriesName: string;
  seriesNumber: string;
  tropes: string[];
  spiceLevel: string;
  condition: BookCondition;
  conditionNotes: string;
  price: string;
  shippingPrice: string;
  localPickupAvailable: boolean;
  isSpecialEdition: boolean;
  specialEditionDetails: SpecialEditionDetails;
  images: File[];
  status: BookStatus;
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
  sortBy?: 'price' | 'newest' | 'title' | 'relevance' | 'views' | 'sellerRating';
  sortOrder?: 'asc' | 'desc';
  seriesName?: string;
  publishedYear?: number;
  sellerId?: string;
  location?: string;
  hasImages?: boolean;
  inStock?: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'author' | 'series' | 'trope';
  count?: number;
  popularity?: number;
}

export interface SearchAutocompleteResponse {
  suggestions: SearchSuggestion[];
  popularSearches: string[];
  trendingAuthors: string[];
  trendingSeries: string[];
  trendingTropes: string[];
}

export interface AdvancedSearchParams extends BookSearchParams {
  fuzzyMatch?: boolean;
  includeDescription?: boolean;
  minRating?: number;
  maxRating?: number;
  language?: string;
  format?: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  availability?: 'available' | 'sold' | 'all';
  featured?: boolean;
  trending?: boolean;
  recentlyAdded?: boolean;
}

export interface SearchResult {
  items: Book[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  facets?: SearchFacets;
  suggestions?: SearchSuggestion[];
  searchTime?: number;
}

export interface SearchFacets {
  conditions: FacetCount[];
  priceRanges: FacetCount[];
  tropes: FacetCount[];
  spiceLevels: FacetCount[];
  authors: FacetCount[];
  series: FacetCount[];
  sellers: FacetCount[];
}

export interface FacetCount {
  value: string;
  count: number;
  label?: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  book: Book;
  addedAt: string;
  notes?: string;
}

export interface RecentlyViewedBook {
  bookId: string;
  book: Book;
  viewedAt: string;
  viewCount: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  searchParams: BookSearchParams;
  createdAt: string;
  lastUsed?: string;
  useCount: number;
  notifications?: boolean;
}

// Import User type from user.ts
import type { User } from './user';

// Image upload types
export interface ImageUploadResponse {
  publicId: string;
  url: string;
  width: number;
  height: number;
}

export interface BookListingStats {
  totalListings: number;
  activeListings: number;
  draftListings: number;
  soldListings: number;
  totalViews: number;
  totalRevenue: number;
}

// Romantasy tropes for selection
export const ROMANTASY_TROPES = [
  'enemies-to-lovers',
  'friends-to-lovers',
  'second-chance-romance',
  'fated-mates',
  'forbidden-love',
  'fake-dating',
  'marriage-of-convenience',
  'grumpy-sunshine',
  'opposites-attract',
  'slow-burn',
  'insta-love',
  'love-triangle',
  'age-gap',
  'brother\'s-best-friend',
  'best-friend\'s-sister',
  'small-town',
  'academic-rivals',
  'workplace-romance',
  'single-parent',
  'found-family',
  'magic-system',
  'fae',
  'vampires',
  'werewolves',
  'dragons',
  'angels',
  'demons',
  'gods',
  'immortals',
  'time-travel',
  'parallel-universe',
  'reincarnation',
  'soulmates',
  'prophecy',
  'chosen-one',
  'hidden-identity',
  'secret-royalty',
  'arranged-marriage',
  'forced-proximity',
  'only-one-bed',
  'hurt-comfort',
  'angst',
  'fluff',
  'steamy',
  'closed-door',
  'open-door',
  'dark-romance',
  'light-romance',
  'comedy',
  'drama'
] as const;

export type RomantasyTrope = typeof ROMANTASY_TROPES[number];
