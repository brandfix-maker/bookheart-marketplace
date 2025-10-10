# 📘 BookHeart Marketplace - Dark Theme Style Guide
## Book Listing Wizard & Navigation Design System

This document outlines the complete color palette and design patterns implemented across the Book Listing Wizard and Navigation components to achieve a cohesive dark aesthetic.

---

## 🎨 Core Color Palette

### Brand Colors
```css
/* BookHeart Brand Colors - Extracted from logo files */
brand-purple-500: #5B3A8F    /* Primary brand purple (Logo_isotype_purple.png) */
brand-purple-400: #BDB0D2    /* Light purple tint */
brand-purple-600: #492E72    /* Dark purple shade */

brand-pink-500: #E991CC      /* Primary brand pink (Logo_Horizontal_Pink.png) */
brand-pink-400: #F6D3EB      /* Light pink tint */
brand-pink-600: #BA74A3      /* Dark pink shade */

/* Usage: Use brand-pink-500 and brand-purple-500 for primary brand elements */
/* Gradients: from-brand-pink-500 to-brand-purple-500 */
```

### Primary Backgrounds
```css
/* Main Container Background */
bg-gray-800/95       /* #1F2937 at 95% opacity - Used for main containers, navbar */
bg-gray-800          /* #1F2937 solid - Used for page backgrounds */

/* Secondary Card/Section Background */
bg-gray-700/50       /* #374151 at 50% opacity - Used for info cards, input containers */
bg-gray-700          /* #374151 solid - Used for hover states */

/* Inactive/Disabled Background */
bg-gray-600          /* #4B5563 - Used for progress bars, inactive step indicators */
```

### Borders
```css
border-gray-700      /* #374151 - Main card borders */
border-gray-600      /* #4B5563 - Info panel borders, input borders */
border-gray-500      /* #6B7280 - Dividers, separators */
```

### Text Colors
```css
/* Primary Text */
text-white           /* #FFFFFF - Headings, important labels */

/* Secondary Text */
text-gray-200        /* #E5E7EB - Navigation links, step labels */
text-gray-300        /* #D1D5DB - Body text, descriptions */

/* Tertiary Text */
text-gray-400        /* #9CA3AF - Helper text, placeholders, minor details */

/* Icon Colors */
text-gray-400        /* #9CA3AF - Standard icons (search, dollar signs, etc.) */
```

---

## 🧩 Component-Specific Patterns

### 1. **Navigation Header**
```tsx
// Header Container
className="sticky top-0 z-50 w-full border-b bg-gray-800/95 backdrop-blur-sm"

// Navigation Links
className="text-gray-200 hover:text-brand-purple-400 transition-colors font-medium"

// Search Input
className="border-gray-600 bg-gray-700 text-white placeholder-gray-400 
           focus:ring-brand-purple-400 focus:border-brand-purple-400"

// Mobile Menu Buttons
className="text-gray-200 hover:text-white hover:bg-gray-700"
```

### 2. **Wizard Container**
```tsx
// Main Wizard Wrapper
className="max-w-4xl mx-auto px-4 py-8 bg-gray-800/95 backdrop-blur-sm rounded-lg"

// Step Card Container
className="p-6 md:p-8 mt-6 bg-gray-800/95 backdrop-blur-sm border-gray-700"
```

### 3. **Progress Indicators**
```tsx
// Mobile Progress Bar Background
className="w-full bg-gray-600 rounded-full h-2"

// Active Progress Fill
className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 h-2 rounded-full"

// Desktop Step Text
className="text-sm font-medium text-gray-200"      // Active step
className="text-sm text-gray-400"                  // Inactive step

// Step Circle States
className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 text-white"  // Current
className="bg-green-500 text-white"                                   // Completed
className="bg-gray-600 text-gray-400"                                 // Inactive
```

### 4. **Info Panels & Tips**
```tsx
// Info Panel Container (Condition Tips, Photo Tips, etc.)
className="p-4 bg-gray-700/50 border-gray-600"

// Info Panel Heading
className="font-medium text-white"

// Info Panel Icon
className="w-5 h-5 text-blue-400"      // For informational panels
className="w-5 h-5 text-amber-400"     // For photo/tip panels
className="w-5 h-5 text-green-400"     // For pricing/earnings panels

// Info Panel Body Text
className="mt-3 text-sm text-gray-300 space-y-2"
```

### 5. **Form Input Containers**
```tsx
// Special Features / Offer Options Sections
className="space-y-3 p-4 bg-gray-700/50 rounded-lg"

// Helper Text Below Inputs
className="text-xs text-gray-400 mt-1"

// Error Text
className="text-sm text-red-500 mt-1"
```

### 6. **Condition Cards (Interactive)**
```tsx
// Selected State
className="border-brand-pink-500 bg-brand-pink-900/30 ring-2 ring-brand-pink-400"

// Unselected State
className="border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:bg-gray-700"

// Card Text
className="text-sm text-gray-300 mt-1"           // Description
className="mt-2 space-y-1 text-xs text-gray-300" // Details list
```

