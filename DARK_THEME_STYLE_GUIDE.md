# 📘 BookHeart Marketplace - Dark Theme Style Guide
## Book Listing Wizard & Navigation Design System

This document outlines the complete color palette and design patterns implemented across the Book Listing Wizard and Navigation components to achieve a cohesive dark aesthetic.

---

## 🎨 Core Color Palette

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
className="text-gray-200 hover:text-purple-400 transition-colors font-medium"

// Search Input
className="border-gray-600 bg-gray-700 text-white placeholder-gray-400 
           focus:ring-purple-400 focus:border-purple-400"

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
className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"

// Desktop Step Text
className="text-sm font-medium text-gray-200"      // Active step
className="text-sm text-gray-400"                  // Inactive step

// Step Circle States
className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"  // Current
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
className="border-pink-500 bg-pink-900/30 ring-2 ring-pink-400"

// Unselected State
className="border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:bg-gray-700"

// Card Text
className="text-sm text-gray-300 mt-1"           // Description
className="mt-2 space-y-1 text-xs text-gray-300" // Details list
```

### 7. **Subscription Box Cards**
```tsx
// Selected State
className="border-pink-500 bg-pink-900/30"

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

## 🎯 Accent Colors (Preserved)

### Brand Gradient
```css
/* Primary Brand Gradient */
bg-gradient-to-r from-pink-600 to-purple-600        /* Headings, CTAs */
bg-gradient-to-r from-pink-500 to-purple-600        /* Progress bars */

/* Logo Colors */
text-purple-600      /* Heart icon */
from-purple-600 to-pink-600  /* BookHeart text gradient */
```

### Interactive Accent Colors
```css
/* Hover States */
hover:text-purple-400      /* Navigation links */
hover:border-pink-400      /* Upload areas */
hover:bg-pink-50           /* Upload areas (light mode remnant - consider updating) */
hover:text-pink-600        /* Upload areas */

/* Selected States */
border-pink-500            /* Selected cards */
bg-pink-900/30            /* Selected card backgrounds */
ring-pink-400             /* Selected card rings */
text-pink-500             /* List bullets in selected states */

/* Success States */
bg-green-500              /* Completed step indicators */
text-green-400            /* Pricing confidence indicators */

/* CTA Button */
bg-gradient-to-r from-[#E91E63] to-[#9C27B0]  /* Sell Your Books button */
```

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
H2 Headings:     bg-gradient-to-r from-pink-600 to-purple-600 (gradient text)
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
Selected:        border-pink-500
```

### 4. **Transparency Strategy**
- Use `/95` opacity for main containers with `backdrop-blur-sm` for depth
- Use `/50` opacity for nested sections/cards
- Use `/30` opacity for selected state backgrounds (with pink tint)

### 5. **State Colors**
```
Default:         gray-600/700
Hover:           gray-500/700
Selected:        pink-500/900
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
bg-pink-100     →  bg-pink-900/30
text-pink-700   →  text-pink-400
```

### 2. **Photo Upload Section - Partially Updated**
```tsx
// NEEDS UPDATE in photo upload areas:
border-gray-200      →  border-gray-600
border-gray-300      →  border-gray-600
bg-pink-50          →  bg-pink-900/30
text-gray-500       →  text-gray-400
border-pink-300     →  border-pink-500
bg-pink-50/30       →  bg-pink-900/30
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
className="border-pink-500 bg-pink-900/30 ring-2 ring-pink-400"

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
