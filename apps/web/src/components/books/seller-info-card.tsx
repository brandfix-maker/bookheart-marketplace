'use client';

import { Star, MapPin, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface Seller {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  sellerVerified: boolean;
  location?: string;
}

interface SellerInfoCardProps {
  seller: Seller;
  bookId: string;
}

export function SellerInfoCard({ seller, bookId }: SellerInfoCardProps) {
  // Placeholder data - TODO: Fetch real seller stats
  const sellerStats = {
    rating: 4.8,
    salesCount: 127,
    responseTime: '2 hours',
  };

  const displayName = seller.displayName || seller.username;

  return (
    <div className="p-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg">
      <h3 className="font-semibold text-lg text-white mb-4">Seller Information</h3>

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {seller.avatarUrl ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600">
              <Image
                src={seller.avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-600">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-medium text-lg truncate">{displayName}</h4>
            {seller.sellerVerified && (
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{sellerStats.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span>{sellerStats.salesCount} sales</span>
          </div>

          {/* Response Time */}
          <p className="text-sm text-gray-400 mb-2">
            Usually responds within {sellerStats.responseTime}
          </p>

          {/* Location */}
          {seller.location && (
            <div className="flex items-center gap-1 text-sm text-gray-400 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{seller.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        <Button 
          asChild
          variant="outline"
          className="w-full border border-gray-600 bg-gray-700/50 hover:bg-gray-700 text-white"
        >
          <Link href={`/seller/${seller.username}`}>
            View Shop
          </Link>
        </Button>

        <Button 
          variant="outline"
          className="w-full border border-gray-600 bg-gray-700/50 hover:bg-gray-700 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Message Seller
        </Button>
      </div>
    </div>
  );
}

