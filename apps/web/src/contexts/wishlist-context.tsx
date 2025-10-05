'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  bookId: string;
  title: string;
  author: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('bookheart_wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookheart_wishlist', JSON.stringify(items));
  }, [items]);

  const itemCount = items.length;

  const addItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prevItems) => {
      const exists = prevItems.find((i) => i.bookId === item.bookId);
      if (exists) {
        return prevItems;
      }
      return [...prevItems, { ...item, addedAt: new Date().toISOString() }];
    });
  };

  const removeItem = (bookId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.bookId !== bookId));
  };

  const isInWishlist = (bookId: string) => {
    return items.some((item) => item.bookId === bookId);
  };

  const toggleItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    if (isInWishlist(item.bookId)) {
      removeItem(item.bookId);
    } else {
      addItem(item);
    }
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
