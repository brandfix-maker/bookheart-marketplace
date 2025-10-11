# BookSpine Component - Complete Guide

## 🎯 Overview

The `BookSpine` component is a reusable TypeScript React component that displays decorative book spine images with floating animations and optional parallax scrolling effects. Perfect for adding visual interest and depth to your BookHeart Marketplace pages.

## ✨ Features

- 🎨 **Three Size Presets**: Small (60px), Medium (100px), Large (150px)
- 🎭 **Floating Animations**: Gentle up/down movement (10-15px)
- 📜 **Lightweight Parallax**: Scroll-based parallax without external libraries
- ⚡ **Performance Optimized**: Lazy loading, hardware acceleration
- 🎯 **Interactive Hover**: Scale effect on hover
- 💫 **Drop Shadows**: Subtle depth for visual appeal
- 📱 **Responsive**: Works great on all devices
- ♿ **Accessible**: Proper alt text support

## 📦 Installation

The component is already installed! Files are located at:
- Component: `apps/web/src/components/decorative/book-spine.tsx`
- Library: `apps/web/src/components/decorative/book-spine-library.ts`
- Showcase: `apps/web/src/components/decorative/book-spine-showcase.tsx`

## 🚀 Quick Start

### Basic Usage

```tsx
import BookSpine from '@/components/decorative/book-spine';

function MyPage() {
  return (
    <div className="relative min-h-screen">
      <BookSpine
        imagePath="/BookHeart_BookSpine/BS_1/BS_1.png"
        size="md"
        floatDuration={4}
        parallaxStrength={0.3}
        className="left-10 top-20"
      />
      
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### Using the Book Spine Library

```tsx
import BookSpine from '@/components/decorative/book-spine';
import { BOOK_SPINES, getRandomBookSpine } from '@/components/decorative/book-spine-library';

function MyPage() {
  return (
    <div className="relative">
      {/* Use a specific book spine */}
      <BookSpine imagePath={BOOK_SPINES.BS_5.png} size="md" />
      
      {/* Use a random book spine */}
      <BookSpine imagePath={getRandomBookSpine()} size="lg" />
      
      {/* Use SVG for better scalability */}
      <BookSpine imagePath={BOOK_SPINES.BS_3.svg} size="lg" />
      
      {/* Use high-resolution for retina displays */}
      <BookSpine imagePath={BOOK_SPINES.BS_1.png2x} size="lg" />
    </div>
  );
}
```

## 📚 API Reference

### BookSpineProps Interface

```typescript
interface BookSpineProps {
  imagePath: string;           // Path to the book spine image
  size?: 'sm' | 'md' | 'lg';   // Size preset (default: 'md')
  floatDuration?: number;       // Animation duration in seconds (default: 4)
  parallaxStrength?: number;    // 0-1, parallax intensity (default: 0.3)
  className?: string;           // Additional Tailwind classes
  alt?: string;                 // Alt text for accessibility
}
```

### Props Details

#### `imagePath` (required)
Path to the book spine image relative to `/public/`.

```tsx
// PNG
imagePath="/BookHeart_BookSpine/BS_1/BS_1.png"

// SVG (recommended for scalability)
imagePath="/BookHeart_BookSpine/BS_1/BS_1.svg"

// High-res for retina displays
imagePath="/BookHeart_BookSpine/BS_1/BS_1@2x.png"
```

#### `size` (optional)
Size preset for the book spine.

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | 60px  | Backgrounds, subtle decoration |
| `md` | 100px | Standard decoration, balanced |
| `lg` | 150px | Hero sections, focal points |

```tsx
<BookSpine imagePath="..." size="sm" />  // Small
<BookSpine imagePath="..." size="md" />  // Medium (default)
<BookSpine imagePath="..." size="lg" />  // Large
```

#### `floatDuration` (optional)
Duration of the floating animation in seconds. Default: `4`

```tsx
<BookSpine imagePath="..." floatDuration={2} />  // Fast, energetic
<BookSpine imagePath="..." floatDuration={4} />  // Normal (default)
<BookSpine imagePath="..." floatDuration={6} />  // Slow, calm
```

**Recommended range:** 2-6 seconds

#### `parallaxStrength` (optional)
Intensity of the parallax effect. Default: `0.3`

| Value | Effect |
|-------|--------|
| `0` | No parallax (static) |
| `0.2-0.3` | Subtle (recommended) |
| `0.5-0.7` | Noticeable |
| `1.0` | Strong (dramatic) |

```tsx
<BookSpine imagePath="..." parallaxStrength={0} />    // No parallax
<BookSpine imagePath="..." parallaxStrength={0.3} />  // Subtle (default)
<BookSpine imagePath="..." parallaxStrength={0.6} />  // Medium
<BookSpine imagePath="..." parallaxStrength={1} />    // Strong
```

#### `className` (optional)
Additional Tailwind CSS classes for positioning and styling.

```tsx
// Position the book spine
<BookSpine 
  imagePath="..." 
  className="left-10 top-20"  // Position from left and top
