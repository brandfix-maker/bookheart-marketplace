'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { FeaturedBooksCarousel } from '@/components/books/FeaturedBooksCarousel';
import { RecentlyViewedBooks } from '@/components/books/RecentlyViewedBooks';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { SearchHistory } from '@/components/search/SearchHistory';
import { Book } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { SearchSuggestion } from '@bookheart/shared';
import { toast } from '@/components/ui/use-toast';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [_trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [_recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const { 
    recentlyViewed: _recentlyViewed, 
    getRecentlyViewedBooks, 
    removeFromRecentlyViewed, 
    clearRecentlyViewed 
  } = useRecentlyViewed();

  const {
    savedSearches,
    addToSearchHistory,
    updateSearchUsage,
    removeFromSearchHistory,
    clearSearchHistory,
    getRecentSearches
  } = useSearchHistory();

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch featured, trending, and recent books in parallel
      const [featuredResponse, trendingResponse, recentResponse] = await Promise.all([
        apiClient.get('/books/featured?limit=5'),
        apiClient.get('/books/trending?limit=8'),
        apiClient.get('/books/recent?limit=6')
      ]);

      setFeaturedBooks(featuredResponse.data.data || []);
      setTrendingBooks(trendingResponse.data.data || []);
      setRecentBooks(recentResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching home page data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load home page data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSelect = (suggestion: SearchSuggestion) => {
    const searchParams = {
      query: suggestion.text,
      page: 1,
      pageSize: 20,
      sortBy: 'relevance' as const,
      sortOrder: 'desc' as const,
    };

    // Add to search history
    addToSearchHistory(searchParams);

    // Navigate to books page with search
    const params = new URLSearchParams();
    params.set('q', suggestion.text);
    window.location.href = `/books?${params.toString()}`;
  };

  const handleSearchHistorySelect = (searchParams: any) => {
    updateSearchUsage(searchParams.id || '');
    
    // Navigate to books page with search
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.set(key, value.toString());
        }
      }
    });
    window.location.href = `/books?${params.toString()}`;
  };

  const recentlyViewedBooks = getRecentlyViewedBooks();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden watercolor-bg py-20">
        <div className="absolute inset-0 bg-[url('/Patterns/Stars_gradient.png')] opacity-30"></div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 text-white drop-shadow-2xl">
              Where Your <span className="gradient-text">Bookish Dreams</span> Come True
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Buy and sell secondhand romantasy books with trust. Special editions, signed copies, 
              and rare finds—all with our 72-hour inspection guarantee.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={handleSearchSelect}
                placeholder="Search books, authors, series, or tropes..."
                className="w-full"
              />
              {savedSearches.length > 0 && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearchHistory(!showSearchHistory)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {showSearchHistory ? 'Hide' : 'Show'} Search History
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="gradient" asChild>
                <Link href="/books">Browse Books</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sell">Start Selling</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 opacity-20">
          <Image src="/Patterns/Heart_purple.png" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-10 right-10 w-32 h-32 opacity-20">
          <Image src="/Patterns/ornamental_purple.png" alt="" fill className="object-contain" />
        </div>
      </section>

      {/* Search History Dropdown */}
      {showSearchHistory && (
        <section className="py-8 bg-card/50 backdrop-blur-sm border-b border-border">
          <div className="container">
            <SearchHistory
              savedSearches={getRecentSearches(10)}
              onSearchSelect={handleSearchHistorySelect}
              onRemoveSearch={removeFromSearchHistory}
              onUpdateSearchName={() => {}} // TODO: Implement
              onToggleNotifications={() => {}} // TODO: Implement
              onClearAll={clearSearchHistory}
            />
          </div>
        </section>
      )}

      {/* Featured Books Carousel */}
      {featuredBooks.length > 0 && (
        <section className="py-20 bg-background/80 backdrop-blur-sm">
          <div className="container">
            <h2 className="text-4xl font-serif font-bold text-center mb-12">
              Featured <span className="gradient-text">Books</span>
            </h2>
            <FeaturedBooksCarousel
              books={featuredBooks}
              autoRotate={true}
              autoRotateInterval={6000}
              className="max-w-6xl mx-auto"
            />
          </div>
        </section>
      )}

      {/* Recently Viewed Books */}
      {recentlyViewedBooks.length > 0 && (
        <section className="py-20 watercolor-bg">
          <div className="container">
            <RecentlyViewedBooks
              books={recentlyViewedBooks}
              onRemoveBook={removeFromRecentlyViewed}
              onClearAll={clearRecentlyViewed}
              maxItems={6}
            />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/Image/watercolor-night-sky.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container relative z-10">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            Trending in <span className="gradient-text">Romantasy</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Placeholder book cards */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="book-card overflow-hidden bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-300/30 via-pink-300/30 to-indigo-300/30 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-40">📚</span>
                  </div>
                  {/* Watercolor overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"></div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif font-semibold text-lg mb-1">Book Title {i}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Author Name</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">$24.99</span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      Special Edition
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Special Editions', icon: '✨', color: 'from-primary-500 to-primary-600' },
              { name: 'Signed Copies', icon: '✍️', color: 'from-rose-500 to-rose-600' },
              { name: 'First Editions', icon: '1️⃣', color: 'from-gold-500 to-gold-600' },
              { name: 'Subscription Boxes', icon: '📦', color: 'from-purple-500 to-purple-600' },
            ].map((category) => (
              <Card 
                key={category.name} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 shadow-lg"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="font-serif font-semibold text-white">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 watercolor-bg">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Shop with <span className="gradient-text">Confidence</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2">72-Hour Inspection</h3>
                <p className="text-sm text-muted-foreground">
                  Every purchase includes a 72-hour inspection period
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💝</span>
                </div>
                <h3 className="font-semibold mb-2">Verified Sellers</h3>
                <p className="text-sm text-muted-foreground">
                  All sellers are verified with transaction history
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="font-semibold mb-2">7% Platform Fee</h3>
                <p className="text-sm text-muted-foreground">
                  Simple, transparent pricing for all transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/Logo.png"
                alt="BookHeart"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-serif text-xl font-bold">BookHeart</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 BookHeart. Made with 💜 for bookish hearts.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
