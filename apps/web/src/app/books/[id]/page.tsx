'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Book } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Star, Eye, ShoppingCart, MapPin, Sparkles, BookOpen, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { BookImageGallery } from '@/components/books/BookImageGallery';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/books/${bookId}`);
      const bookData = response.data.data;
      setBook(bookData);
      
      // Add to recently viewed
      if (bookData) {
        addToRecentlyViewed(bookData);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast({
        title: 'Error',
        description: 'Failed to load book details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    toast({
      title: 'Added to Wishlist',
      description: 'This book has been added to your wishlist.',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.title,
        text: `Check out this book: ${book?.title} by ${book?.author}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Book link has been copied to your clipboard.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            <BookImageGallery
              images={book.images || []}
              title={book.title}
              showThumbnails={true}
              showZoom={true}
              showControls={true}
              autoPlay={false}
            />
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600">by {book.author}</p>
              
              {book.seriesName && (
                <p className="text-lg text-purple-600 font-medium mt-2">
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
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tropes & Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tropes.map((trope, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                    >
                      {trope.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Special Edition Details */}
            {book.isSpecialEdition && book.specialEditionDetails && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Edition Features</h3>
                <div className="grid grid-cols-2 gap-2">
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
                        <div key={key} className="flex items-center text-sm text-gray-700">
                          <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
                          {labels[key as keyof typeof labels]}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                {book.specialEditionDetails.details && (
                  <p className="text-sm text-gray-600 mt-2">{book.specialEditionDetails.details}</p>
                )}
              </div>
            )}

            {/* Condition Notes */}
            {book.conditionNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Condition Notes</h3>
                <p className="text-gray-700">{book.conditionNotes}</p>
              </div>
            )}

            {/* Seller Info */}
            {book.seller && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sold by</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {book.seller.displayName || book.seller.username}
                    </p>
                    {book.seller.sellerVerified && (
                      <div className="flex items-center text-sm text-green-600">
                        <Star className="h-4 w-4 mr-1" />
                        Verified Seller
                      </div>
                    )}
                    {book.seller.location && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {book.seller.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Purchase Section */}
        <Card className="mt-8 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="text-3xl font-bold text-gray-900">
                {formatPrice(book.priceCents)}
              </div>
              {book.shippingPriceCents > 0 && (
                <div className="text-sm text-gray-500">
                  + {formatPrice(book.shippingPriceCents)} shipping
                </div>
              )}
              {book.localPickupAvailable && (
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Local pickup available
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className="flex items-center"
              >
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {book.viewCount || 0} views
            </div>
            <div>
              Listed {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