/>

// Add rotation
<BookSpine 
  imagePath="..." 
  className="right-[20%] bottom-10 rotate-12"
/>

// Responsive positioning
<BookSpine 
  imagePath="..." 
  className="left-4 md:left-10 lg:left-20 top-10"
/>
```

#### `alt` (optional)
Alt text for accessibility. Default: `'Decorative book spine'`

```tsx
<BookSpine 
  imagePath="..." 
  alt="Decorative vintage book spine for visual interest"
/>
```

## 🎨 Available Book Spines

10 unique book spine designs are available:

- `BS_1` through `BS_10`
- Each available in: PNG, PNG@2x, PNG@3x, and SVG formats

### Library Functions

```typescript
import { 
  BOOK_SPINES,
  getRandomBookSpine,
  getAllBookSpines,
  getBookSpine 
} from '@/components/decorative/book-spine-library';

// Get specific book spine
BOOK_SPINES.BS_1.png    // Standard PNG
BOOK_SPINES.BS_1.svg    // SVG (scalable)
BOOK_SPINES.BS_1.png2x  // 2x resolution
BOOK_SPINES.BS_1.png3x  // 3x resolution

// Get random book spine
const randomSpine = getRandomBookSpine();          // Random PNG
const randomSVG = getRandomBookSpine('svg');       // Random SVG

// Get all book spines
const allSpines = getAllBookSpines();              // All PNGs
const allSVGs = getAllBookSpines('svg');           // All SVGs

// Get by number
const spine5 = getBookSpine(5);                    // BS_5 PNG
const spine7SVG = getBookSpine(7, 'svg');         // BS_7 SVG
```

## 💡 Usage Patterns

### Hero Section

```tsx
<section className="relative min-h-screen overflow-hidden">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-hero-bold" />
  
  {/* Decorative book spines */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_1.png}
    size="lg"
    floatDuration={5}
    parallaxStrength={0.4}
    className="left-[5%] top-[10%] -rotate-12"
  />
  
  <BookSpine
    imagePath={BOOK_SPINES.BS_3.png}
    size="md"
    floatDuration={4}
    parallaxStrength={0.3}
    className="right-[8%] top-[20%] rotate-6"
  />
  
  {/* Main content */}
  <div className="relative z-10 container mx-auto">
    <h1 className="gradient-text">BookHeart Marketplace</h1>
  </div>
</section>
```

### Feature Section

```tsx
<section className="relative py-20 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-extended-medium-3" />
  
  {/* Scattered book spines for ambiance */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_4.png}
    size="sm"
    floatDuration={3.5}
    parallaxStrength={0.2}
    className="left-[2%] top-[15%]"
  />
  
  <BookSpine
    imagePath={BOOK_SPINES.BS_7.png}
    size="sm"
    floatDuration={4.2}
    parallaxStrength={0.2}
    className="right-[3%] bottom-[20%]"
  />
  
  <div className="relative z-10 container mx-auto">
    {/* Your feature content */}
  </div>
</section>
```

### Landing Page Layout

```tsx
<div className="relative min-h-screen">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-hero-medium" />
  <div className="absolute inset-0 bg-sparkle-subtle" />
  
  {/* Left side decorations */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_1.png}
    size="lg"
    floatDuration={5}
    parallaxStrength={0.4}
    className="left-[3%] top-[15%]"
  />
  
  <BookSpine
    imagePath={BOOK_SPINES.BS_2.png}
    size="md"
    floatDuration={4.5}
    parallaxStrength={0.3}
    className="left-[8%] bottom-[20%]"
  />
  
  {/* Right side decorations */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_5.png}
    size="md"
    floatDuration={4.8}
    parallaxStrength={0.35}
    className="right-[5%] top-[25%]"
  />
  
  <BookSpine
    imagePath={BOOK_SPINES.BS_8.png}
    size="sm"
    floatDuration={3.8}
    parallaxStrength={0.25}
    className="right-[12%] bottom-[15%]"
  />
  
  {/* Content */}
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

### Dashboard/About Page

