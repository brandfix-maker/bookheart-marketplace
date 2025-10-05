# BookHeart Marketplace Navigation - Setup Guide

## 🎯 Current Status

✅ **Navigation component is fully implemented** at `apps/web/src/components/layout/marketplace-nav.tsx`
✅ **All placeholder routes are created**
✅ **Contexts (Auth, Cart, Wishlist) are implemented**
✅ **Tailwind config includes Dancing Script font**
✅ **Mobile responsive design with bottom navigation**

## ⚠️ Connection Error Fix

### The Problem
The frontend cannot connect to the backend API because the `NEXT_PUBLIC_API_URL` environment variable is missing.

### The Solution

**You need to create a `.env.local` file** (with a leading dot) in the root directory with these contents:

```env
DATABASE_URL=postgresql://neondb_owner:npg_3tdLMilC5fOh@ep-crimson-paper-adanhigf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=sCljfH8BaAn3EWnUdk9vzc7asyDCTIgz
JWT_REFRESH_SECRET=RT5wG0IOTpT0DBkbl7qKWEfJ7Txv2Pqx
NODE_ENV=development
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**The critical line is:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Without this, the frontend doesn't know where to find the backend API, causing connection errors.

## 🚀 Quick Start

### 1. Create Environment File

**Option A - Manual (Windows):**
```powershell
# Create .env.local file manually in root directory
# Copy the contents from above
```

**Option B - Copy from example:**
```powershell
cp .env.example .env.local
# Then edit .env.local with your actual values
```

### 2. Verify Setup

Run the verification script:
```powershell
node verify-setup.js
```

This will check:
- ✅ .env.local file exists
- ✅ All required environment variables are set
- ✅ Navigation component exists
- ✅ Dependencies are installed

### 3. Install Dependencies

```powershell
npm install
```

### 4. Start Development Servers

```powershell
npm run dev
```

This starts:
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:5000

## 🎨 Navigation Features Implemented

### Desktop Navigation (> 1024px)
- **Logo**: BookHeart with Dancing Script font and gradient effect
- **Marketplace Dropdown**: Browse All, Search, Categories
- **Events Bulletin**: Link to existing /events page
- **Forums**: Link to /forums
- **My Listings**: For authenticated sellers only
- **Profile Dropdown**: User menu with all profile options
- **Cart Icon**: With item count badge
- **Wishlist Icon**: With item count badge
- **Sign In/Join**: For guest users

### Mobile Navigation (< 1024px)
- **Top Bar**: Logo, Cart, Wishlist, Hamburger menu
- **Side Drawer**: Slides in from right with full menu
- **Bottom Navigation**: 
  - Home
  - Search
  - Sell (prominent center button)
  - Messages (with unread badge)
  - Profile

### Design Specifications
- ✅ Fixed position with backdrop blur glass morphism
- ✅ Pink-to-purple gradient (#E91E63 to #9C27B0)
- ✅ 0.3s smooth transitions
- ✅ Active page indicator (3px bottom border)
- ✅ Dropdown menus with glass morphism

## 📁 Routes Created

All placeholder routes are implemented:

### Marketplace Routes
- `/` - Landing page with hero section
- `/marketplace` - Main browse page
- `/marketplace/search` - Search page
- `/marketplace/categories/[category]` - Category pages
- `/book/[id]` - Book detail page

### Seller Routes
- `/sell` - Listing creation wizard
- `/dashboard` - Seller dashboard
- `/sales` - My sales page

### User Routes
- `/profile/[username]` - Public profile
- `/profile/settings` - User settings
- `/purchases` - My purchases

### Transaction Routes
- `/cart` - Shopping cart
- `/checkout` - Checkout flow

### Community Routes
- `/messages` - Messaging inbox
- `/forums` - Forums landing
- `/forums/[category]` - Forum category
- `/forums/thread/[id]` - Forum thread
- `/events` - Events bulletin (existing)

### Wishlist Routes
- `/wishlist` - Wishlist page

## 🔧 Troubleshooting

### Issue: "Connection Error" or "Network Error"

**Cause**: Frontend can't reach the backend API.

**Solutions**:
1. ✅ Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
2. ✅ Make sure both servers are running (`npm run dev`)
3. ✅ Check that nothing else is using port 5000
4. ✅ Restart the development servers after adding the env variable

### Issue: "Cannot find module" errors

**Cause**: Dependencies not installed or build artifacts missing.

**Solutions**:
```powershell
# Clean and reinstall
npm run clean:windows
npm install

# Rebuild packages
npm run build
```

### Issue: Font not loading (Dancing Script)

**Cause**: Font import might not be working.

**Solution**: The font is imported in `apps/web/src/app/globals.css` at line 1. If it's not loading, check:
1. Internet connection (fonts load from Google Fonts CDN)
2. Browser console for font loading errors

### Issue: Navigation not showing

**Cause**: Component not imported in layout.

**Solution**: Already fixed - `MarketplaceNav` is imported in `apps/web/src/app/layout.tsx`

## 📝 Next Steps

### Immediate Actions
1. ✅ Create `.env.local` file with all required variables
2. ✅ Run `npm install` to ensure all dependencies are installed
3. ✅ Run `npm run dev` to start both servers
4. ✅ Visit http://localhost:3000 to see the navigation in action

### Development Workflow
1. Frontend changes auto-reload at http://localhost:3000
2. Backend changes auto-reload at http://localhost:5000
3. API endpoints available at http://localhost:5000/api/...
4. Health check: http://localhost:5000/health

### Testing the Navigation
1. Test all dropdown menus (Marketplace, Profile)
2. Test mobile responsiveness (resize browser < 1024px)
3. Test authentication states (logged in vs guest)
4. Test cart and wishlist badge counts
5. Test all route links

## 🎨 Theme Colors

The navigation uses the established BookHeart color palette:

- **Primary Pink**: `#E91E63`
- **Primary Purple**: `#9C27B0`
- **Gradient**: `linear-gradient(135deg, #E91E63, #9C27B0)`
- **Hover States**: Enhanced gradient with smooth 0.3s transition
- **Glass Morphism**: `backdrop-blur-[16px]` with `rgba(233,30,99,0.06)` overlay

## 🔒 Authentication Integration

The navigation integrates with the existing `AuthContext`:

```typescript
const { user, isLoading, logout } = useAuth();
```

Features:
- ✅ Shows appropriate menu items based on auth state
- ✅ Hides seller features for buyers
- ✅ Displays user avatar or initials
- ✅ Logout functionality
- ✅ Guest checkout capability

## 📱 Mobile Features

Bottom navigation (< 1024px):
- **Home**: Navigation to homepage
- **Search**: Quick access to search
- **Sell**: Prominent center button for creating listings
- **Messages**: With unread notification badge
- **Profile**: User profile or login

## ✨ Accessibility

The navigation is built with accessibility in mind:
- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ Focus states on all controls
- ✅ Semantic HTML structure
- ✅ Screen reader friendly

## 🚀 Performance

Optimizations implemented:
- ✅ useCallback for event handlers
- ✅ Conditional rendering to reduce DOM size
- ✅ CSS transitions instead of JavaScript animations
- ✅ Lazy loading of user data
- ✅ Minimal re-renders with proper state management

## 📞 Support

If you continue to experience connection errors after following this guide:

1. Check the terminal output for both servers
2. Look for error messages in the browser console (F12)
3. Verify the API health endpoint: http://localhost:5000/health
4. Check that the database connection is working
5. Review the API server logs for authentication errors

---

**Made with 💜 for BookHeart**
