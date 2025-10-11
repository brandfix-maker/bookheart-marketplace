'use client';

import { useEffect, useState } from 'react';
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { Button } from '@/components/ui/button';
import { Plus, Grid as GridIcon, List } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Book } from '@bookheart/shared';
import { ListingGrid } from '@/components/dashboard/listing-grid';
import { ListingTable } from '@/components/dashboard/listing-table';

type ViewMode = 'grid' | 'table';

export default function ListingsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/books/seller/my-books?status=active');
      if (response?.success) {
        setBooks(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (bookId: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  const handleUpdate = (updatedBook: Book) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  return (
    <DashboardWrapper
      title="Active Listings"
      action={
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-gray-700/50 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${
                viewMode === 'table'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Listing Button */}
          <Link href="/sell">
            <Button className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 hover:from-brand-pink-600 hover:to-brand-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </Link>
        </div>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-96 bg-gray-700/50 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg">
          <GridIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No active listings yet
          </h3>
          <p className="text-gray-300 mb-6">
            Start selling by creating your first book listing!
          </p>
          <Link href="/sell">
            <Button className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 hover:from-brand-pink-600 hover:to-brand-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Listing
            </Button>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <ListingGrid
          books={books}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRefresh={fetchListings}
        />
      ) : (
        <ListingTable
          books={books}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRefresh={fetchListings}
        />
      )}
    </DashboardWrapper>
  );
}

