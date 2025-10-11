'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { BookCard } from '@/components/marketplace/book-card';
import { apiClient } from '@/lib/api-client';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimilarBooksProps {
  bookId: string;
}

export function SimilarBooks({ bookId }: SimilarBooksProps) {
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSimilarBooks();
  }, [bookId]);

  const fetchSimilarBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`/books/${bookId}/similar?limit=8`);
      setSimilarBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching similar books:', error);
      setError('Failed to load similar books');
    } finally {
      setLoading(false);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const container = document.getElementById('similar-books-carousel');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 bg-clip-text text-transparent mb-6">
            Similar Books
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[450px] bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || similarBooks.length === 0) {
    return null; // Don't show section if no similar books
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 bg-clip-text text-transparent">
            Similar Books
          </h2>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-pink-500" />
            <span className="text-sm text-gray-400">{similarBooks.length} recommendations</span>
          </div>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 border border-gray-600"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => scrollCarousel('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 border border-gray-600"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Carousel */}
          <div
            id="similar-books-carousel"
            className="flex gap-6 overflow-x-auto scrollbar-thin pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'thin' }}
          >
            {similarBooks.map((book) => (
              <div key={book.id} className="flex-shrink-0 w-[280px]">
                <BookCard
                  book={book}
                  onWishlistToggle={() => {
                    // TODO: Implement wishlist toggle
                    console.log('Toggle wishlist for book:', book.id);
                  }}
                  onAddToCart={() => {
                    // TODO: Implement add to cart
                    console.log('Add to cart:', book.id);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-6">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => {
              // TODO: Navigate to marketplace with similar books filter
              console.log('View all similar books');
            }}
          >
            View All Similar Books
          </Button>
        </div>
      </div>
    </section>
  );
}
