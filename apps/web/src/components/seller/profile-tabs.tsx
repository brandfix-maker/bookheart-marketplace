'use client';

import { useState } from 'react';
import { BookCard } from '@/components/marketplace/book-card';
import { Star, Calendar } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  author: string;
  condition: string;
  priceCents: number;
  shippingPriceCents: number;
  images?: Array<{
    id: string;
    url: string;
    cloudinaryUrl: string;
    isPrimary: boolean;
  }>;
  seller?: {
    id: string;
    username: string;
    displayName?: string;
    rating?: {
      average: number;
      count: number;
    };
  };
  subscriptionBox?: string;
  isSpecialEdition: boolean;
  isSigned: boolean;
  specialEditionDetails?: {
    paintedEdges?: boolean;
    sprayedEdges?: boolean;
    foilStamped?: boolean;
    embossed?: boolean;
  };
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  buyer: {
    id: string;
    username: string;
    displayName?: string;
  };
  book: {
    id: string;
    title: string;
  };
}

interface ProfileTabsProps {
  username: string;
  listings: Listing[];
  reviews: Review[];
}

type TabType = 'listings' | 'reviews';

export function ProfileTabs({ username, listings, reviews }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('listings');

  const tabs = [
    { id: 'listings' as const, label: `Listings (${listings.length})` },
    { id: 'reviews' as const, label: `Reviews (${reviews.length})` },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  const renderListingsTab = () => (
    <div className="space-y-6">
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No listings yet</div>
          <div className="text-gray-500 text-sm">
            This seller hasn't listed any books yet.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <BookCard
              key={listing.id}
              book={listing}
              onWishlistToggle={() => {
                // TODO: Implement wishlist toggle
                console.log('Toggle wishlist for book:', listing.id);
              }}
              onAddToCart={() => {
                // TODO: Implement add to cart
                console.log('Add to cart:', listing.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderReviewsTab = () => (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No reviews yet</div>
          <div className="text-gray-500 text-sm">
            This seller hasn't received any reviews yet.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-700/50 border border-gray-600 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">
                      {review.buyer.displayName || review.buyer.username}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Review for: <span className="text-white">{review.book.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(review.createdAt)}
                </div>
              </div>

              {review.comment && (
                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Tab Headers */}
      <div className="border-b border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-brand-pink-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'listings' && renderListingsTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
      </div>
    </div>
  );
}
