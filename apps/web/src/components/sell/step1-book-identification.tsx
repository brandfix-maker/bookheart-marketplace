'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalBookData } from '@/types/book-wizard';
import { useDebounce } from '@/hooks/use-debounce';

interface Step1Props {
  data: {
    searchMethod: 'api' | 'manual';
    selectedBook?: ExternalBookData;
    title: string;
    author: string;
    isbn?: string;
    seriesName?: string;
    seriesNumber?: string;
  };
  onChange: (data: any) => void;
  errors: any;
}

export function Step1BookIdentification({ data, onChange, errors }: Step1Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExternalBookData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(data.searchMethod === 'manual');
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearch && !showManualEntry) {
      searchBooks(debouncedSearch);
    }
  }, [debouncedSearch]);

  const searchBooks = async (query: string) => {
    setIsSearching(true);
    try {
      // Search using Open Library API
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
      );
      const result = await response.json();

      const books: ExternalBookData[] = result.docs.map((doc: any) => ({
        title: doc.title,
        author: doc.author_name?.[0] || 'Unknown Author',
        isbn: doc.isbn?.[0],
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : undefined,
        publishedYear: doc.first_publish_year,
        publisher: doc.publisher?.[0],
      }));

      setSearchResults(books);
    } catch (error) {
      console.error('Book search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectBook = (book: ExternalBookData) => {
    onChange({
      ...data,
      searchMethod: 'api',
      selectedBook: book,
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const switchToManual = () => {
    setShowManualEntry(true);
    onChange({ ...data, searchMethod: 'manual', selectedBook: undefined });
  };

  const switchToSearch = () => {
    setShowManualEntry(false);
    onChange({ ...data, searchMethod: 'api' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 bg-clip-text text-transparent mb-2">
          Find Your Book
        </h2>
        <p className="text-gray-300">
          Search for your book or enter details manually
        </p>
      </div>

      {!showManualEntry ? (
        <>
          {/* Search Interface */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="text-center py-8 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink-600 mx-auto mb-2"></div>
                Searching...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((book, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:border-pink-300 hover:shadow-md transition-all"
                    onClick={() => selectBook(book)}
                  >
                    <div className="flex gap-4">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{book.title}</h3>
                        <p className="text-sm text-gray-300">{book.author}</p>
                        {book.isbn && (
                          <p className="text-xs text-gray-400 mt-1">ISBN: {book.isbn}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Selected Book Preview */}
            {data.selectedBook && (
              <Card className="p-4 border-green-300 bg-green-50">
                <div className="flex gap-4">
                  {data.selectedBook.coverUrl ? (
                    <img
                      src={data.selectedBook.coverUrl}
                      alt={data.selectedBook.title}
                      className="w-20 h-30 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-30 bg-gray-200 rounded flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-green-700 font-medium mb-1">
                      ✓ Selected
                    </p>
                    <h3 className="font-semibold text-white">
                      {data.selectedBook.title}
                    </h3>
                    <p className="text-sm text-gray-300">{data.selectedBook.author}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={switchToManual}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Can't find your book? Enter manually
          </Button>
        </>
      ) : (
        <>
          {/* Manual Entry Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">
                Book Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
                placeholder="Enter book title"
                className={errors?.title ? 'border-red-500' : ''}
              />
              {errors?.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="author">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                value={data.author}
                onChange={(e) => onChange({ ...data, author: e.target.value })}
                placeholder="Enter author name"
                className={errors?.author ? 'border-red-500' : ''}
              />
              {errors?.author && (
                <p className="text-sm text-red-500 mt-1">{errors.author.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="isbn">ISBN (Optional)</Label>
              <Input
                id="isbn"
                value={data.isbn || ''}
                onChange={(e) => onChange({ ...data, isbn: e.target.value })}
                placeholder="Enter ISBN"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seriesName">Series Name (Optional)</Label>
                <Input
                  id="seriesName"
                  value={data.seriesName || ''}
                  onChange={(e) => onChange({ ...data, seriesName: e.target.value })}
                  placeholder="e.g., A Court of Thorns and Roses"
                />
              </div>
              <div>
                <Label htmlFor="seriesNumber">Series Number</Label>
                <Input
                  id="seriesNumber"
                  value={data.seriesNumber || ''}
                  onChange={(e) => onChange({ ...data, seriesNumber: e.target.value })}
                  placeholder="e.g., 1, 2, 3"
                  type="number"
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={switchToSearch}
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            Switch to search
          </Button>
        </>
      )}
    </div>
  );
}
