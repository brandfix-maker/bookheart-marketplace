/**
 * Dashboard Types
 * Types for seller dashboard metrics and analytics
 */

export interface DashboardMetrics {
  activeListings: number;
  viewsThisWeek: number;
  unreadMessages: number;
  salesThisMonth: number;
}

export interface SellerStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalRevenue: number;
  totalViews: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface ListingPerformance {
  bookId: string;
  title: string;
  views: number;
  wishlistAdds: number;
  offersReceived: number;
  daysOnMarket: number;
  status: string;
}

