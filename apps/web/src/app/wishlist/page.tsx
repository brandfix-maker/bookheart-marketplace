'use client';

import React, { useState, useEffect } from 'react';
import { WishlistItem } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, Search, Trash2, ShoppingCart, Eye, Star, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    // Filter wishlist items based on search query
    if (!searchQuery.trim()) {
      setFilteredItems(wishlistItems);
    } else {
      const filtered = wishlistItems.filter(item =>
        item.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.book.seriesName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, wishlistItems]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/wishlist');
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (bookId: string) => {
    try {
      await apiClient.delete(`/wishlist/${bookId}`);
      setWishlistItems(prev => prev.filter(item => item.bookId !== bookId));
      toast({
        title: 'Removed from Wishlist',
        description: 'Book has been removed from your wishlist.',
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove book from wishlist.',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      'new': 'bg-green-100 text-green-800',
      'like-new': 'bg-blue-100 text-blue-800',
      'very-good': 'bg-yellow-100 text-yellow-800',
      'good': 'bg-orange-100 text-orange-800',
      'acceptable': 'bg-red-100 text-red-800',
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSpiceLevelText = (level?: number) => {
    if (level === undefined) return '';
    const levels = ['Closed Door', 'Mild', 'Moderate', 'Hot', 'Very Hot', 'Extreme'];
    return levels[level] || '';
  };

  const getSpiceLevelColor = (level?: number) => {
    if (level === undefined) return 'bg-gray-100 text-gray-800';
    const colors = [
      'bg-gray-100 text-gray-800',
      'bg-pink-100 text-pink-800',
      'bg-red-100 text-red-800',
      'bg-red-200 text-red-900',
      'bg-red-300 text-red-900',
      'bg-red-400 text-red-900',
    ];
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-xl text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'book' : 'books'} saved for later
          </p>
        </div>

        {/* Search Bar */}
        {wishlistItems.length > 0 && (
          <Card className="p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>
        )}

        {/* Wishlist Items */}
        {filteredItems.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching books found' : 'Your wishlist is empty'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start adding books you love to your wishlist!'
              }
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/books">
                  Browse Books
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const book = item.book;
              const primaryImage = book.images?.find(img => img.isPrimary) || book.images?.[0];
              const imageUrl = primaryImage?.cloudinaryUrl || '/placeholder-book.jpg';

              return (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Image Container */}
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    
                    {/* Special Edition Badge */}
                    {book.isSpecialEdition && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Special Edition
                        </div>
                      </div>
                    )}

                    {/* Condition Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
                        {book.condition.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Spice Level Badge */}
                    {book.spiceLevel !== undefined && (
                      <div className="absolute bottom-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSpiceLevelColor(book.spiceLevel)}`}>
                          {getSpiceLevelText(book.spiceLevel)}
                        </span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <div className="absolute bottom-2 right-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromWishlist(book.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Title and Author */}
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        by {book.author}
                      </p>
                    </div>

                    {/* Series Info */}
                    {book.seriesName && (
                      <div className="text-xs text-purple-600 font-medium">
                        {book.seriesName}
                        {book.seriesNumber && ` #${book.seriesNumber}`}
                      </div>
                    )}

                    {/* Tropes */}
                    {book.tropes && book.tropes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {book.tropes.slice(0, 3).map((trope, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {trope.replace(/-/g, ' ')}
                          </span>
                        ))}
                        {book.tropes.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{book.tropes.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Seller Info */}
                    {book.seller && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="h-3 w-3 text-purple-600" />
                        </div>
                        <span>{book.seller.displayName || book.seller.username}</span>
                        {book.seller.sellerVerified && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    )}

                    {/* Price and Shipping */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(book.priceCents)}
                        </div>
                        {book.shippingPriceCents > 0 && (
                          <div className="text-sm text-gray-500">
                            +{formatPrice(book.shippingPriceCents)} shipping
                          </div>
                        )}
                        {book.localPickupAvailable && (
                          <div className="text-xs text-green-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Local pickup available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Added Date */}
                    <div className="text-xs text-gray-500">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button asChild className="flex-1">
                        <Link href={`/books/${book.id}`}>
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/books/${book.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
