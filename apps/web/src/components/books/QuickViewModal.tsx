'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '@bookheart/shared';
import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
import { Heart, Star, Eye, ShoppingCart, MapPin, Sparkles, BookOpen, X, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface QuickViewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWishlist?: (bookId: string) => void;
  onShare?: (book: Book) => void;
}

export function QuickViewModal({
  book,
  isOpen,
  onClose,
  onAddToWishlist,
  onShare
}: QuickViewModalProps) {
  const [_isLoading, _setIsLoading] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !book) return null;

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      'new': 'bg-green-100 text-green-800',
      'like-new': 'bg-blue-100 text-blue-800',
      'very-good': 'bg-yellow-100 text-yellow-800',
      'good': 'bg-orange-100 text-orange-800',
      'acceptable': 'bg-red-100 text-red-800',
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSpiceLevelText = (level?: number) => {
    if (level === undefined) return '';
    const levels = ['Closed Door', 'Mild', 'Moderate', 'Hot', 'Very Hot', 'Extreme'];
    return levels[level] || '';
  };

  const getSpiceLevelColor = (level?: number) => {
    if (level === undefined) return 'bg-gray-100 text-gray-800';
    const colors = [
      'bg-gray-100 text-gray-800',
      'bg-pink-100 text-pink-800',
      'bg-red-100 text-red-800',
      'bg-red-200 text-red-900',
      'bg-red-300 text-red-900',
      'bg-red-400 text-red-900',
    ];
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const primaryImage = book.images?.find(img => img.isPrimary) || book.images?.[0];
  const imageUrl = primaryImage?.cloudinaryUrl || '/placeholder-book.jpg';

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(book.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(book);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Quick View</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
                <Image
                  src={imageUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Special Edition Badge */}
                {book.isSpecialEdition && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Special Edition
                    </div>
                  </div>
                )}

                {/* Condition Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
                    {book.condition.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Spice Level Badge */}
                {book.spiceLevel !== undefined && (
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSpiceLevelColor(book.spiceLevel)}`}>
                      {getSpiceLevelText(book.spiceLevel)}
                    </span>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {book.images && book.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {book.images.slice(0, 4).map((image, index) => (
                    <div key={image.id} className="aspect-[2/3] relative overflow-hidden rounded-lg">
                      <Image
                        src={image.cloudinaryUrl}
                        alt={`${book.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </div>
                  ))}
                  {book.images.length > 4 && (
                    <div className="aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">+{book.images.length - 4}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              {/* Title and Author */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h3>
                <p className="text-lg text-gray-600 mb-2">by {book.author}</p>
                
                {book.seriesName && (
                  <p className="text-purple-600 font-medium">
                    {book.seriesName}
                    {book.seriesNumber && ` #${book.seriesNumber}`}
                  </p>
                )}
              </div>

              {/* Condition and Spice Level */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(book.condition)}`}>
                  {book.condition.replace('-', ' ').toUpperCase()}
                </span>
                
                {book.spiceLevel !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSpiceLevelColor(book.spiceLevel)}`}>
                    {getSpiceLevelText(book.spiceLevel)}
                  </span>
                )}
              </div>

              {/* Tropes */}
              {book.tropes && book.tropes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tropes & Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.tropes.slice(0, 6).map((trope, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {trope.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {book.tropes.length > 6 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{book.tropes.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-700 text-sm line-clamp-4">{book.description}</p>
                </div>
              )}

              {/* Special Edition Details */}
              {book.isSpecialEdition && book.specialEditionDetails && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Special Edition Features</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(book.specialEditionDetails).map(([key, value]) => {
                      if (typeof value === 'boolean' && value) {
                        const labels = {
                          paintedEdges: 'Painted Edges',
                          signedCopy: 'Signed Copy',
                          firstEdition: 'First Edition',
                          exclusiveCover: 'Exclusive Cover',
                          sprayed: 'Sprayed Edges',
                          customDustJacket: 'Custom Dust Jacket',
                        };
                        return (
                          <div key={key} className="flex items-center text-xs text-gray-700">
                            <Sparkles className="h-3 w-3 text-purple-600 mr-1" />
                            {labels[key as keyof typeof labels]}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              {book.seller && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sold by</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {book.seller.displayName || book.seller.username}
                      </p>
                      {book.seller.sellerVerified && (
                        <div className="flex items-center text-xs text-green-600">
                          <Star className="h-3 w-3 mr-1" />
                          Verified Seller
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="border-t pt-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatPrice(book.priceCents)}
                </div>
                {book.shippingPriceCents > 0 && (
                  <div className="text-sm text-gray-500 mb-2">
                    + {formatPrice(book.shippingPriceCents)} shipping
                  </div>
                )}
                {book.localPickupAvailable && (
                  <div className="text-sm text-green-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Local pickup available
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button asChild className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href={`/books/${book.id}`}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Full Details
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                  className="flex items-center"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{book.viewCount || 0} views</span>
                </div>
                <div>
                  Listed {new Date(book.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
