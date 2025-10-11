"use client";

import { useEffect, useState } from 'react';
import { BookCard } from '@/components/marketplace/book-card';
import { Button } from '@/components/ui/button';
import { Book } from '@/types/book';

export default function MarketplacePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchBooks() {
    try {
      setLoading(true);
      setError(null);
      const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
      const apiBase = base.endsWith('/api') ? base : `${base}/api`;
      const res = await fetch(`${apiBase}/books?page=${page}&pageSize=20`);
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();

      const items: Book[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.items)
        ? data.data.items
        : [];
      setBooks(items);

      const total: number | undefined = Array.isArray(data)
        ? undefined
        : typeof data?.data?.total === 'number'
        ? data.data.total
        : undefined;
      if (typeof total === 'number') {
        setTotalPages(Math.max(1, Math.ceil(total / 20)));
      } else {
        setTotalPages(items.length === 20 ? page + 1 : page);
      }
    } catch (e) {
      setError('Could not load books. Please try again.');
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-white">
            Enchanted Romantasy Market
          </h1>
          <p className="text-gray-300 mt-2">
            {loading ? 'Loading...' : error ? '—' : `${books.length} books available`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-lg border border-gray-600">
                <div className="aspect-[2/3] bg-gray-600 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-600 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
            <Button variant="outline" className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => fetchBooks()}>
              Retry
            </Button>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No books found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}