### 7. **Subscription Box Cards**
```tsx
// Selected State
className="border-brand-pink-500 bg-brand-pink-900/30"

// Unselected State
className="border-gray-600 bg-gray-700/50"
```

### 8. **Pricing & Earnings Sections**
```tsx
// Suggested Price Range Card
className="p-4 bg-gray-700/50 border-gray-600"
// Icon: text-green-400
// Heading: text-white
// Body: text-gray-300
// Confidence: text-green-400

// Earnings Breakdown Card
className="p-4 bg-gray-700/50 border-gray-600"
// Heading: text-white
// Primary values: text-gray-300
// Secondary values: text-gray-400
// Divider: border-gray-500
// Total amount: text-white (bold)
```

---

## 🎯 Accent Colors (Brand Colors)

### BookHeart Brand Colors - Extracted from Logo Files
```css
/* Brand Purple - Extracted from Logo_isotype_purple.png */
brand-purple-500: #5B3A8F    /* Base brand purple */
brand-purple-400: #BDB0D2    /* Light purple tint */
brand-purple-600: #492E72    /* Dark purple shade */
brand-purple-700: #372356    /* Darker purple shade */

/* Brand Pink - Extracted from Logo_Horizontal_Pink.png */
brand-pink-500: #E991CC      /* Base brand pink */
brand-pink-400: #F6D3EB      /* Light pink tint */
brand-pink-600: #BA74A3      /* Dark pink shade */
brand-pink-700: #8C577A      /* Darker pink shade */
```

### Brand Gradients (Updated with Exact Brand Colors)
```css
/* Primary Brand Gradient - Using exact brand colors */
bg-gradient-to-r from-brand-pink-500 to-brand-purple-500    /* Headings, CTAs */
bg-gradient-to-r from-brand-pink-400 to-brand-purple-600    /* Progress bars */

/* Logo Colors */
text-brand-purple-500        /* Heart icon */
from-brand-purple-500 to-brand-pink-500  /* BookHeart text gradient */
```

### Interactive Accent Colors (Updated with Brand Colors)
```css
/* Hover States - Using Brand Colors */
hover:text-brand-purple-400      /* Navigation links */
hover:border-brand-pink-400      /* Upload areas */
hover:bg-brand-pink-50           /* Upload areas (light mode remnant - consider updating) */
hover:text-brand-pink-600        /* Upload areas */

/* Selected States - Using Brand Colors */
border-brand-pink-500            /* Selected cards */
bg-brand-pink-900/30            /* Selected card backgrounds */
ring-brand-pink-400             /* Selected card rings */
text-brand-pink-500             /* List bullets in selected states */

/* Success States */
bg-green-500              /* Completed step indicators */
text-green-400            /* Pricing confidence indicators */

/* CTA Button - Using Brand Colors */
bg-gradient-to-r from-brand-pink-500 to-brand-purple-500  /* Sell Your Books button */
```

### Complete Brand Color Scale Reference
```css
/* Brand Purple Scale */
brand-purple-50: #F7F5F9    /* Lightest tint */
brand-purple-100: #EFEBF4   /* Very light tint */
brand-purple-200: #DED8E9   /* Light tint */
brand-purple-300: #CEC4DD   /* Medium-light tint */
brand-purple-400: #BDB0D2   /* Light tint */
brand-purple-500: #5B3A8F   /* Base brand color */
brand-purple-600: #492E72   /* Dark shade */
brand-purple-700: #372356   /* Darker shade */
brand-purple-800: #241739   /* Dark shade */
brand-purple-900: #120C1D   /* Darkest shade */
brand-purple-950: #09060E   /* Very dark shade */

/* Brand Pink Scale */
brand-pink-50: #FEFAFC      /* Lightest tint */
brand-pink-100: #FDF4FA     /* Very light tint */
brand-pink-200: #FBE9F5     /* Light tint */
brand-pink-300: #F8DEF0     /* Medium-light tint */
brand-pink-400: #F6D3EB     /* Light tint */
brand-pink-500: #E991CC     /* Base brand color */
brand-pink-600: #BA74A3     /* Dark shade */
brand-pink-700: #8C577A     /* Darker shade */
brand-pink-800: #5D3A52     /* Dark shade */
brand-pink-900: #2F1D29     /* Darkest shade */
brand-pink-950: #170F14     /* Very dark shade */
```

---

## 🎨 Brand Color Implementation Notes

