# BookSpine Component - Quick Start

## 🚀 Get Started in 3 Steps

### 1. View the Demo
```bash
cd apps/web
npm run dev
# Visit: http://localhost:3000/examples/book-spines
```

### 2. Import and Use

```tsx
import BookSpine from '@/components/decorative/book-spine';
import { BOOK_SPINES } from '@/components/decorative/book-spine-library';

function MyPage() {
  return (
    <div className="relative min-h-screen">
      {/* Your decorative book spine */}
      <BookSpine
        imagePath={BOOK_SPINES.BS_1.png}
        size="md"
        floatDuration={4}
        parallaxStrength={0.3}
        className="left-10 top-20"
      />
      
      {/* Your content */}
      <div className="relative z-10">
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

### 3. Customize

```tsx
{/* Small size, fast animation, no parallax */}
<BookSpine
  imagePath={BOOK_SPINES.BS_3.svg}
  size="sm"
  floatDuration={2}
  parallaxStrength={0}
  className="right-[5%] top-[15%]"
/>

{/* Large size, slow animation, strong parallax */}
<BookSpine
  imagePath={BOOK_SPINES.BS_7.png}
  size="lg"
  floatDuration={6}
  parallaxStrength={0.8}
  className="left-[80%] bottom-[20%] rotate-12"
/>
```

## 📋 Props Cheat Sheet

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imagePath` | `string` | **required** | Path to book spine image |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | 60px \| 100px \| 150px |
| `floatDuration` | `number` | `4` | Animation speed (seconds) |
| `parallaxStrength` | `number` | `0.3` | Parallax intensity (0-1) |
| `className` | `string` | `''` | Tailwind classes |
| `alt` | `string` | `'Decorative book spine'` | Alt text |

## 🎨 Available Book Spines

```tsx
import { BOOK_SPINES } from '@/components/decorative/book-spine-library';

// 10 unique designs: BS_1 through BS_10
// 4 formats each: png, svg, png2x, png3x

<BookSpine imagePath={BOOK_SPINES.BS_1.png} />    // Standard PNG
<BookSpine imagePath={BOOK_SPINES.BS_1.svg} />    // SVG (recommended)
<BookSpine imagePath={BOOK_SPINES.BS_1.png2x} />  // 2x resolution
<BookSpine imagePath={BOOK_SPINES.BS_1.png3x} />  // 3x resolution
```

## 💡 Common Patterns

### Hero Section
```tsx
<section className="relative min-h-screen overflow-hidden">
  <div className="absolute inset-0 bg-gradient-hero-bold" />
  
  <BookSpine
    imagePath={BOOK_SPINES.BS_1.png}
    size="lg"
    className="left-[5%] top-[15%]"
  />
  
  <BookSpine
    imagePath={BOOK_SPINES.BS_3.png}
    size="md"
    className="right-[8%] top-[25%]"
  />
  
  <div className="relative z-10">
    <h1 className="gradient-text">Your Title</h1>
  </div>
</section>
```

### Feature Section
```tsx
<section className="relative py-20 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-extended-medium-3" />
  
  {/* Subtle background decoration */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_5.svg}
    size="sm"
    floatDuration={5}
    parallaxStrength={0.2}
    className="left-[3%] top-[10%] opacity-40"
  />
  
  <div className="relative z-10">
    {/* Your content */}
  </div>
</section>
```

### Landing Page
```tsx
<div className="relative min-h-screen">
  <div className="absolute inset-0 bg-gradient-hero-medium" />
  
  {/* Left side */}
  <BookSpine imagePath={BOOK_SPINES.BS_2.png} size="lg" className="left-[5%] top-[20%]" />
  <BookSpine imagePath={BOOK_SPINES.BS_4.png} size="md" className="left-[10%] bottom-[15%]" />
  
  {/* Right side */}
  <BookSpine imagePath={BOOK_SPINES.BS_6.png} size="md" className="right-[8%] top-[30%]" />
  <BookSpine imagePath={BOOK_SPINES.BS_8.png} size="sm" className="right-[15%] bottom-[20%]" />
  
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

## 🎯 Helper Functions

```tsx
import { 
  getRandomBookSpine,
  getAllBookSpines,
  getBookSpine 
} from '@/components/decorative/book-spine-library';

// Random book spine
const random = getRandomBookSpine();           // Random PNG
const randomSVG = getRandomBookSpine('svg');   // Random SVG

