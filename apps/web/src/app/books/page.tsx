'use client';

import React, { useState, useEffect } from 'react';
import { Book, BookSearchParams } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { EnhancedBookGrid } from '@/components/books/EnhancedBookGrid';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { QuickViewModal } from '@/components/books/QuickViewModal';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<BookSearchParams>({
    page: 1,
    pageSize: 20,
    sortBy: 'newest',
    sortOrder: 'desc',
  });
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToSearchHistory } = useSearchHistory();
  
  // Debounce search query
  const debouncedQuery = useDebounce(searchParams.query || '', 500);

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  // Add to search history when search is performed
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      addToSearchHistory(searchParams);
    }
  }, [debouncedQuery, searchParams, addToSearchHistory]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.query) params.append('q', searchParams.query);
      if (searchParams.author) params.append('author', searchParams.author);
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice.toString());
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice.toString());
      if (searchParams.condition?.length) {
        searchParams.condition.forEach(c => params.append('condition', c));
      }
      if (searchParams.isSpecialEdition !== undefined) {
        params.append('isSpecialEdition', searchParams.isSpecialEdition.toString());
      }
      if (searchParams.localPickupAvailable !== undefined) {
        params.append('localPickupAvailable', searchParams.localPickupAvailable.toString());
      }
      if (searchParams.tropes?.length) {
        searchParams.tropes.forEach(t => params.append('tropes', t));
      }
      if (searchParams.spiceLevel?.length) {
        searchParams.spiceLevel.forEach(s => params.append('spiceLevel', s.toString()));
      }
      if (searchParams.page) params.append('page', searchParams.page.toString());
      if (searchParams.pageSize) params.append('pageSize', searchParams.pageSize.toString());
      if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);
      if (searchParams.sortOrder) params.append('sortOrder', searchParams.sortOrder);

      const response = await apiClient.get(`/books?${params.toString()}`);
      const data = response.data;
      
      setBooks(data.items || []);
      setTotal(data.total || 0);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: 'Error',
        description: 'Failed to load books. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, query, page: 1 }));
  };

  const handleFilterChange = (key: keyof BookSearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleLoadMore = () => {
    setSearchParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
  };

  const handleAddToWishlist = async (bookId: string) => {
    try {
      await apiClient.post('/wishlist', { bookId });
      toast({
        title: 'Added to Wishlist',
        description: 'This book has been added to your wishlist.',
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add book to wishlist.',
        variant: 'destructive',
      });
    }
  };

  const handleQuickView = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setQuickViewBook(book);
      setShowQuickView(true);
      addToRecentlyViewed(book);
    }
  };

  const handleSearchSelect = (suggestion: any) => {
    setSearchParams(prev => ({ 
      ...prev, 
      query: suggestion.text, 
      page: 1 
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Next Read</h1>
          <p className="text-xl text-gray-600">Find the perfect romantasy book from our community</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {/* Enhanced Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchAutocomplete
                  value={searchParams.query || ''}
                  onChange={(value) => handleSearch(value)}
                  onSelect={handleSearchSelect}
                  placeholder="Search books, authors, series, or tropes..."
                  className="w-full"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <Input
                    placeholder="Filter by author"
                    value={searchParams.author || ''}
                    onChange={(e) => handleFilterChange('author', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={searchParams.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={searchParams.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <Select
                    value={searchParams.condition?.[0] || 'any'}
                    onValueChange={(value) => handleFilterChange('condition', value === 'any' ? [] : [value])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any condition</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="very-good">Very Good</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="acceptable">Acceptable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <Select
                    value={searchParams.sortBy || 'newest'}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <Select
                    value={searchParams.sortOrder || 'desc'}
                    onValueChange={(value) => handleFilterChange('sortOrder', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchParams.isSpecialEdition || false}
                      onChange={(e) => handleFilterChange('isSpecialEdition', e.target.checked || undefined)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Special Editions Only</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchParams.localPickupAvailable || false}
                      onChange={(e) => handleFilterChange('localPickupAvailable', e.target.checked || undefined)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Local Pickup Available</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLoading ? 'Loading...' : `${total} books found`}
            </h2>
            {searchParams.query && (
              <p className="text-gray-600">
                Results for "{searchParams.query}"
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Books Grid */}
        <EnhancedBookGrid
          books={books}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
          showSeller={true}
          enableInfiniteScroll={true}
          skeletonCount={8}
        />

        {/* Quick View Modal */}
        <QuickViewModal
          book={quickViewBook}
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            setQuickViewBook(null);
          }}
          onAddToWishlist={handleAddToWishlist}
          onShare={(book) => {
            // TODO: Implement share functionality
            toast({
              title: 'Share',
              description: `Sharing ${book.title}`,
            });
          }}
        />
      </div>
    </div>
  );
}