```tsx
<div className="relative py-16">
  {/* Subtle background decoration */}
  <div className="absolute inset-0 bg-gradient-extended-subtle-2" />
  
  {/* Minimal book spines - don't distract from content */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_3.svg}
    size="sm"
    floatDuration={6}
    parallaxStrength={0.1}
    className="right-[5%] top-[10%] opacity-30"
  />
  
  <div className="relative z-10 container mx-auto">
    {/* Dashboard content */}
  </div>
</div>
```

## 🎯 Best Practices

### ✅ Do

1. **Use appropriate sizes**
   - Hero sections: `lg`
   - Feature sections: `md`
   - Background decoration: `sm`

2. **Vary animation speeds**
   ```tsx
   // Create visual interest with different speeds
   <BookSpine floatDuration={3.5} />
   <BookSpine floatDuration={4.2} />
   <BookSpine floatDuration={5.8} />
   ```

3. **Keep parallax subtle**
   ```tsx
   // Recommended range: 0.2 - 0.5
   <BookSpine parallaxStrength={0.3} />
   ```

4. **Position with absolute**
   ```tsx
   // Always use within a relative parent
   <div className="relative">
     <BookSpine className="absolute left-10 top-20" />
   </div>
   ```

5. **Use SVG when possible**
   ```tsx
   // SVG scales better and has smaller file size
   <BookSpine imagePath={BOOK_SPINES.BS_1.svg} />
   ```

6. **Consider mobile**
   ```tsx
   // Hide or adjust on mobile
   <BookSpine className="hidden md:block left-10 top-20" />
   ```

### ❌ Don't

1. **Don't overcrowd**
   - Maximum 5-7 book spines per section
   - Less is more!

2. **Don't block content**
   ```tsx
   // Bad: Blocks important content
   <BookSpine className="left-[50%] top-[50%]" />
   
   // Good: Positioned in margins
   <BookSpine className="left-[5%] top-[10%]" />
   ```

3. **Don't use extreme values**
   ```tsx
   // Avoid
   <BookSpine floatDuration={1} />      // Too fast
   <BookSpine parallaxStrength={2} />   // Too strong
   ```

4. **Don't forget overflow**
   ```tsx
   // Always add overflow-hidden to parent
   <section className="relative overflow-hidden">
     <BookSpine className="left-[-50px]" />
   </section>
   ```

5. **Don't skip accessibility**
   ```tsx
   // Always provide meaningful alt text
   <BookSpine alt="Decorative vintage book spine" />
   ```

## 🎨 Styling Tips

### Positioning

```tsx
// Percentage positioning for responsive layout
<BookSpine className="left-[15%] top-[20%]" />

// Fixed positioning
<BookSpine className="left-10 top-20" />

// Responsive positioning
<BookSpine className="left-4 md:left-10 lg:left-20" />

// Z-index control
<BookSpine className="left-10 top-10 z-0" />  // Behind content
<BookSpine className="left-10 top-10 z-20" /> // In front of content
```

### Rotation

```tsx
// Clockwise rotation
<BookSpine className="rotate-12" />

// Counter-clockwise rotation
<BookSpine className="-rotate-12" />

// Responsive rotation
<BookSpine className="rotate-6 md:rotate-12" />
```

### Opacity

```tsx
// Subtle decoration
<BookSpine className="opacity-30" />

// Medium visibility
<BookSpine className="opacity-60" />

// Full opacity (default)
<BookSpine className="opacity-100" />
```

### Responsive Display

```tsx
// Hide on mobile, show on desktop
<BookSpine className="hidden md:block" />

// Show on mobile, hide on desktop
<BookSpine className="block md:hidden" />

// Different positions for different screen sizes
<BookSpine className="left-2 md:left-10 lg:left-20" />
```

## ⚡ Performance

### Automatic Optimizations

The component includes several performance optimizations:

1. **Lazy Loading**: Images load only when needed
2. **Hardware Acceleration**: CSS transforms use GPU
3. **Passive Scroll Listeners**: Smooth scroll performance
4. **Next.js Image Optimization**: Automatic format conversion and resizing

### Manual Optimizations

```tsx
// Use appropriate image formats
<BookSpine imagePath={BOOK_SPINES.BS_1.svg} />    // Small file size
<BookSpine imagePath={BOOK_SPINES.BS_1.png} />    // Standard
<BookSpine imagePath={BOOK_SPINES.BS_1.png2x} />  // High-DPI only

// Disable parallax for better performance
<BookSpine parallaxStrength={0} />

// Reduce number of book spines on mobile
<BookSpine className="hidden md:block" />
```

## 🐛 Troubleshooting

### Book spine not visible