### Color Extraction Process
- **Brand Purple (#5B3A8F)**: Extracted from `Logo_isotype_purple.png` - represents the primary brand identity
- **Brand Pink (#E991CC)**: Extracted from `Logo_Horizontal_Pink.png` - represents the secondary brand identity
- **Full Scale Generation**: Each color includes 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
- **Tailwind Integration**: Available as `brand-purple-*` and `brand-pink-*` utilities

### Usage Guidelines
1. **Primary Brand Elements**: Use `brand-purple-500` and `brand-pink-500` for main brand elements
2. **Gradients**: Use `from-brand-pink-500 to-brand-purple-500` for primary brand gradients
3. **Interactive States**: Use lighter shades (400-300) for hover states, darker shades (600-700) for active states
4. **Backgrounds**: Use very light shades (50-100) for subtle brand backgrounds
5. **Text**: Use base colors (500) for brand text, lighter shades (400-300) for secondary brand text

### Migration from Generic Colors
- Replace `pink-500` with `brand-pink-500`
- Replace `purple-500` with `brand-purple-500`
- Replace `pink-600` with `brand-pink-600`
- Replace `purple-600` with `brand-purple-600`
- Update gradients to use `brand-` prefixed colors

---

## 📋 Design Patterns & Conventions

### 1. **Hierarchy Pattern**
```
Page Background:          bg-gray-800
  └─ Container:          bg-gray-800/95 + backdrop-blur-sm
       └─ Card:          bg-gray-800/95 OR bg-gray-700/50
            └─ Section:  bg-gray-700/50
```

### 2. **Text Hierarchy**
```
H2 Headings:     bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 (gradient text)
H3/Labels:       text-white
Body Text:       text-gray-300
Helper Text:     text-gray-400
Icons:           text-gray-400 (standard) or themed (blue-400, amber-400, green-400)
```

### 3. **Border Strategy**
```
Main Cards:      border-gray-700
Info Panels:     border-gray-600
Dividers:        border-gray-500
Selected:        border-brand-pink-500
```

### 4. **Transparency Strategy**
- Use `/95` opacity for main containers with `backdrop-blur-sm` for depth
- Use `/50` opacity for nested sections/cards
- Use `/30` opacity for selected state backgrounds (with pink tint)

### 5. **State Colors**
```
Default:         gray-600/700
Hover:           gray-500/700
Selected:        brand-pink-500/900
Completed:       green-500
Active:          pink-purple gradient
Disabled:        gray-600
```

---

## ⚠️ Inconsistencies to Address Site-Wide

Based on the wizard audit, here are remaining inconsistencies to fix across the website:

### 1. **Step 7 (Your Story) - Not Yet Updated**
```tsx
// NEEDS UPDATE - Current light theme remnants:
text-gray-600   →  text-gray-300
text-gray-500   →  text-gray-400
text-gray-900   →  text-white
text-gray-700   →  text-gray-300
bg-gray-100     →  bg-gray-700/50
bg-brand-pink-100     →  bg-brand-pink-900/30
text-brand-pink-700   →  text-brand-pink-400
```

### 2. **Photo Upload Section - Partially Updated**
```tsx
// NEEDS UPDATE in photo upload areas:
border-gray-200      →  border-gray-600
border-gray-300      →  border-gray-600
bg-brand-pink-50          →  bg-brand-pink-900/30
text-gray-500       →  text-gray-400
border-brand-pink-300     →  border-brand-pink-500
bg-brand-pink-50/30       →  bg-brand-pink-900/30
```

### 3. **Success Screen - Not Updated**
```tsx
// Success confetti screen still uses light colors
// Consider keeping lighter for celebratory effect, or update to dark theme
```

---

## 🔧 Implementation Checklist

### ✅ Completed Components
- [x] Navigation Header
- [x] Wizard Container & Progress
- [x] Step 1: Book Identification
- [x] Step 2: Edition Details
- [x] Step 3: Condition Grading
- [x] Step 4: Photo Upload (partially - tips section done)
- [x] Step 5: Tropes & Tags (needs verification)
- [x] Step 6: Pricing & Shipping
- [x] Sell Page Background

### 🚧 Needs Attention
- [ ] Step 7: Your Story - Preview section
- [ ] Photo Upload - Upload placeholder areas
- [ ] Success confirmation screen
- [ ] Other marketplace pages (browse, book details, profile, etc.)

---

## 🎨 Quick Reference - Most Common Classes

**Copy-paste ready combinations:**

```tsx
// Standard info card
className="p-4 bg-gray-700/50 border-gray-600"

// Info card heading
className="font-semibold text-white"

// Info card body
className="text-sm text-gray-300"

// Helper text
className="text-xs text-gray-400 mt-1"

// Unselected interactive card
className="border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:bg-gray-700"

// Selected interactive card
className="border-brand-pink-500 bg-brand-pink-900/30 ring-2 ring-brand-pink-400"

// Section container
className="space-y-3 p-4 bg-gray-700/50 rounded-lg"

// Page background
className="min-h-screen bg-gray-800"

// Main container
className="max-w-4xl mx-auto px-4 py-8 bg-gray-800/95 backdrop-blur-sm rounded-lg"
```

---

## 📝 Notes for Future Development

1. **Consistency is Key**: Always use the established gray scale (800/700/600 for backgrounds, 200/300/400 for text)

2. **Accent Colors**: Reserve pink/purple gradients for CTAs, headings, and selected states only

3. **Transparency Layers**: Main containers at 95%, nested sections at 50%, selected states at 30%

4. **Icon Colors**: Match the panel's theme color (blue-400 for info, amber-400 for tips, green-400 for success)

5. **Hover States**: Generally lighten borders by one shade (600→500) or darken backgrounds by one shade (700/50→700)

6. **Test Contrast**: All text should meet WCAG AA standards on their respective backgrounds

---

This style guide should be used as the single source of truth for all dark theme implementations across the BookHeart marketplace. Any deviations should be documented and justified.
