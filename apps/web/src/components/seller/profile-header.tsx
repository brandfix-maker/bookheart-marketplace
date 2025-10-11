'use client';

import { useState } from 'react';
import { Star, Calendar, MessageCircle, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageModal } from '@/components/books/message-modal';
import Image from 'next/image';

interface Seller {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  sellerVerified: boolean;
  joinedAt: string;
  // Stats
  totalSales: number;
  averageRating: number;
  reviewCount: number;
  responseTime: string;
}

interface Listing {
  id: string;
  title: string;
  priceCents: number;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ProfileHeaderProps {
  seller: Seller;
  listings: Listing[];
  reviews: Review[];
}

export function ProfileHeader({ seller, listings, reviews }: ProfileHeaderProps) {
  const [showMessageModal, setShowMessageModal] = useState(false);

  const displayName = seller.displayName || seller.username;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          {seller.avatarUrl ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-600">
              <Image
                src={seller.avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-purple-600 to-brand-pink-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-600">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Main Info */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                {seller.sellerVerified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 border border-green-500 rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>

              {/* Bio */}
              {seller.bio && (
                <p className="text-gray-300 mb-4 max-w-2xl">{seller.bio}</p>
              )}

              {/* Location */}
              {seller.location && (
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{seller.location}</span>
                </div>
              )}

              {/* Join Date */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Member since {formatDate(seller.joinedAt)}</span>
              </div>
            </div>

            {/* Message Button */}
            <Button
              onClick={() => setShowMessageModal(true)}
              className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 hover:from-brand-pink-700 hover:to-brand-purple-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message Seller
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{listings.length}</div>
          <div className="text-sm text-gray-400">Active Listings</div>
        </div>

        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{seller.averageRating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-gray-400">{seller.reviewCount} Reviews</div>
        </div>

        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{seller.totalSales}</div>
          <div className="text-sm text-gray-400">Total Sales</div>
        </div>

        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{seller.responseTime}</div>
          <div className="text-sm text-gray-400">Avg Response</div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          bookId=""
          sellerId={seller.id}
          sellerUsername={seller.username}
          bookTitle="general inquiry"
        />
      )}
    </div>
  );
}
