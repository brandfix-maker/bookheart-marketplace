'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useDebounce } from '@/hooks/use-debounce';

interface AutocompleteResult {
  books: Array<{
    id: string;
    title: string;
    author: string;
    price: number;
    coverImage?: string;
    type: 'book';
  }>;
  authors: Array<{
    text: string;
    type: 'author';
  }>;
  tropes: Array<{
    text: string;
    type: 'trope';
  }>;
  popularSearches: string[];
}

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search by title, author, trope...',
  defaultValue = '',
  onSearch,
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocomplete, setAutocomplete] = useState<AutocompleteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Fetch autocomplete results
  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      fetchAutocomplete(debouncedQuery);
    } else {
      setAutocomplete(null);
      setShowAutocomplete(false);
    }
  }, [debouncedQuery]);

  // Handle click outside to close autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAutocomplete = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books/autocomplete?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAutocomplete(data.data);
        setShowAutocomplete(true);
      }
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      setShowAutocomplete(false);
      if (onSearch) {
        onSearch(finalQuery);
      } else {
        router.push(`/marketplace/search?q=${encodeURIComponent(finalQuery)}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  };

  const handleAutocompleteClick = (type: string, value: string) => {
    if (type === 'book') {
      router.push(`/books/${value}`);
    } else if (type === 'author') {
      router.push(`/marketplace?author=${encodeURIComponent(value)}`);
    } else if (type === 'trope') {
      router.push(`/marketplace?tropes=${encodeURIComponent(value)}`);
    } else {
      setQuery(value);
      handleSearch(value);
    }
    setShowAutocomplete(false);
  };

  return (
    <div className={`relative ${className}`} ref={autocompleteRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 1 && setShowAutocomplete(true)}
          className="pl-10 pr-20 h-12 text-base"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-12 h-8 w-8"
            onClick={() => {
              setQuery('');
              setAutocomplete(null);
              setShowAutocomplete(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          onClick={() => handleSearch()}
          className="absolute right-1 h-10"
          disabled={!query.trim()}
        >
          Search
        </Button>
      </div>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && autocomplete && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto">
          {/* Books */}
          {autocomplete.books.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Books
              </div>
              {autocomplete.books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleAutocompleteClick('book', book.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-left transition-colors"
                >
                  {book.coverImage ? (
                    <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-14 flex-shrink-0 bg-gray-200 rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {book.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{book.author}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${book.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Authors */}
          {autocomplete.authors.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Authors
              </div>
              {autocomplete.authors.map((author, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAutocompleteClick('author', author.text)}
                  className="w-full px-3 py-2 hover:bg-gray-50 rounded-md text-left text-sm text-gray-700 transition-colors"
                >
                  {author.text}
                </button>
              ))}
            </div>
          )}

          {/* Tropes */}
          {autocomplete.tropes.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Tropes
              </div>
              {autocomplete.tropes.map((trope, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAutocompleteClick('trope', trope.text)}
                  className="w-full px-3 py-2 hover:bg-gray-50 rounded-md text-left text-sm text-gray-700 transition-colors"
                >
                  #{trope.text}
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {autocomplete.books.length === 0 &&
            autocomplete.authors.length === 0 &&
            autocomplete.tropes.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No results found for &quot;{query}&quot;</p>
                <p className="text-sm mt-1">Try adjusting your search</p>
              </div>
            )}

          {/* Popular Searches (show when no other results) */}
          {autocomplete.books.length === 0 &&
            autocomplete.authors.length === 0 &&
            autocomplete.tropes.length === 0 &&
            autocomplete.popularSearches.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Popular Searches
                </div>
                {autocomplete.popularSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAutocompleteClick('search', search)}
                    className="w-full px-3 py-2 hover:bg-gray-50 rounded-md text-left text-sm text-gray-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

          {isLoading && (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