// All book spines
const all = getAllBookSpines();                // All PNGs
const allSVG = getAllBookSpines('svg');       // All SVGs

// Specific book spine
const five = getBookSpine(5);                  // BS_5 PNG
const sevenSVG = getBookSpine(7, 'svg');      // BS_7 SVG
```

## ✅ Best Practices

**Do:**
- ✅ Use `relative` parent container
- ✅ Keep parallax between 0.2-0.5
- ✅ Use SVG when possible
- ✅ Limit to 5-7 spines per section
- ✅ Vary animation speeds

**Don't:**
- ❌ Block important content
- ❌ Use too many spines
- ❌ Set parallax > 1.0
- ❌ Forget `overflow-hidden` on parent

## 📱 Responsive Example

```tsx
<div className="relative min-h-screen overflow-hidden">
  {/* Hide on mobile */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_1.svg}
    size="md"
    className="hidden md:block left-[5%] top-[10%]"
  />
  
  {/* Show only on desktop */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_2.svg}
    size="lg"
    className="hidden lg:block right-[8%] top-[15%]"
  />
  
  {/* Responsive sizing and positioning */}
  <BookSpine
    imagePath={BOOK_SPINES.BS_3.svg}
    size="sm"
    className="left-2 md:left-10 lg:left-20 top-20"
  />
</div>
```

## 🎨 Size Guide

| Size | Width | Best For |
|------|-------|----------|
| `sm` | 60px | Background decoration, mobile |
| `md` | 100px | Standard use, balanced |
| `lg` | 150px | Hero sections, focal points |

## ⚡ Performance Tips

1. **Use SVG** for smaller file sizes
2. **Disable parallax** on mobile: `parallaxStrength={0}`
3. **Hide extras** on mobile: `className="hidden md:block"`
4. **Limit quantity** to 5-7 per section
5. **Lazy loading** is automatic ✅

## 🎭 Animation Guide

| Duration | Feel | Use Case |
|----------|------|----------|
| 2-3s | Fast, energetic | Action pages |
| 4-5s | Balanced | Standard pages |
| 6-7s | Slow, calm | Reading pages |

## 📚 Full Documentation

For complete details, see:
- **BOOKSPINE_COMPONENT_GUIDE.md** - Complete guide
- **/examples/book-spines** - Live demo

## 🎉 Ready-to-Copy Templates

### Template 1: Simple Hero
```tsx
<div className="relative min-h-screen overflow-hidden">
  <div className="absolute inset-0 bg-gradient-hero-bold" />
  
  <BookSpine
    imagePath={BOOK_SPINES.BS_1.png}
    size="lg"
    className="left-[10%] top-[20%]"
  />
  
  <div className="relative z-10 container mx-auto">
    <h1>Your Content</h1>
  </div>
</div>
```

### Template 2: Feature Grid
```tsx
<section className="relative py-20 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-extended-medium-4" />
  
  <BookSpine imagePath={BOOK_SPINES.BS_2.svg} size="sm" className="left-[5%] top-[15%]" />
  <BookSpine imagePath={BOOK_SPINES.BS_5.svg} size="sm" className="right-[5%] bottom-[20%]" />
  
  <div className="relative z-10 container mx-auto">
    {/* Grid content */}
  </div>
</section>
```

### Template 3: Full Decoration
```tsx
<div className="relative min-h-screen overflow-hidden">
  <div className="absolute inset-0 bg-gradient-hero-medium" />
  <div className="absolute inset-0 bg-sparkle-subtle" />
  
  {/* Multiple book spines for rich decoration */}
  <BookSpine imagePath={BOOK_SPINES.BS_1.png} size="lg" floatDuration={5} className="left-[5%] top-[15%]" />
  <BookSpine imagePath={BOOK_SPINES.BS_3.png} size="md" floatDuration={4.2} className="left-[12%] bottom-[20%]" />
  <BookSpine imagePath={BOOK_SPINES.BS_5.png} size="md" floatDuration={4.5} className="right-[8%] top-[25%]" />
  <BookSpine imagePath={BOOK_SPINES.BS_7.png} size="sm" floatDuration={3.8} className="right-[15%] bottom-[15%]" />
  
  <div className="relative z-10">
    <h1 className="gradient-text">BookHeart</h1>
  </div>
</div>
```

---

**That's it! Start decorating your pages with beautiful floating book spines! 📚✨**

