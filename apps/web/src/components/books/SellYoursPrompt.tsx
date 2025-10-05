'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface SellYoursPromptProps {
  bookTitle: string;
  bookAuthor: string;
  className?: string;
}

export function SellYoursPrompt({ bookTitle, bookAuthor, className = '' }: SellYoursPromptProps) {
  const { user } = useAuth();

  // Don't show if user is already a seller
  if (!user || user.sellerOnboardingCompleted || user.hasListedItem) {
    return null;
  }

  const handleStartSelling = () => {
    // Trigger seller onboarding
    const event = new CustomEvent('startSellerOnboarding');
    window.dispatchEvent(event);
  };

  return (
    <div
      className={`absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center ${className}`}
    >
      <div className="text-center text-white p-4">
        <BookOpen className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm font-medium mb-2">Have this book?</p>
        <p className="text-xs mb-3 opacity-90">
          "{bookTitle}" by {bookAuthor}
        </p>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleStartSelling}
        >
          <Plus className="h-3 w-3 mr-1" />
          Sell Yours
        </Button>
      </div>
    </div>
  );
}

// Alternative: Inline prompt for book cards
export function SellYoursInline({ bookTitle, bookAuthor }: SellYoursPromptProps) {
  const { user } = useAuth();

  // Don't show if user is already a seller
  if (!user || user.sellerOnboardingCompleted || user.hasListedItem) {
    return null;
  }

  const handleStartSelling = () => {
    // Trigger seller onboarding
    const event = new CustomEvent('startSellerOnboarding');
    window.dispatchEvent(event);
  };

  return (
    <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
      <p className="text-xs text-purple-800 mb-2">
        Have "{bookTitle}" by {bookAuthor}?
      </p>
      <Button
        size="sm"
        variant="outline"
        className="w-full text-purple-600 border-purple-300 hover:bg-purple-100"
        onClick={handleStartSelling}
      >
        <Plus className="h-3 w-3 mr-1" />
        Start Selling
      </Button>
    </div>
  );
}
