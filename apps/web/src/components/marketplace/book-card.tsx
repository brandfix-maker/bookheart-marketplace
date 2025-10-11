'use client';

import { Book } from '@/types/book';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingCart, Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_BOXES } from '@/lib/tropes-data';

interface BookCardProps {
  book: Book & {
    seller?: {
      id: string;
      username: string;
      displayName?: string;
      location?: string;
      rating?: {
        average: number;
        count: number;
      };
    };
  };
  onWishlistToggle?: (bookId: string) => void;
  onAddToCart?: (bookId: string) => void;
  isWishlisted?: boolean;
  showDistance?: boolean;
  distance?: string;
}

export function BookCard({
  book,
  onWishlistToggle,
  onAddToCart,
  isWishlisted = false,
  showDistance = false,
  distance,
}: BookCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = book.images?.find(img => img.isPrimary) || book.images?.[0];
  const displayImages = book.images || [];
  
  const price = (book.priceCents || 0) / 100;
  const shippingPrice = (book.shippingPriceCents || book.shippingCents || 0) / 100;

  const subscriptionBoxData = book.subscriptionBox 
    ? SUBSCRIPTION_BOXES.find(box => box.value === book.subscriptionBox)
    : null;

  // Check if book is new (published within last 48 hours)
  const isNew = book.publishedAt 
    ? new Date(book.publishedAt) > new Date(Date.now() - 48 * 60 * 60 * 1000)
    : false;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(book.id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(book.id);
  };

  return (
    <Link href={`/books/${book.id}`}>
      <div
        className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setImageIndex(0);
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={displayImages[imageIndex]?.cloudinaryUrl || displayImages[imageIndex]?.url || primaryImage.cloudinaryUrl || primaryImage.url || ''}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-green-500 text-white hover:bg-green-600 text-xs font-bold">
                NEW
              </Badge>
            )}
            {book.isSigned && (
              <Badge className="bg-amber-500 text-white hover:bg-amber-600 text-xs font-bold">
                SIGNED
              </Badge>
            )}
            {subscriptionBoxData && (
              <Badge className="bg-brand-purple-600 text-white hover:bg-brand-purple-700 text-xs font-bold flex items-center gap-1">
                <span>{subscriptionBoxData.logo}</span>
                <span className="hidden sm:inline">{subscriptionBoxData.label}</span>
              </Badge>
            )}
            {book.specialEditionDetails?.paintedEdges && (
              <Badge className="bg-brand-pink-600 text-white hover:bg-brand-pink-700 text-xs font-bold">
                Painted Edges
              </Badge>
            )}
          </div>

          {/* Image Navigation Dots */}
          {displayImages.length > 1 && isHovered && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === imageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Quick Action Buttons - visible on hover */}
          <div
            className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Button
              size="icon"
              variant="secondary"
              className={`h-8 w-8 rounded-full shadow-lg ${
                isWishlisted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={handleWishlistClick}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-lg bg-white hover:bg-gray-100"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title & Author */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1 group-hover:text-brand-purple-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
          </div>

          {/* Condition */}
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {book.condition === 'new' ? 'New' :
               book.condition === 'like-new' ? 'Like New' :
               book.condition === 'very-good' ? 'Very Good' :
               book.condition === 'good' ? 'Good' : 'Acceptable'}
            </Badge>
          </div>

          {/* Seller Info */}
          {book.seller && (
            <div className="flex items-center gap-1 mb-2 text-xs text-gray-600">
              <span className="truncate">{book.seller.displayName || book.seller.username}</span>
              {book.seller.rating && (
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{book.seller.rating.average}</span>
                </div>
              )}
            </div>
          )}

          {/* Location/Distance */}
          {(showDistance && distance) || book.seller?.location || (book.city && book.state) ? (
            <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">
                {showDistance && distance ? distance : 
                 book.seller?.location || (book.city && book.state ? `${book.city}, ${book.state}` : '')}
              </span>
            </div>
          ) : null}

          {/* Price Section */}
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">
                  ${price.toFixed(2)}
                </span>
                {shippingPrice > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    + ${shippingPrice.toFixed(2)} shipping
                  </span>
                )}
              </div>
            </div>
            {book.acceptsOffers && (
              <p className="text-xs text-brand-purple-600 font-medium mt-1">
                Make an Offer
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

