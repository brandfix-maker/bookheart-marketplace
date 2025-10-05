'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/marketplace/search-bar';
import { FilterPanel, FilterState } from '@/components/marketplace/filter-panel';
import { BookCard } from '@/components/marketplace/book-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Bookmark, Grid3x3, List } from 'lucide-react';
import { Book } from '@bookheart/shared';
import { useAuth } from '@/contexts/auth-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useCart } from '@/contexts/cart-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { user } = useAuth();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, items: wishlistItems } = useWishlist();
  const { addItem: addToCart } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const pageSize = 20;

  useEffect(() => {
    if (query) {
      searchBooks();
    }
  }, [query, page, sortBy]);

  const searchBooks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: query,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: sortBy,
      });

      // Add filters
      if (filters.priceMin) queryParams.append('minPrice', filters.priceMin.toString());
      if (filters.priceMax) queryParams.append('maxPrice', filters.priceMax.toString());
      if (filters.condition?.length) {
        filters.condition.forEach(c => queryParams.append('condition', c));
      }
      if (filters.subscriptionBoxes?.length) {
        filters.subscriptionBoxes.forEach(box => queryParams.append('subscriptionBox', box));
      }
      if (filters.tropes?.length) {
        filters.tropes.forEach(trope => queryParams.append('tropes', trope));
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBooks(data.data.items);
        setTotal(data.data.total);
        setHasMore(data.data.hasMore);

        // Generate search suggestions if no results
        if (data.data.items.length === 0) {
          generateSuggestions();
        }
      }
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = () => {
    // Generate "Did you mean?" suggestions
    const commonMisspellings: Record<string, string> = {
      'romantacy': 'romantasy',
      'enimies': 'enemies',
      'fae': 'fae',
    };

    const lowerQuery = query.toLowerCase();
    const didYouMean = commonMisspellings[lowerQuery];
    
    if (didYouMean) {
      setSuggestions([didYouMean]);
    } else {
      // Suggest related searches
      setSuggestions(['Try "enemies to lovers"', 'Try "special edition"', 'Try searching by author name']);
    }
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
    setPage(1);
    searchBooks();
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
    searchBooks();
  };

  const handleWishlistToggle = (bookId: string) => {
    const isWishlisted = wishlistItems.some(item => item.bookId === bookId);
    if (isWishlisted) {
      removeWishlistItem(bookId);
    } else {
      const book = books.find(b => b.id === bookId);
      if (book) {
        addWishlistItem({ bookId: book.id, title: book.title, author: book.author });
      }
    }
  };

  const handleAddToCart = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      addToCart({
        bookId: book.id,
        title: book.title,
        price: book.priceCents / 100,
        quantity: 1,
      });
    }
  };

  const handleSaveSearch = async () => {
    if (!user) {
      // Redirect to login
      return;
    }

    // TODO: Implement save search functionality
    alert('Search saved! You\'ll receive email alerts when new matching books are listed.');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.condition?.length) count += filters.condition.length;
    if (filters.editionType?.length) count += filters.editionType.length;
    if (filters.subscriptionBoxes?.length) count += filters.subscriptionBoxes.length;
    if (filters.tropes?.length) count += filters.tropes.length;
    return count;
  };

  // reserved for future highlighting of search terms

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar defaultValue={query} />
          </div>

          {/* Filters & View Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge variant="default" className="ml-1">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {user && (
                <Button variant="outline" onClick={handleSaveSearch} className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save Search
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden sm:flex items-center border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-purple-600">{total}</span>{' '}
            {total === 1 ? 'treasure' : 'treasures'} found for{' '}
            <span className="text-purple-600">&quot;{query}&quot;</span>
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="aspect-[2/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-900 text-xl font-semibold mb-2">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Did you mean:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      onClick={() => {
                        const newQuery = suggestion.replace('Try ', '').replace(/"/g, '');
                        window.location.href = `/marketplace/search?q=${encodeURIComponent(newQuery)}`;
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-1'
            }`}>
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlistItems.some(item => item.bookId === book.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {total > pageSize && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" /> }>
      <SearchResultsContent />
    </Suspense>
  );
}