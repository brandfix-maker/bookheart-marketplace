'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book } from '@bookheart/shared';
import { BookCard } from './BookCard';
import { BookGridSkeleton } from './BookGridSkeleton';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';

interface EnhancedBookGridProps {
  books: Book[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onAddToWishlist?: (bookId: string) => void;
  onQuickView?: (bookId: string) => void;
  showSeller?: boolean;
  className?: string;
  enableInfiniteScroll?: boolean;
  skeletonCount?: number;
}

export function EnhancedBookGrid({
  books,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onAddToWishlist,
  onQuickView,
  showSeller = false,
  className = '',
  enableInfiniteScroll = true,
  skeletonCount = 8
}: EnhancedBookGridProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleBooks, setVisibleBooks] = useState<Book[]>(books);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Update visible books when books prop changes
  useEffect(() => {
    setVisibleBooks(books);
  }, [books]);

  // Handle load more with loading state
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !onLoadMore) return;
    
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, onLoadMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll || !hasMore || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableInfiniteScroll, hasMore, onLoadMore, isLoadingMore, handleLoadMore]);

  // Show loading skeleton
  if (isLoading && visibleBooks.length === 0) {
    return <BookGridSkeleton count={skeletonCount} className={className} />;
  }

  // Show empty state
  if (!isLoading && visibleBooks.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            showSeller={showSeller}
            onAddToWishlist={onAddToWishlist}
            onQuickView={onQuickView}
          />
        ))}
      </div>

      {/* Loading More Skeleton */}
      {isLoadingMore && (
        <div className="mt-6">
          <BookGridSkeleton count={4} />
        </div>
      )}

      {/* Load More Button (fallback for when infinite scroll is disabled) */}
      {!enableInfiniteScroll && hasMore && onLoadMore && (
        <div className="text-center mt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            disabled={isLoadingMore}
            className="min-w-32"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Books'
            )}
          </Button>
        </div>
      )}

      {/* Intersection Observer Target */}
      {enableInfiniteScroll && hasMore && (
        <div ref={loadMoreRef} className="h-4" />
      )}

      {/* End of Results */}
      {!hasMore && visibleBooks.length > 0 && (
        <div className="text-center mt-8 py-4">
          <p className="text-gray-500 text-sm">
            You've reached the end of the results
          </p>
        </div>
      )}
    </div>
  );
}