1. Check parent has `position: relative`
2. Verify image path is correct
3. Check z-index stacking
4. Ensure parent has height

```tsx
// Correct setup
<div className="relative min-h-screen">
  <BookSpine className="left-10 top-20" />
</div>
```

### Animation not smooth

1. Reduce number of book spines
2. Disable parallax: `parallaxStrength={0}`
3. Use CSS `will-change` carefully
4. Check for other heavy animations

### Images not loading

1. Verify image exists in `/public/BookHeart_BookSpine/`
2. Check file path spelling
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server

### Parallax too strong

```tsx
// Reduce strength
<BookSpine parallaxStrength={0.2} />  // Very subtle
<BookSpine parallaxStrength={0} />    // Disable entirely
```

## 📱 Responsive Design

### Mobile-First Approach

```tsx
<div className="relative min-h-screen">
  {/* Mobile: no book spines */}
  
  {/* Tablet: small book spines */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_1.png}
    size="sm"
    className="hidden md:block left-[5%] top-[10%]"
  />
  
  {/* Desktop: larger book spines */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_2.png}
    size="md"
    className="hidden lg:block right-[8%] top-[15%]"
  />
  
  {/* Large desktop: full decoration */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_3.png}
    size="lg"
    className="hidden xl:block left-[10%] bottom-[20%]"
  />
</div>
```

### Breakpoint Strategy

| Breakpoint | Strategy |
|------------|----------|
| Mobile (`<768px`) | 0-2 book spines, size `sm`, low opacity |
| Tablet (`768px-1024px`) | 2-4 book spines, size `sm`-`md` |
| Desktop (`1024px-1280px`) | 4-6 book spines, size `md` |
| Large (`>1280px`) | 5-7 book spines, size `md`-`lg` |

## 🎓 Advanced Examples

### Dynamic Book Spines

```tsx
import { getAllBookSpines } from '@/components/decorative/book-spine-library';

function MyPage() {
  const bookSpines = getAllBookSpines('svg');
  
  return (
    <div className="relative min-h-screen">
      {bookSpines.slice(0, 5).map((spine, index) => (
        <BookSpine
          key={spine}
          imagePath={spine}
          size="md"
          floatDuration={3.5 + index * 0.3}
          parallaxStrength={0.2 + index * 0.05}
          className={`left-[${5 + index * 15}%] top-[${10 + index * 12}%]`}
        />
      ))}
    </div>
  );
}
```

### Interactive Book Spines

```tsx
'use client';

import { useState } from 'react';
import BookSpine from '@/components/decorative/book-spine';

function InteractivePage() {
  const [showSpines, setShowSpines] = useState(true);
  
  return (
    <div className="relative">
      <button onClick={() => setShowSpines(!showSpines)}>
        Toggle Decorations
      </button>
      
      {showSpines && (
        <>
          <BookSpine imagePath={BOOK_SPINES.BS_1.png} size="md" />
          <BookSpine imagePath={BOOK_SPINES.BS_2.png} size="md" />
        </>
      )}
    </div>
  );
}
```

### Themed Book Spines

```tsx
const themeSpines = {
  fantasy: [BOOK_SPINES.BS_1, BOOK_SPINES.BS_3, BOOK_SPINES.BS_7],
  romance: [BOOK_SPINES.BS_2, BOOK_SPINES.BS_5, BOOK_SPINES.BS_9],
  mystery: [BOOK_SPINES.BS_4, BOOK_SPINES.BS_6, BOOK_SPINES.BS_10],
};

function ThemedPage({ theme = 'fantasy' }) {
  const spines = themeSpines[theme];
  
  return (
    <div className="relative">
      {spines.map((spine, i) => (
        <BookSpine
          key={i}
          imagePath={spine.png}
          size="md"
          className={`left-[${15 * i}%] top-[${20 + i * 10}%]`}
        />
      ))}
    </div>
  );
}
```

## 📊 Component Checklist

- ✅ TypeScript interface defined
- ✅ Size presets (sm, md, lg)
- ✅ Floating animation (10-15px)
- ✅ Parallax effect (lightweight)
- ✅ Lazy loading
- ✅ Drop shadow
- ✅ Absolute positioning
- ✅ Hover effect (scale 1.05)
- ✅ Performance optimized
- ✅ Accessibility support
- ✅ Responsive ready
- ✅ Documentation complete

## 🎉 You're Ready!

The BookSpine component is fully implemented and ready to use. Visit the demo at:

```bash
cd apps/web
npm run dev
# Visit: http://localhost:3000/examples/book-spines
```

Happy decorating! 📚✨

