'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookSearchParams, SavedSearch } from '@bookheart/shared';

const SEARCH_HISTORY_KEY = 'bookheart_search_history';
const MAX_SAVED_SEARCHES = 50;

export function useSearchHistory() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const loadSearchHistory = () => {
      try {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedSearches(parsed);
        }
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };

    loadSearchHistory();
  }, []);

  // Save to localStorage whenever savedSearches changes
  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(savedSearches));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [savedSearches]);

  // Add a search to history
  const addToSearchHistory = useCallback((searchParams: BookSearchParams, name?: string) => {
    const now = new Date().toISOString();
    
    // Create a unique ID for the search
    const searchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate a name if not provided
    const searchName = name || generateSearchName(searchParams);
    
    const newSearch: SavedSearch = {
      id: searchId,
      userId: 'anonymous', // In a real app, this would be the actual user ID
      name: searchName,
      searchParams,
      createdAt: now,
      lastUsed: now,
      useCount: 1,
      notifications: false
    };

    setSavedSearches(prev => {
      // Remove any existing search with the same parameters
      const filtered = prev.filter(search => 
        !areSearchParamsEqual(search.searchParams, searchParams)
      );
      
      // Add new search at the beginning and limit to MAX_SAVED_SEARCHES
      return [newSearch, ...filtered].slice(0, MAX_SAVED_SEARCHES);
    });

    return searchId;
  }, []);

  // Update search usage
  const updateSearchUsage = useCallback((searchId: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === searchId 
          ? { 
              ...search, 
              lastUsed: new Date().toISOString(),
              useCount: search.useCount + 1
            }
          : search
      )
    );
  }, []);

  // Remove a search from history
  const removeFromSearchHistory = useCallback((searchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));
  }, []);

  // Clear all search history
  const clearSearchHistory = useCallback(() => {
    setSavedSearches([]);
  }, []);

  // Get recent searches
  const getRecentSearches = useCallback((limit: number = 10): SavedSearch[] => {
    return savedSearches
      .sort((a, b) => new Date(b.lastUsed || b.createdAt).getTime() - new Date(a.lastUsed || a.createdAt).getTime())
      .slice(0, limit);
  }, [savedSearches]);

  // Get most used searches
  const getMostUsedSearches = useCallback((limit: number = 10): SavedSearch[] => {
    return savedSearches
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);
  }, [savedSearches]);

  // Get searches by name
  const getSearchesByName = useCallback((name: string): SavedSearch[] => {
    return savedSearches.filter(search => 
      search.name.toLowerCase().includes(name.toLowerCase())
    );
  }, [savedSearches]);

  // Update search name
  const updateSearchName = useCallback((searchId: string, newName: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === searchId 
          ? { ...search, name: newName }
          : search
      )
    );
  }, []);

  // Toggle notifications for a search
  const toggleSearchNotifications = useCallback((searchId: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === searchId 
          ? { ...search, notifications: !search.notifications }
          : search
      )
    );
  }, []);

  // Generate a readable name for search parameters
  const generateSearchName = (searchParams: BookSearchParams): string => {
    const parts: string[] = [];
    
    if (searchParams.query) {
      parts.push(`"${searchParams.query}"`);
    }
    
    if (searchParams.author) {
      parts.push(`by ${searchParams.author}`);
    }
    
    if (searchParams.seriesName) {
      parts.push(`series: ${searchParams.seriesName}`);
    }
    
    if (searchParams.tropes && searchParams.tropes.length > 0) {
      parts.push(`tropes: ${searchParams.tropes.slice(0, 2).join(', ')}`);
    }
    
    if (searchParams.minPrice || searchParams.maxPrice) {
      const min = searchParams.minPrice ? `$${searchParams.minPrice}` : '$0';
      const max = searchParams.maxPrice ? `$${searchParams.maxPrice}` : '∞';
      parts.push(`price: ${min}-${max}`);
    }
    
    if (searchParams.condition && searchParams.condition.length > 0) {
      parts.push(`condition: ${searchParams.condition.join(', ')}`);
    }
    
    if (searchParams.isSpecialEdition) {
      parts.push('special editions');
    }
    
    if (searchParams.localPickupAvailable) {
      parts.push('local pickup');
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Custom Search';
  };

  // Check if two search parameters are equal
  const areSearchParamsEqual = (params1: BookSearchParams, params2: BookSearchParams): boolean => {
    const keys1 = Object.keys(params1) as (keyof BookSearchParams)[];
    const keys2 = Object.keys(params2) as (keyof BookSearchParams)[];
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      const val1 = params1[key];
      const val2 = params2[key];
      
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) return false;
        if (!val1.every((v, i) => v === val2[i])) return false;
      } else if (val1 !== val2) {
        return false;
      }
    }
    
    return true;
  };

  return {
    savedSearches,
    addToSearchHistory,
    updateSearchUsage,
    removeFromSearchHistory,
    clearSearchHistory,
    getRecentSearches,
    getMostUsedSearches,
    getSearchesByName,
    updateSearchName,
    toggleSearchNotifications,
    generateSearchName
  };
}
