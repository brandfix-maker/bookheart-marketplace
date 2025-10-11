'use client';

import React from 'react';
import BookSpine from './book-spine';
import { BOOK_SPINES, getAllBookSpines } from './book-spine-library';

/**
 * BookSpine Showcase Component
 * 
 * Demonstrates all BookSpine component features and use cases.
 */
export function BookSpineShowcase() {
  return (
    <div className="space-y-24 py-16">
      {/* Size Variants */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Size Variants</h2>
          <p className="text-lg text-foreground/80">
            Three size presets: small (60px), medium (100px), and large (150px)
          </p>
        </div>
        
        <div className="relative h-[600px] bg-gradient-extended-subtle-2 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-animated" />
          
          {/* Small */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_1.png}
            size="sm"
            floatDuration={3}
            parallaxStrength={0.2}
            className="left-[10%] top-[20%]"
            alt="Small book spine"
          />
          
          {/* Medium */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_2.png}
            size="md"
            floatDuration={4}
            parallaxStrength={0.3}
            className="left-[40%] top-[15%]"
            alt="Medium book spine"
          />
          
          {/* Large */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_3.png}
            size="lg"
            floatDuration={5}
            parallaxStrength={0.4}
            className="left-[70%] top-[10%]"
            alt="Large book spine"
          />
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="glass-medium p-8 rounded-xl max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">Size Comparison</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Left:</strong> Small (60px width)</p>
                <p><strong>Center:</strong> Medium (100px width)</p>
                <p><strong>Right:</strong> Large (150px width)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Float Duration Variants */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Float Duration Variants</h2>
          <p className="text-lg text-foreground/80">
            Different animation speeds create visual variety
          </p>
        </div>
        
        <div className="relative h-[600px] bg-gradient-extended-subtle-4 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-animated" />
          
          {/* Fast */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_4.png}
            size="md"
            floatDuration={2}
            parallaxStrength={0.3}
            className="left-[15%] top-[25%]"
            alt="Fast floating book"
          />
          
          {/* Normal */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_5.png}
            size="md"
            floatDuration={4}
            parallaxStrength={0.3}
            className="left-[45%] top-[20%]"
            alt="Normal floating book"
          />
          
          {/* Slow */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_6.png}
            size="md"
            floatDuration={6}
            parallaxStrength={0.3}
            className="left-[75%] top-[25%]"
            alt="Slow floating book"
          />
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="glass-medium p-8 rounded-xl max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">Animation Speeds</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Left:</strong> Fast (2 seconds) - Energetic</p>
                <p><strong>Center:</strong> Normal (4 seconds) - Balanced</p>
                <p><strong>Right:</strong> Slow (6 seconds) - Calm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Strength */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Parallax Effect</h2>
          <p className="text-lg text-foreground/80">
            Scroll to see the parallax effect in action (0 = none, 1 = strong)
          </p>
        </div>
        
        <div className="relative h-[800px] bg-gradient-extended-subtle-6 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-sparkle-subtle" />
          
          {/* No Parallax */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_7.png}
            size="md"
            floatDuration={4}
            parallaxStrength={0}
            className="left-[10%] top-[10%]"
            alt="No parallax book"
          />
          
          {/* Light Parallax */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_8.png}
            size="md"
            floatDuration={4}
            parallaxStrength={0.3}
            className="left-[30%] top-[30%]"
            alt="Light parallax book"
          />
          
          {/* Medium Parallax */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_9.png}
            size="md"
            floatDuration={4}
            parallaxStrength={0.6}
            className="left-[50%] top-[50%]"
            alt="Medium parallax book"
          />
          
          {/* Strong Parallax */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_10.png}
            size="md"
            floatDuration={4}
            parallaxStrength={1}
            className="left-[70%] top-[20%]"
            alt="Strong parallax book"
          />
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="glass-medium p-8 rounded-xl max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">Parallax Strengths</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Top Left:</strong> None (0) - Static</p>
                <p><strong>Middle Left:</strong> Light (0.3) - Subtle</p>
                <p><strong>Center:</strong> Medium (0.6) - Noticeable</p>
                <p><strong>Right:</strong> Strong (1.0) - Dynamic</p>
              </div>
              <p className="mt-4 text-xs text-foreground/70">
                💡 Tip: Scroll up and down to see the effect!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Book Spines Gallery */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Complete Book Spine Library</h2>
          <p className="text-lg text-foreground/80">
            All 10 available book spine designs
          </p>
        </div>
        
        <div className="relative min-h-[1000px] bg-gradient-extended-medium-3 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-animated" />
          <div className="absolute inset-0 bg-sparkle-subtle" />
          
          {/* Arrange all 10 book spines in a visually pleasing layout */}
          <BookSpine
            imagePath={BOOK_SPINES.BS_1.png}
            size="sm"
            floatDuration={3.5}
            parallaxStrength={0.2}
            className="left-[5%] top-[10%]"
            alt="Book spine 1"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_2.png}
            size="md"
            floatDuration={4.2}
            parallaxStrength={0.3}
            className="left-[15%] top-[35%]"
            alt="Book spine 2"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_3.png}
            size="lg"
            floatDuration={5}
            parallaxStrength={0.4}
            className="left-[8%] top-[65%]"
            alt="Book spine 3"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_4.png}
            size="md"
            floatDuration={3.8}
            parallaxStrength={0.35}
            className="left-[28%] top-[15%]"
            alt="Book spine 4"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_5.png}
            size="sm"
            floatDuration={4.5}
            parallaxStrength={0.25}
            className="left-[38%] top-[45%]"
            alt="Book spine 5"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_6.png}
            size="lg"
            floatDuration={5.5}
            parallaxStrength={0.45}
            className="left-[30%] top-[70%]"
            alt="Book spine 6"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_7.png}
            size="md"
            floatDuration={4}
            parallaxStrength={0.3}
            className="left-[52%] top-[8%]"
            alt="Book spine 7"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_8.png}
            size="sm"
            floatDuration={3.7}
            parallaxStrength={0.28}
            className="left-[63%] top-[38%]"
            alt="Book spine 8"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_9.png}
            size="lg"
            floatDuration={5.2}
            parallaxStrength={0.42}
            className="left-[55%] top-[68%]"
            alt="Book spine 9"
          />
          
          <BookSpine
            imagePath={BOOK_SPINES.BS_10.png}
            size="md"
            floatDuration={4.3}
            parallaxStrength={0.33}
            className="left-[78%] top-[25%]"
            alt="Book spine 10"
          />
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="glass-heavy backdrop-blur-xl p-12 rounded-2xl max-w-3xl">
              <h3 className="text-3xl font-bold mb-6 text-center gradient-text">
                BookSpine Component Library
              </h3>
              <div className="space-y-4 text-base">
                <p>
                  Each book spine is uniquely positioned with varying sizes, float durations,
                  and parallax strengths to create visual depth and interest.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="glass-light p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Features</h4>
                    <ul className="text-sm space-y-1">
                      <li>✨ 3 size presets</li>
                      <li>🎭 Floating animations</li>
                      <li>📜 Parallax scrolling</li>
                      <li>⚡ Lazy loading</li>
                    </ul>
                  </div>
                  <div className="glass-light p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Performance</h4>
                    <ul className="text-sm space-y-1">
                      <li>🚀 Optimized images</li>
                      <li>💫 Smooth transitions</li>
                      <li>🎯 Hover effects</li>
                      <li>📱 Responsive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Usage Examples</h2>
          <p className="text-lg text-foreground/80">
            How to use BookSpine in your components
          </p>
        </div>
        
        <div className="glass-light p-8 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Code Examples</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Basic Usage</h4>
              <pre className="bg-black/20 p-4 rounded-lg text-sm overflow-x-auto">
{`<div className="relative min-h-screen">
  <BookSpine
    imagePath="/BookHeart_BookSpine/BS_1/BS_1.png"
    size="md"
    floatDuration={4}
    parallaxStrength={0.3}
    className="left-10 top-20"
  />
</div>`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-primary">Using the Library</h4>
              <pre className="bg-black/20 p-4 rounded-lg text-sm overflow-x-auto">
{`import BookSpine from '@/components/decorative/book-spine';
import { BOOK_SPINES, getRandomBookSpine } from '@/components/decorative/book-spine-library';

// Use specific book spine
<BookSpine imagePath={BOOK_SPINES.BS_5.png} size="lg" />

// Use random book spine
<BookSpine imagePath={getRandomBookSpine()} size="md" />

// Use SVG for scalability
<BookSpine imagePath={BOOK_SPINES.BS_3.svg} size="lg" />`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-primary">Custom Configuration</h4>
              <pre className="bg-black/20 p-4 rounded-lg text-sm overflow-x-auto">
{`<BookSpine
  imagePath={BOOK_SPINES.BS_7.png}
  size="lg"
  floatDuration={6}        // Slower floating
  parallaxStrength={0.8}   // Strong parallax
  className="right-[10%] top-[30%] rotate-12"
  alt="Decorative book spine with custom styling"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Tips */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Performance & Best Practices</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="glass-frosted-purple p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">✅ Do</h3>
            <ul className="space-y-2 text-sm">
              <li>• Use appropriate size presets for your layout</li>
              <li>• Vary float durations for visual interest</li>
              <li>• Use PNG for photos, SVG for illustrations</li>
              <li>• Position with absolute within relative parent</li>
              <li>• Keep parallax strength between 0.2-0.5 for subtlety</li>
              <li>• Use lazy loading (built-in)</li>
            </ul>
          </div>
          
          <div className="glass-frosted-pink p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">❌ Don't</h3>
            <ul className="space-y-2 text-sm">
              <li>• Don't use too many spines (5-7 max per section)</li>
              <li>• Don't set parallax strength above 1.0</li>
              <li>• Don't position spines over important content</li>
              <li>• Don't use overly fast animations (&lt;2s)</li>
              <li>• Don't forget the relative parent container</li>
              <li>• Don't use large sizes on mobile (use responsive CSS)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookSpineShowcase;

