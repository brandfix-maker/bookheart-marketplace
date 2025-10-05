'use client';

import React from 'react';
import { Book } from '@bookheart/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Eye, ShoppingCart, MapPin, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SellYoursPrompt } from './SellYoursPrompt';

interface BookCardProps {
  book: Book;
  showSeller?: boolean;
  onAddToWishlist?: (bookId: string) => void;
  onQuickView?: (bookId: string) => void;
  className?: string;
}

export function BookCard({ 
  book, 
  showSeller = false, 
  onAddToWishlist, 
  onQuickView,
  className 
}: BookCardProps) {
  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      'new': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'like-new': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'very-good': 'bg-amber-100 text-amber-800 border-amber-200',
      'good': 'bg-amber-100 text-amber-800 border-amber-200',
      'acceptable': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSpiceLevelText = (level?: number) => {
    if (level === undefined) return '';
    const levels = ['Closed Door', 'Mild', 'Moderate', 'Hot', 'Very Hot', 'Extreme'];
    return levels[level] || '';
  };

  const getSpiceLevelColor = (level?: number) => {
    if (level === undefined) return 'bg-gray-100 text-gray-800 border-gray-200';
    const colors = [
      'bg-gray-100 text-gray-800 border-gray-200',
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-red-100 text-red-800 border-red-200',
      'bg-red-200 text-red-900 border-red-300',
      'bg-red-300 text-red-900 border-red-400',
    ];
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const primaryImage = book.images?.find(img => img.isPrimary) || book.images?.[0];
  const imageUrl = primaryImage?.cloudinaryUrl || '/placeholder-book.jpg';

  return (
    <Card 
      className={`group relative flex flex-col h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
      data-stripe-product-id={book.id}
      data-seller-id={book.sellerId}
      data-price-cents={book.priceCents}
      data-condition={book.condition}
      data-special-edition={book.isSpecialEdition}
    >
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          priority={false}
        />
        
        {/* Progressive disclosure: "Sell Yours" prompt */}
        <SellYoursPrompt 
          bookTitle={book.title}
          bookAuthor={book.author}
          className="group-hover:opacity-100"
        />
        
        {/* Hover Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            {onQuickView && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onQuickView(book.id)}
                className="bg-white/90 hover:bg-white shadow-lg"
                aria-label={`Quick view ${book.title}`}
              >
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
            )}
            {onAddToWishlist && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onAddToWishlist(book.id)}
                className="bg-white/90 hover:bg-white shadow-lg"
                aria-label={`Add ${book.title} to wishlist`}
              >
                <Heart className="h-4 w-4 mr-1" />
                Wishlist
              </Button>
            )}
          </div>
        </div>

        {/* Badge Layer - Consistent positioning */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Condition Badge - Top Left */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getConditionColor(book.condition)}`}>
              {book.condition.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* Special Edition Badge - Top Right */}
          {book.isSpecialEdition && (
            <div className="absolute top-2 right-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                <Sparkles className="h-3 w-3 mr-1" />
                Special Edition
              </div>
            </div>
          )}

          {/* Spice Level Badge - Bottom Left */}
          {book.spiceLevel !== undefined && (
            <div className="absolute bottom-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSpiceLevelColor(book.spiceLevel)}`}>
                {getSpiceLevelText(book.spiceLevel)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section - Flex column with consistent spacing */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Title and Author */}
        <div className="flex-grow">
          <h3 
            className="font-serif font-semibold text-gray-900 mb-1 overflow-hidden" 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
            aria-label={`Book title: ${book.title}`}
          >
            {book.title}
          </h3>
          <p 
            className="text-sm text-gray-600 overflow-hidden" 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            by {book.author}
          </p>
        </div>

        {/* Series Info */}
        {book.seriesName && (
          <div className="text-xs text-purple-600 font-medium">
            {book.seriesName}
            {book.seriesNumber && ` #${book.seriesNumber}`}
          </div>
        )}

        {/* Genre Tags */}
        {book.tropes && book.tropes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.tropes.slice(0, 3).map((trope, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
              >
                {trope.replace(/-/g, ' ')}
              </span>
            ))}
            {book.tropes.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{book.tropes.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Seller Info */}
        {showSeller && book.seller && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-purple-600" />
            </div>
            <span>{book.seller.displayName || book.seller.username}</span>
            {book.seller.sellerVerified && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
          </div>
        )}

        {/* Pricing Section - Clear separation */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(book.priceCents)}
              </div>
              {book.shippingPriceCents > 0 && (
                <div className="text-sm text-gray-500">
                  +{formatPrice(book.shippingPriceCents)} shipping
                </div>
              )}
              {book.localPickupAvailable && (
                <div className="text-xs text-green-600 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  Local pickup available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section - Always at bottom */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{book.viewCount || 0} views</span>
            </div>
            <div className="text-xs">
              {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* View Details Button - Full width */}
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 group-hover:shadow-lg"
            aria-label={`View details for ${book.title}`}
          >
            <Link href={`/books/${book.id}`}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Enhanced Grid component with responsive breakpoints
interface BookGridProps {
  books: Book[];
  showSeller?: boolean;
  onAddToWishlist?: (bookId: string) => void;
  onQuickView?: (bookId: string) => void;
  className?: string;
}

export function BookGrid({ 
  books, 
  showSeller = false, 
  onAddToWishlist, 
  onQuickView,
  className 
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ${className}`}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          showSeller={showSeller}
          onAddToWishlist={onAddToWishlist}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}