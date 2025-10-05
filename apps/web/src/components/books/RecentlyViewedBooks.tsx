'use client';

import React from 'react';
import { Book } from '@bookheart/shared';
// import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCard } from './BookCard';
import { History, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface RecentlyViewedBooksProps {
  books: Book[];
  onRemoveBook?: (bookId: string) => void;
  onClearAll?: () => void;
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

export function RecentlyViewedBooks({
  books,
  onRemoveBook,
  onClearAll,
  maxItems = 6,
  showHeader = true,
  className = ''
}: RecentlyViewedBooksProps) {
  const displayBooks = books.slice(0, maxItems);

  if (books.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <History className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recently Viewed Books</h3>
        <p className="text-gray-500 mb-4">Books you view will appear here</p>
        <Button asChild>
          <Link href="/books">
            Browse Books
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
            <span className="text-sm text-gray-500">({books.length})</span>
          </div>
          {onClearAll && books.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {displayBooks.map((book) => (
          <div key={book.id} className="relative group">
            <BookCard
              book={book}
              className="h-full"
            />
            
            {/* Remove Button */}
            {onRemoveBook && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveBook(book.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      {books.length > maxItems && (
        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link href="/recently-viewed">
              <Eye className="h-4 w-4 mr-2" />
              View All Recently Viewed ({books.length})
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
