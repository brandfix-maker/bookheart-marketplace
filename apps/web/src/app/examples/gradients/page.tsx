import React from 'react';
import { GradientShowcase } from '@/components/examples/gradient-showcase';

export const metadata = {
  title: 'Gradient Background System | BookHeart',
  description: 'Showcase of the enhanced gradient background system with depth levels and glass-morphism effects',
};

export default function GradientsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="py-12">
          <div className="mb-12 text-center">
            <h1 className="gradient-text text-5xl md:text-6xl font-bold mb-4">
              Enhanced Gradient System
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Explore the complete gradient background system with three depth levels 
              and glass-morphism effects designed for BookHeart Marketplace
            </p>
          </div>
          
          <GradientShowcase />
        </div>
      </div>
    </div>
  );
}

