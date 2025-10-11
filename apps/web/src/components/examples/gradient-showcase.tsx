'use client';

import React from 'react';

/**
 * Gradient Background System Showcase
 * 
 * This component demonstrates all the new gradient utilities.
 * Use this as a reference for implementing backgrounds in your components.
 */
export function GradientShowcase() {
  return (
    <div className="space-y-16 py-16">
      {/* Hero Section Example - Bold */}
      <section className="relative min-h-[500px] overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-hero-bold" />
        <div className="absolute inset-0 bg-sparkle-medium" />
        <div className="relative z-10 flex items-center justify-center h-full p-12">
          <div className="text-center">
            <h1 className="gradient-text text-6xl font-bold mb-4">
              Bold Hero Background
            </h1>
            <p className="text-xl text-foreground/90">
              Perfect for landing pages with high visual impact (40-60% opacity)
            </p>
          </div>
        </div>
      </section>

      {/* Medium Depth Example */}
      <section className="relative min-h-[400px] overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-extended-medium-3" />
        <div className="absolute inset-0 bg-gradient-animated" />
        <div className="relative z-10 p-12">
          <h2 className="text-4xl font-bold mb-6">Medium Depth Background</h2>
          <p className="text-lg mb-8">
            Balanced visibility for feature sections (15-25% opacity)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-frosted-purple p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
                <p className="text-sm text-foreground/80">
                  Glass-morphism card with frosted purple tint
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Background Example */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-extended-subtle-5" />
        <div className="relative z-10 p-12">
          <h2 className="text-4xl font-bold mb-6">Subtle Background</h2>
          <p className="text-lg mb-8">
            Best for content-heavy sections where readability is critical (5-10% opacity)
          </p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-base leading-relaxed mb-4">
              This section demonstrates how subtle backgrounds (5-10% opacity) create depth 
              without interfering with text readability. Perfect for dashboards, documentation, 
              or any content-heavy interface.
            </p>
            
            <div className="glass-light p-6 rounded-lg mt-6">
              <h3 className="text-2xl font-semibold mb-3">Light Glass Effect</h3>
              <p className="text-base">
                This card uses the <code className="text-primary">glass-light</code> utility 
                for a subtle glass-morphism effect with 8px blur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Glass-Morphism Variants */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold">Glass-Morphism Variants</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Light Glass */}
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-extended-medium-1" />
            <div className="relative h-full">
              <div className="glass-light p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3">Light Glass</h3>
                <p className="text-sm text-foreground/80 mb-2">8px blur</p>
                <p className="text-sm">
                  Subtle transparency with minimal background color
                </p>
              </div>
            </div>
          </div>

          {/* Medium Glass */}
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-extended-medium-4" />
            <div className="relative h-full">
              <div className="glass-medium p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3">Medium Glass</h3>
                <p className="text-sm text-foreground/80 mb-2">12px blur</p>
                <p className="text-sm">
                  Balanced glass effect for standard UI elements
                </p>
              </div>
            </div>
          </div>

          {/* Heavy Glass */}
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-extended-medium-7" />
            <div className="relative h-full">
              <div className="glass-heavy p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3">Heavy Glass</h3>
                <p className="text-sm text-foreground/80 mb-2">16px blur</p>
                <p className="text-sm">
                  Strong separation with increased blur
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frosted Glass Colors */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold">Frosted Glass with Color Tints</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative min-h-[250px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-extended-bold-2" />
            <div className="relative h-full">
              <div className="glass-frosted-pink p-6 h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Pink Tint</h3>
                <p className="text-sm">Warm, inviting atmosphere</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[250px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-extended-bold-5" />
            <div className="relative h-full">
              <div className="glass-frosted-purple p-6 h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Purple Tint</h3>
                <p className="text-sm">Matches BookHeart brand colors</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[250px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-extended-bold-6" />
            <div className="relative h-full">
              <div className="glass-frosted-blue p-6 h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Blue Tint</h3>
                <p className="text-sm">Cool, professional feel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layering Technique Example */}
      <section className="relative min-h-[400px] overflow-hidden rounded-3xl bg-layer-container">
        <div className="absolute inset-0 bg-gradient-extended-medium-6" />
        <div className="absolute inset-0 bg-gradient-animated" />
        <div className="absolute inset-0 bg-sparkle-subtle" />
        
        <div className="relative z-10 p-12">
          <h2 className="text-4xl font-bold mb-6">Advanced Layering</h2>
          <p className="text-lg mb-8">
            This section combines multiple layers: base gradient + animated overlay + sparkle effect
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold mb-3">Backdrop Blur</h3>
              <p className="text-sm text-foreground/80">
                Using <code className="text-primary">backdrop-blur-lg</code> for 16px blur 
                without additional background color
              </p>
            </div>

            <div className="glass-medium rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-3">Glass Medium</h3>
              <p className="text-sm text-foreground/80">
                Combining blur with semi-transparent background for complete glass effect
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Gradient Variants Grid */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold">All Extended Gradient Variants</h2>
        <p className="text-lg text-foreground/80">
          Choose from 7 different gradient backgrounds, each available in subtle, medium, and bold variants
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="space-y-2">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-extended-subtle-${num}`} />
                <div className="relative z-10 p-4 flex items-center justify-center h-full">
                  <span className="text-sm font-medium">Subtle {num}</span>
                </div>
              </div>
              
              <div className="relative h-32 rounded-lg overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-extended-medium-${num}`} />
                <div className="relative z-10 p-4 flex items-center justify-center h-full">
                  <span className="text-sm font-medium">Medium {num}</span>
                </div>
              </div>
              
              <div className="relative h-32 rounded-lg overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-extended-bold-${num}`} />
                <div className="relative z-10 p-4 flex items-center justify-center h-full">
                  <span className="text-sm font-medium">Bold {num}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Tips */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-extended-subtle-1" />
        <div className="relative z-10 glass-light p-12">
          <h2 className="text-4xl font-bold mb-6">Usage Tips</h2>
          
          <div className="space-y-4 text-base">
            <div className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <p>
                <strong>Content Readability:</strong> Use subtle variants (5-10%) for text-heavy 
                sections like dashboards and documentation.
              </p>
            </div>
            
            <div className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <p>
                <strong>Visual Hierarchy:</strong> Use medium variants (15-25%) for feature 
                sections where you want balanced visibility.
              </p>
            </div>
            
            <div className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <p>
                <strong>High Impact:</strong> Use bold variants (40-60%) for hero sections 
                and landing pages with minimal text.
              </p>
            </div>
            
            <div className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <p>
                <strong>Layer Responsibly:</strong> Don't stack more than 3-4 background layers 
                to maintain performance.
              </p>
            </div>
            
            <div className="flex gap-3">
              <span className="text-primary font-bold">5.</span>
              <p>
                <strong>Mobile Optimization:</strong> All backgrounds automatically switch to 
                mobile-optimized versions on screens ≤768px.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GradientShowcase;

