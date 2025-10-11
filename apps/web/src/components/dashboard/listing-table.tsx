'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@bookheart/shared';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ListingActions } from './listing-actions';
import { StatusBadge } from './status-badge';

interface ListingTableProps {
  books: Book[];
  onDelete: (bookId: string) => void;
  onUpdate: (book: Book) => void;
  onRefresh: () => void;
}

export function ListingTable({ books, onDelete, onUpdate, onRefresh }: ListingTableProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [actionType, setActionType] = useState<'pause' | 'sold' | 'delete' | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'views' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleAction = (book: Book, action: 'pause' | 'sold' | 'delete') => {
    setSelectedBook(book);
    setActionType(action);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'title':
        compareValue = a.title.localeCompare(b.title);
        break;
      case 'price':
        compareValue = a.priceCents - b.priceCents;
        break;
      case 'views':
        compareValue = (a.viewCount || 0) - (b.viewCount || 0);
        break;
      case 'date':
        compareValue =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  return (
    <>
      <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-gray-300">Image</TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('title')}
              >
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('price')}
              >
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-gray-300">Condition</TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('views')}
              >
                Views {sortBy === 'views' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('date')}
              >
                Listed {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBooks.map((book) => {
              const primaryImage = book.images?.find((img) => img.isPrimary) || book.images?.[0];

              return (
                <TableRow
                  key={book.id}
                  className="border-gray-700 hover:bg-gray-700/50"
                >
                  <TableCell>
                    <Link href={`/books/${book.id}`}>
                      <div className="relative w-16 h-20 bg-gray-700 rounded overflow-hidden">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.cloudinaryUrl}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/books/${book.id}`}
                      className="text-white hover:text-brand-purple-400 font-medium"
                    >
                      {book.title}
                    </Link>
                    <p className="text-sm text-gray-400">{book.author}</p>
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {formatPrice(book.priceCents)}
                  </TableCell>
                  <TableCell className="text-gray-300 capitalize">
                    {book.condition}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {book.viewCount || 0}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(book.publishedAt || book.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={book.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-600 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-300" />
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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

