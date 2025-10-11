'use client';

import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/wishlist-context';
import { toast } from '@/components/ui/use-toast';
import { OfferModal } from './offer-modal';
import { MessageModal } from './message-modal';
import { BidModal } from './bid-modal';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  condition: string;
  priceCents: number;
  shippingPriceCents: number;
  acceptsOffers: boolean;
  status: string;
  isbn?: string;
  seriesName?: string;
  seriesNumber?: number;
  isSpecialEdition: boolean;
  isSigned: boolean;
  signatureType?: string;
  subscriptionBox?: string;
  spiceLevel?: number;
  seller?: {
    id: string;
    username: string;
    displayName?: string;
  };
}

interface Auction {
  id: string;
  currentBidCents: number;
  status: string;
  bidCount: number;
  endTime: string;
}

interface BookInfoSectionProps {
  book: Book;
  auction?: Auction | null;
}

const CONDITION_COLORS: Record<string, string> = {
  'new': 'bg-green-900/30 text-green-400 border border-green-500',
  'like-new': 'bg-green-900/30 text-green-400 border border-green-500',
  'very-good': 'bg-blue-900/30 text-blue-400 border border-blue-500',
  'good': 'bg-yellow-900/30 text-yellow-400 border border-yellow-500',
  'acceptable': 'bg-orange-900/30 text-orange-400 border border-orange-500',
};

export function BookInfoSection({ book, auction }: BookInfoSectionProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const isBookInWishlist = isInWishlist(book.id);
  
  // Modal states
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleWishlistToggle = () => {
    toggleItem({
      bookId: book.id,
      title: book.title,
      author: book.author,
    });
    
    toast({
      title: isBookInWishlist ? 'Removed from wishlist' : 'Added to wishlist! 💜',
      description: isBookInWishlist 
        ? `${book.title} has been removed from your wishlist.`
        : `${book.title} has been added to your wishlist.`,
    });
  };

  const getConditionBadgeClass = (condition: string) => {
    return CONDITION_COLORS[condition.toLowerCase()] || 'bg-gray-700/50 text-gray-300 border border-gray-600';
  };

  const renderSpiceLevel = (level?: number) => {
    if (!level) return null;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < level ? 'text-red-500' : 'text-gray-600'}>
            🌶️
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Title & Author */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-white mb-2">
          {book.title}
        </h1>
        <p className="text-xl text-gray-300">by {book.author}</p>
      </div>

      {/* Key Details Card */}
      <div className="mt-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg space-y-3">
        {/* Condition */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-400">Condition</span>
          <span className={`px-3 py-1 rounded text-sm font-medium ${getConditionBadgeClass(book.condition)}`}>
            {book.condition.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        </div>

        {/* Special Edition */}
        {book.isSpecialEdition && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Edition</span>
            <span className="text-base text-white flex items-center gap-1">
              <span>✨</span> Special Edition
            </span>
          </div>
        )}

        {/* Signed */}
        {book.isSigned && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Signed</span>
            <span className="text-base text-white">
              Yes {book.signatureType && `(${book.signatureType})`}
            </span>
          </div>
        )}

        {/* Subscription Box */}
        {book.subscriptionBox && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Box</span>
            <span className="text-base text-white">{book.subscriptionBox}</span>
          </div>
        )}

        {/* Series */}
        {book.seriesName && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Series</span>
            <span className="text-base text-white">
              {book.seriesName} {book.seriesNumber && `#${book.seriesNumber}`}
            </span>
          </div>
        )}

        {/* ISBN */}
        {book.isbn && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">ISBN</span>
            <span className="text-base text-white font-mono text-sm">{book.isbn}</span>
          </div>
        )}

        {/* Spice Level */}
        {book.spiceLevel !== undefined && book.spiceLevel > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Spice Level</span>
            {renderSpiceLevel(book.spiceLevel)}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="mt-6 p-6 bg-gray-700/50 border border-gray-600 rounded-lg">
        {auction && auction.status === 'active' ? (
          <>
            <div className="text-sm text-purple-400 font-semibold uppercase mb-1">Current Bid</div>
            <div className="text-3xl font-bold text-white">{formatPrice(auction.currentBidCents)}</div>
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-white">{formatPrice(book.priceCents)}</div>
            {book.shippingPriceCents > 0 && (
              <div className="text-sm text-gray-400 mt-1">
                + {formatPrice(book.shippingPriceCents)} shipping
              </div>
            )}
            {book.acceptsOffers && (
              <div className="text-sm text-purple-400 mt-2">
                💬 Seller accepts offers
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      {book.status === 'sold' ? (
        <div className="mt-6">
          <div className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-center">
            <span className="text-gray-400 font-medium">This book has been sold</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {auction && auction.status === 'active' ? (
            <Button 
              onClick={() => setShowBidModal(true)}
              className="w-full bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 hover:from-brand-pink-700 hover:to-brand-purple-700 text-white py-6 text-lg font-semibold"
            >
              Place Bid
            </Button>
          ) : (
            <>
              <Button 
                asChild
                className="w-full bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 hover:from-brand-pink-700 hover:to-brand-purple-700 text-white py-6 text-lg font-semibold"
              >
                <Link href={`/checkout?bookId=${book.id}`}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Link>
              </Button>

              {book.acceptsOffers && (
                <Button 
                  onClick={() => setShowOfferModal(true)}
                  className="w-full border-2 border-gray-600 bg-gray-700/50 hover:bg-gray-700 text-white py-6 text-lg"
                >
                  Make an Offer
                </Button>
              )}
            </>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`
              w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-all
              ${isBookInWishlist 
                ? 'border border-brand-pink-500 bg-brand-pink-900/30 hover:bg-brand-pink-900/50 text-brand-pink-400' 
                : 'border border-gray-600 bg-gray-700/50 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <Heart className={`w-5 h-5 ${isBookInWishlist ? 'fill-brand-pink-500' : ''}`} />
            {isBookInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      )}

      {/* Modals */}
      {showOfferModal && book.seller && (
        <OfferModal
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          bookId={book.id}
          askingPrice={book.priceCents / 100}
          sellerId={book.seller.id}
        />
      )}

      {showMessageModal && book.seller && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          bookId={book.id}
          sellerId={book.seller.id}
          sellerUsername={book.seller.username}
          bookTitle={book.title}
        />
      )}

      {showBidModal && auction && (
        <BidModal
          isOpen={showBidModal}
          onClose={() => setShowBidModal(false)}
          auctionId={auction.id}
          currentBid={auction.currentBidCents / 100}
          minimumBid={(auction.currentBidCents / 100) + 0.01}
          timeRemaining="2 days 5 hours"
          bidCount={auction.bidCount}
        />
      )}
    </div>
  );
}

