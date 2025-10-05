'use client';

import { useState, useEffect, useCallback } from 'react';
import { Book, RecentlyViewedBook } from '@bookheart/shared';

const RECENTLY_VIEWED_KEY = 'bookheart_recently_viewed';
const MAX_RECENT_ITEMS = 20;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedBook[]>([]);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setRecentlyViewed(parsed);
        }
      } catch (error) {
        console.error('Error loading recently viewed books:', error);
      }
    };

    loadRecentlyViewed();
  }, []);

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error saving recently viewed books:', error);
    }
  }, [recentlyViewed]);

  // Add a book to recently viewed
  const addToRecentlyViewed = useCallback((book: Book) => {
    setRecentlyViewed(prev => {
      const now = new Date().toISOString();
      
      // Remove existing entry if it exists
      const filtered = prev.filter(item => item.bookId !== book.id);
      
      // Add new entry at the beginning
      const newEntry: RecentlyViewedBook = {
        bookId: book.id,
        book,
        viewedAt: now,
        viewCount: 1
      };
      
      // Check if book was previously viewed
      const existingIndex = prev.findIndex(item => item.bookId === book.id);
      if (existingIndex !== -1) {
        newEntry.viewCount = prev[existingIndex].viewCount + 1;
      }
      
      // Add to beginning and limit to MAX_RECENT_ITEMS
      const updated = [newEntry, ...filtered].slice(0, MAX_RECENT_ITEMS);
      
      return updated;
    });
  }, []);

  // Remove a book from recently viewed
  const removeFromRecentlyViewed = useCallback((bookId: string) => {
    setRecentlyViewed(prev => prev.filter(item => item.bookId !== bookId));
  }, []);

  // Clear all recently viewed
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  // Get recently viewed books (just the book objects)
  const getRecentlyViewedBooks = useCallback((): Book[] => {
    return recentlyViewed.map(item => item.book);
  }, [recentlyViewed]);

  // Get recently viewed with metadata
  const getRecentlyViewedWithMetadata = useCallback((): RecentlyViewedBook[] => {
    return recentlyViewed;
  }, [recentlyViewed]);

  // Check if a book is in recently viewed
  const isRecentlyViewed = useCallback((bookId: string): boolean => {
    return recentlyViewed.some(item => item.bookId === bookId);
  }, [recentlyViewed]);

  // Get view count for a book
  const getViewCount = useCallback((bookId: string): number => {
    const item = recentlyViewed.find(item => item.bookId === bookId);
    return item?.viewCount || 0;
  }, [recentlyViewed]);

  // Get recently viewed by time range
  const getRecentlyViewedByTimeRange = useCallback((hours: number): RecentlyViewedBook[] => {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return recentlyViewed.filter(item => 
      new Date(item.viewedAt) >= cutoffTime
    );
  }, [recentlyViewed]);

  // Get most viewed books
  const getMostViewedBooks = useCallback((limit: number = 10): RecentlyViewedBook[] => {
    return recentlyViewed
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }, [recentlyViewed]);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewedBooks,
    getRecentlyViewedWithMetadata,
    isRecentlyViewed,
    getViewCount,
    getRecentlyViewedByTimeRange,
    getMostViewedBooks
  };
}
