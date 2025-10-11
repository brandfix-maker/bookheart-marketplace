'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@bookheart/shared';
import { Eye, Heart, MessageSquare, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { ListingActions } from './listing-actions';
import { StatusBadge } from './status-badge';

interface ListingGridProps {
  books: Book[];
  onDelete: (bookId: string) => void;
  onUpdate: (book: Book) => void;
  onRefresh: () => void;
}

export function ListingGrid({ books, onDelete, onUpdate, onRefresh }: ListingGridProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [actionType, setActionType] = useState<'pause' | 'sold' | 'delete' | null>(null);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  
  const handleAction = (book: Book, action: 'pause' | 'sold' | 'delete') => {
    setSelectedBook(book);
    setActionType(action);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const primaryImage = book.images?.find((img) => img.isPrimary) || book.images?.[0];

          return (
            <div
              key={book.id}
              className="group relative bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all"
            >
              {/* Image */}
              <Link href={`/books/${book.id}`}>
                <div className="relative aspect-[3/4] bg-gray-700">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.cloudinaryUrl}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Stats Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-white">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{book.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">0</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <StatusBadge status={book.status} />
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-800" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem asChild>
                          <Link href={`/sell/edit/${book.id}`} className="cursor-pointer">
                            Edit Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(book, 'pause')}>
                          Pause Listing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(book, 'sold')}>
                          Mark as Sold
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction(book, 'delete')}
                          className="text-red-400"
                        >
                          Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/books/${book.id}`}>
                  <h3 className="font-semibold text-white hover:text-brand-purple-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">{book.author}</p>
                </Link>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {formatPrice(book.priceCents)}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{book.condition}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Modals */}
      {selectedBook && actionType && (
        <ListingActions
          book={selectedBook}
          action={actionType}
          isOpen={true}
          onClose={() => {
            setSelectedBook(null);
            setActionType(null);
          }}
          onSuccess={(updatedBook) => {
            if (actionType === 'delete') {
              onDelete(selectedBook.id);
            } else if (updatedBook) {
              onUpdate(updatedBook);
            }
            setSelectedBook(null);
            setActionType(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
}

