'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Book } from '@bookheart/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Eye, ShoppingCart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedBooksCarouselProps {
  books: Book[];
  autoRotate?: boolean;
  autoRotateInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function FeaturedBooksCarousel({
  books,
  autoRotate = true,
  autoRotateInterval = 5000,
  showIndicators = true,
  showArrows = true,
  className = ''
}: FeaturedBooksCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  }, [books.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
  }, [books.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || books.length <= 1) return;

    const interval = setInterval(nextSlide, autoRotateInterval);
    return () => clearInterval(interval);
  }, [isAutoRotating, nextSlide, autoRotateInterval, books.length]);

  // Pause auto-rotation on hover
  const handleMouseEnter = () => {
    if (autoRotate) {
      setIsAutoRotating(false);
    }
  };

  const handleMouseLeave = () => {
    if (autoRotate) {
      setIsAutoRotating(true);
    }
  };

  if (books.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg ${className}`}>
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Books</h3>
          <p className="text-gray-500">Check back soon for featured romantasy books!</p>
        </div>
      </div>
    );
  }

  const currentBook = books[currentIndex];
  const primaryImage = currentBook.images?.find(img => img.isPrimary) || currentBook.images?.[0];
  const imageUrl = primaryImage?.cloudinaryUrl || '/placeholder-book.jpg';

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

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Carousel */}
      <div className="relative h-96 md:h-[500px]">
        <Card className="h-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Image Section */}
            <div className="relative">
              <Image
                src={imageUrl}
                alt={currentBook.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={currentIndex === 0}
              />
              
              {/* Special Edition Badge */}
              {currentBook.isSpecialEdition && (
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Special Edition
                  </div>
                </div>
              )}

              {/* Condition Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(currentBook.condition)}`}>
                  {currentBook.condition.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Navigation Arrows */}
              {showArrows && books.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-purple-50">
              <div className="space-y-4">
                {/* Title and Author */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {currentBook.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">by {currentBook.author}</p>
                  
                  {currentBook.seriesName && (
                    <p className="text-purple-600 font-medium">
                      {currentBook.seriesName}
                      {currentBook.seriesNumber && ` #${currentBook.seriesNumber}`}
                    </p>
                  )}
                </div>

                {/* Tropes */}
                {currentBook.tropes && currentBook.tropes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentBook.tropes.slice(0, 4).map((trope, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {trope.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {currentBook.tropes.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{currentBook.tropes.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                {currentBook.description && (
                  <p className="text-gray-700 line-clamp-3">
                    {currentBook.description}
                  </p>
                )}

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(currentBook.priceCents)}
                  {currentBook.shippingPriceCents > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      + {formatPrice(currentBook.shippingPriceCents)} shipping
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button asChild className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Link href={`/books/${currentBook.id}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Indicators */}
      {showIndicators && books.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {books.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-purple-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoRotating && books.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-100 ease-linear"
            style={{
              width: `${((currentIndex + 1) / books.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
}
