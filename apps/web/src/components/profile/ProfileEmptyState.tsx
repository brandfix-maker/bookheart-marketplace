'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Heart, ShoppingCart, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function ProfileEmptyState() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const handleStartSelling = () => {
    // Trigger seller onboarding
    const event = new CustomEvent('startSellerOnboarding');
    window.dispatchEvent(event);
  };

  const handleBrowseBooks = () => {
    window.location.href = '/books';
  };

  const handleViewWishlist = () => {
    window.location.href = '/wishlist';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to BookHeart, {user.displayName || user.username}! 📚
          </h2>
          <p className="text-gray-600 mb-4">
            Your journey into the world of romantasy books starts here
          </p>
        </div>
      </Card>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buyer Activities */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Start Shopping</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Discover amazing romantasy books from our community of sellers
          </p>
          <div className="space-y-3">
            <Button 
              onClick={handleBrowseBooks}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Books
            </Button>
            <Button 
              onClick={handleViewWishlist}
              variant="outline"
              className="w-full"
            >
              <Heart className="h-4 w-4 mr-2" />
              View Wishlist
            </Button>
          </div>
        </Card>

        {/* Seller Activities */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Start Selling</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Turn your book collection into cash and help other readers find their next favorite book
          </p>
          <Button 
            onClick={handleStartSelling}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Become a Seller
          </Button>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your BookHeart Journey</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Books Purchased</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Books Listed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Books Sold</div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-3">💡 Getting Started Tips</h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li>• Browse our curated collections to discover new authors and series</li>
          <li>• Add books to your wishlist to get notified about price drops</li>
          <li>• Start selling by listing books you no longer need</li>
          <li>• Join our community discussions to share book recommendations</li>
        </ul>
      </Card>
    </div>
  );
}
