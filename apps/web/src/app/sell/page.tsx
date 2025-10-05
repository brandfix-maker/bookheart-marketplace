'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookListingWizard } from '@/components/sell/book-listing-wizard';
import { PackagePlus, LogIn, UserPlus } from 'lucide-react';

export default function SellPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Authentication gate
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <PackagePlus className="h-24 w-24 text-pink-600" />
          </div>
          
          <div>
            <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              List Your Book
            </h1>
            <p className="text-xl text-gray-300">
              Share your beloved books with the community
            </p>
          </div>

          <Card className="bg-gray-700/90 backdrop-blur-sm rounded-lg border-2 border-pink-400 p-12">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-pink-600" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Create an account to start selling your collection
                </h2>
                <p className="text-gray-300">
                  Join our community of book lovers and turn your collection into cash
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => router.push('/register?redirect=/sell')}
                  className="bg-gradient-to-r from-pink-600 to-purple-600"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Sign Up to Sell
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/login?redirect=/sell')}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Already Have an Account? Log In
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-500">
                <h3 className="font-semibold text-white mb-3">
                  Why sell on BookHeart?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl mb-2">📸</span>
                    <p className="font-medium">Easy Listing Process</p>
                    <p className="text-xs">7-step wizard with photo guides</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl mb-2">💰</span>
                    <p className="font-medium">Fair Pricing</p>
                    <p className="text-xs">Only 7% platform fee</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl mb-2">💖</span>
                    <p className="font-medium">Trusted Community</p>
                    <p className="text-xs">Connect with fellow book lovers</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated user - show wizard
  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto">
        <BookListingWizard />
      </div>
    </div>
  );
}
