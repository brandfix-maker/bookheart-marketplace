# Marketplace Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- ✅ Database is set up and running
- ✅ API server is configured
- ✅ Web app dependencies are installed
- ✅ Environment variables are set

### Step 1: Start the API Server

```bash
cd apps/api
npm run dev
```

The API should start on `http://localhost:3001`

### Step 2: Start the Web App

```bash
cd apps/web
npm run dev
```

The web app should start on `http://localhost:3000`

### Step 3: Visit the Marketplace

Open your browser and navigate to:
- **Marketplace Home:** http://localhost:3000/marketplace
- **Search Results:** http://localhost:3000/marketplace/search?q=romantasy

---

## 📱 Quick Feature Tour

### 1. **Browse Books**
- Visit `/marketplace`
- See all available books in a beautiful grid layout
- Hover over books to see quick actions (wishlist, cart)

### 2. **Search Books**
- Type in the search bar at the top
- See autocomplete suggestions appear after 300ms
- Press Enter or click "Search" button

### 3. **Filter Books**
- Click the "Filters" button
- Select your desired filters:
  - Price range
  - Condition
  - Subscription boxes
  - Tropes
  - Special features
- Click "Apply Filters"

### 4. **View Book Details**
- Click on any book card
- See full details, seller info, and images

### 5. **Get Recommendations** (Authenticated Users Only)
- Log in to your account
- Visit `/marketplace`
- See "Recommended For You" section at the top

---

## 🎯 Quick Testing Scenarios

### Test 1: Basic Search
1. Go to marketplace
2. Search for "enemies to lovers"
3. Should see books with that trope
4. Autocomplete should show suggestions

### Test 2: Advanced Filtering
1. Click "Filters" button
2. Set price range: $10 - $30
3. Select condition: "Like New"
4. Select subscription box: "FairyLoot"
5. Click "Apply Filters"
6. Should see filtered results

### Test 3: Wishlist & Cart
1. Hover over a book card
2. Click the heart icon (wishlist)
3. Click the cart icon (add to cart)
4. Check that items are added

### Test 4: Pagination
1. Scroll to bottom of page
2. Click "Next" button
3. Should load next page of results
4. URL should update with page parameter

---

## 🐛 Troubleshooting

### Issue: No books showing
**Solution:** Make sure you have active books in the database. Run the seed script if needed.

### Issue: Autocomplete not working
**Solution:** Check that the API is running and `NEXT_PUBLIC_API_URL` is set correctly.

### Issue: Filters not applying
**Solution:** Check browser console for errors. Ensure API endpoints are responding correctly.

### Issue: Images not loading
**Solution:** Verify that Cloudinary URLs are valid and accessible.

### Issue: "Recommended For You" not showing
**Solution:** This section only appears for authenticated users. Make sure you're logged in.

---

## 📊 Sample Data

If you need to test with sample data, you can use these search queries:
- "romantasy"
- "enemies to lovers"
- "special edition"
- "signed copy"
- "ACOTAR"
- "Fourth Wing"

---

## 🔧 Configuration

### Environment Variables

**Web App** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**API Server** (`.env`):
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

---

## 📝 API Endpoints Reference

### Public Endpoints:
- `GET /api/books` - Get all books with filtering
- `GET /api/books/autocomplete?q={query}` - Autocomplete search
- `GET /api/books/recent` - Recently added books
- `GET /api/books/featured` - Featured books
- `GET /api/books/trending` - Trending books

### Authenticated Endpoints:
- `GET /api/books/recommended` - Personalized recommendations

---

## 🎨 Component Usage Examples

### Using BookCard Component:
```tsx
import { BookCard } from '@/components/marketplace/book-card';

<BookCard
  book={book}
  onWishlistToggle={(id) => console.log('Wishlist:', id)}
  onAddToCart={(id) => console.log('Cart:', id)}
  isWishlisted={false}
/>
```

### Using SearchBar Component:
```tsx
import { SearchBar } from '@/components/marketplace/search-bar';

<SearchBar
  placeholder="Search books..."
  onSearch={(query) => console.log('Search:', query)}
/>
```

### Using FilterPanel Component:
```tsx
import { FilterPanel } from '@/components/marketplace/filter-panel';

const [filters, setFilters] = useState({});

<FilterPanel
  isOpen={true}
  onClose={() => {}}
  filters={filters}
  onFiltersChange={setFilters}
  onApply={() => console.log('Apply:', filters)}
  onClear={() => setFilters({})}
/>
```

---

## 🚦 Performance Benchmarks

Expected performance metrics:
- **Page Load:** < 2 seconds
- **Search Results:** < 500ms
- **Autocomplete:** < 100ms
- **Filter Application:** < 300ms

---

## ✅ Feature Checklist

Quick checklist to verify everything is working:

- [ ] Marketplace page loads
- [ ] Books are displayed in grid
- [ ] Search bar accepts input
- [ ] Autocomplete dropdown appears
- [ ] Filter panel opens
- [ ] Filters can be applied
- [ ] Pagination works
- [ ] Book cards are clickable
- [ ] Wishlist icon works
- [ ] Cart icon works
- [ ] Sort dropdown works
- [ ] View toggle works (Grid/List)
- [ ] Categories are clickable
- [ ] Recommended section shows (when logged in)
- [ ] Mobile responsive design works

---

## 🎓 Next Steps

1. **Add Sample Data:** Create some test books with images
2. **Test All Features:** Go through the feature checklist
3. **Customize Design:** Adjust colors, fonts, spacing to match your brand
4. **Add Analytics:** Track searches, clicks, conversions
5. **Optimize Images:** Set up Cloudinary transformations
6. **Deploy:** Deploy to production when ready

---

## 📞 Need Help?

Check these resources:
1. `MARKETPLACE_IMPLEMENTATION.md` - Full technical documentation
2. Component source code - Inline comments explain functionality
3. API routes - Check error responses for debugging

---

## 🎉 You're Ready!

The marketplace is now fully functional. Start browsing, searching, and filtering books with an amazing user experience!

**Happy selling! 📚✨**

