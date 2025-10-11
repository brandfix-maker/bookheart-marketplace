'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchSuggestion, SearchAutocompleteResponse } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, TrendingUp, User, BookOpen, Tag } from 'lucide-react';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  minLength?: number;
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search books, authors, or series...',
  className = '',
  debounceMs = 300,
  minLength = 2
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [trendingAuthors, setTrendingAuthors] = useState<string[]>([]);
  const [trendingSeries, setTrendingSeries] = useState<string[]>([]);
  const [trendingTropes, setTrendingTropes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query.length >= minLength) {
        await fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, debounceMs);
  }, [debounceMs, minLength]);

  // Fetch search suggestions
  const fetchSuggestions = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/books/search/suggestions?q=${encodeURIComponent(query)}&limit=8`);
      const data: SearchAutocompleteResponse = response.data.data;
      
      setSuggestions(data.suggestions || []);
      setPopularSearches(data.popularSearches || []);
      setTrendingAuthors(data.trendingAuthors || []);
      setTrendingSeries(data.trendingSeries || []);
      setTrendingTropes(data.trendingTropes || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch popular searches on mount
  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const response = await apiClient.get('/books/search/popular?limit=5');
        setPopularSearches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching popular searches:', error);
      }
    };

    fetchPopularSearches();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.length >= minLength) {
      debouncedSearch(newValue);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSelect(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Handle popular search selection
  const handlePopularSearchSelect = (search: string) => {
    onChange(search);
    onSelect({
      id: `popular-${search}`,
      text: search,
      type: 'query',
      popularity: 100
    });
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + popularSearches.length + trendingAuthors.length + trendingSeries.length + trendingTropes.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          // Handle selection based on index
          let currentIndex = 0;
          
          if (selectedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[selectedIndex]);
            return;
          }
          currentIndex += suggestions.length;
          
          if (selectedIndex < currentIndex + popularSearches.length) {
            handlePopularSearchSelect(popularSearches[selectedIndex - currentIndex]);
            return;
          }
          currentIndex += popularSearches.length;
          
          if (selectedIndex < currentIndex + trendingAuthors.length) {
            handleSuggestionSelect({
              id: `author-${trendingAuthors[selectedIndex - currentIndex]}`,
              text: trendingAuthors[selectedIndex - currentIndex],
              type: 'author',
              popularity: 90
            });
            return;
          }
          currentIndex += trendingAuthors.length;
          
          if (selectedIndex < currentIndex + trendingSeries.length) {
            handleSuggestionSelect({
              id: `series-${trendingSeries[selectedIndex - currentIndex]}`,
              text: trendingSeries[selectedIndex - currentIndex],
              type: 'series',
              popularity: 85
            });
            return;
          }
          currentIndex += trendingSeries.length;
          
          if (selectedIndex < currentIndex + trendingTropes.length) {
            handleSuggestionSelect({
              id: `trope-${trendingTropes[selectedIndex - currentIndex]}`,
              text: trendingTropes[selectedIndex - currentIndex],
              type: 'trope',
              popularity: 80
            });
            return;
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'author':
        return <User className="h-4 w-4" />;
      case 'series':
        return <BookOpen className="h-4 w-4" />;
      case 'trope':
        return <Tag className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'author':
        return 'text-blue-600';
      case 'series':
        return 'text-brand-purple-600';
      case 'trope':
        return 'text-brand-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-purple-600"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Suggestions
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                        selectedIndex === index ? 'bg-purple-50 text-purple-700' : ''
                      }`}
                    >
                      <div className={getSuggestionColor(suggestion.type)}>
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{suggestion.text}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {suggestion.type}
                          {suggestion.count && ` • ${suggestion.count} books`}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular Searches
                </h4>
                <div className="space-y-1">
                  {popularSearches.map((search, index) => (
                    <button
                      key={search}
                      onClick={() => handlePopularSearchSelect(search)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                        selectedIndex === suggestions.length + index ? 'bg-purple-50 text-purple-700' : ''
                      }`}
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <div className="font-medium">{search}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Authors */}
            {trendingAuthors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  Trending Authors
                </h4>
                <div className="space-y-1">
                  {trendingAuthors.slice(0, 3).map((author, index) => (
                    <button
                      key={author}
                      onClick={() => handleSuggestionSelect({
                        id: `author-${author}`,
                        text: author,
                        type: 'author',
                        popularity: 90
                      })}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                        selectedIndex === suggestions.length + popularSearches.length + index ? 'bg-purple-50 text-purple-700' : ''
                      }`}
                    >
                      <User className="h-4 w-4 text-blue-600" />
                      <div className="font-medium">{author}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Series */}
            {trendingSeries.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Trending Series
                </h4>
                <div className="space-y-1">
                  {trendingSeries.slice(0, 3).map((series, index) => (
                    <button
                      key={series}
                      onClick={() => handleSuggestionSelect({
                        id: `series-${series}`,
                        text: series,
                        type: 'series',
                        popularity: 85
                      })}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                        selectedIndex === suggestions.length + popularSearches.length + trendingAuthors.length + index ? 'bg-purple-50 text-purple-700' : ''
                      }`}
                    >
                      <BookOpen className="h-4 w-4 text-brand-purple-600" />
                      <div className="font-medium">{series}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Tropes */}
            {trendingTropes.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  Trending Tropes
                </h4>
                <div className="space-y-1">
                  {trendingTropes.slice(0, 3).map((trope, index) => (
                    <button
                      key={trope}
                      onClick={() => handleSuggestionSelect({
                        id: `trope-${trope}`,
                        text: trope,
                        type: 'trope',
                        popularity: 80
                      })}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                        selectedIndex === suggestions.length + popularSearches.length + trendingAuthors.length + trendingSeries.length + index ? 'bg-purple-50 text-purple-700' : ''
                      }`}
                    >
                      <Tag className="h-4 w-4 text-brand-pink-600" />
                      <div className="font-medium">{trope.replace(/-/g, ' ')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
