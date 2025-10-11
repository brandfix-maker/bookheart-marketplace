import React from 'react';
import { BookSpineShowcase } from '@/components/decorative/book-spine-showcase';

export const metadata = {
  title: 'Book Spine Components | BookHeart',
  description: 'Interactive showcase of decorative book spine components with floating and parallax animations',
};

export default function BookSpinesPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="py-12">
          <div className="mb-12 text-center">
            <h1 className="gradient-text text-5xl md:text-6xl font-bold mb-4">
              Book Spine Components
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Decorative book spine images with floating animations and parallax effects.
              Perfect for adding visual interest to your BookHeart Marketplace pages.
            </p>
          </div>
          
          <BookSpineShowcase />
        </div>
      </div>
    </div>
  );
}

