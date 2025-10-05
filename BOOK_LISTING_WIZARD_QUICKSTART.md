# 🚀 Quick Start: Book Listing Wizard

## Prerequisites
- Node.js installed
- Database setup and running
- API server running on http://localhost:5000
- Web app running on http://localhost:3000

## Setup Instructions

### 1. Install Dependencies (if not already done)
```bash
# From project root
npm install

# Install wizard-specific dependencies
cd apps/web
npm install react-confetti react-hook-form @hookform/resolvers zod class-variance-authority
```

### 2. Start the Development Servers

```bash
# Terminal 1: Start API server
cd apps/api
npm run dev

# Terminal 2: Start Web app
cd apps/web
npm run dev
```

### 3. Test the Feature

#### Test Flow 1: Authentication Gate
1. Open browser to http://localhost:3000/sell
2. **Expected**: See authentication gate (if not logged in)
3. Click "Sign Up to Sell"
4. Complete registration
5. **Expected**: Automatically redirected back to /sell
6. **Expected**: See the wizard interface

#### Test Flow 2: Complete a Book Listing
1. Navigate to http://localhost:3000/sell (while logged in)
2. **Step 1 - Book Identification**:
   - Type "Fourth Wing" in search box
   - Wait for autocomplete results
   - Click a book to select it
   - Click "Continue"
3. **Step 2 - Edition Details**:
   - Select "Special Edition"
   - Click "FairyLoot" subscription box
   - Check "Is it signed?" → Select "Hand Signature"
   - Check "Painted Edges" → Enter "Purple sprayed edges"
   - Click "Continue"
4. **Step 3 - Condition Grading**:
   - Select "Like New"
   - Enter condition notes (min 20 chars)
   - Click "Continue"
5. **Step 4 - Photos**:
   - Click "Add Photo" on Front Cover
   - Upload an image (jpg/png, < 2MB)
   - Repeat for at least 2 more required photos
   - Click "Continue"
6. **Step 5 - Tropes & Tags**:
   - Select tropes: "enemies-to-lovers", "dragons", "slow-burn"
   - Set spice level: 3 chilies
   - Click "Continue"
7. **Step 6 - Pricing & Shipping**:
   - Enter price: $35
   - Check "Accept Offers"
   - Leave shipping at $4.99
   - Click "Continue"
8. **Step 7 - Your Story**:
   - Write description (min 50 chars)
   - Click bold/italic to format text
   - Add emoji hearts 💖
   - Click "Show Preview" to see listing
   - Click "Publish Listing"
9. **Expected**: See confetti animation and success screen!

## Common Issues & Solutions

### Issue: "Cannot find module 'react-confetti'"
**Solution**: 
```bash
cd apps/web
npm install react-confetti
```

### Issue: API returns 401 Unauthorized
**Solution**: Make sure you're logged in. Clear cookies and log in again.

### Issue: Photos won't upload
**Solution**: 
- Check file size (must be < 2MB)
- Check file format (jpg, png, webp only)
- Images are stored as preview URLs until Cloudinary is integrated

### Issue: Can't proceed to next step
**Solution**: 
- Check for red error messages
- Ensure all required fields are filled
- Required fields are marked with red asterisks (*)

### Issue: Auto-save not working
**Solution**: Auto-save triggers after 30 seconds of changes. Watch browser console for any errors.

## Feature Testing Checklist

### Authentication
- [ ] Non-logged-in users see auth gate
- [ ] Auth gate has signup and login buttons
- [ ] After signup, redirects to /sell
- [ ] After login, redirects to /sell
- [ ] Logged-in users see wizard immediately

### Step 1: Book Identification
- [ ] Search box shows autocomplete results
- [ ] Can select a book from results
- [ ] Selected book shows in preview card
- [ ] Can switch to manual entry
- [ ] Manual entry validates required fields

### Step 2: Edition Details
- [ ] Can select edition type
- [ ] Can select multiple subscription boxes
- [ ] Signature options appear when checked
- [ ] Special features checkboxes work
- [ ] Painted edges color input appears when checked

### Step 3: Condition Grading
- [ ] Can select condition grade
- [ ] Info panel expands/collapses
- [ ] Condition notes validates minimum length
- [ ] Character counter updates

### Step 4: Photos
- [ ] Can upload photos
- [ ] Photos show preview
- [ ] Can remove photos
- [ ] Photo tips panel works
- [ ] Required photo slots are marked
- [ ] Mobile camera button works on mobile

### Step 5: Tropes & Tags
- [ ] Can search tropes
- [ ] Can filter by category
- [ ] Selected tropes show in badge area
- [ ] Can click badge to remove trope
- [ ] Spice level slider works
- [ ] Subscription boxes auto-tagged

### Step 6: Pricing & Shipping
- [ ] Price suggestion shows
- [ ] Price validates min/max
- [ ] Accept offers checkbox works
- [ ] Auction options appear when checked
- [ ] Earnings breakdown calculates correctly
- [ ] Local pickup ZIP appears when checked

### Step 7: Your Story
- [ ] Can type description
- [ ] Bold/italic formatting works
- [ ] Emoji buttons insert emojis
- [ ] Character counter updates
- [ ] Preview shows listing correctly
- [ ] Final review summary displays

### Progress & Navigation
- [ ] Progress bar updates on each step
- [ ] Can click "Back" to go to previous step
- [ ] Can't proceed without completing required fields
- [ ] Validation errors show in red
- [ ] Completed steps show checkmarks (desktop)

### Draft Management
- [ ] "Save Draft" button works
- [ ] Toast notification shows when saved
- [ ] Auto-save triggers after 30 seconds
- [ ] Browser warns before leaving with unsaved changes

### Success State
- [ ] Confetti animation plays
- [ ] Success message displays
- [ ] Listing ID shows
- [ ] "View Your Listing" button works
- [ ] "List Another Book" resets wizard
- [ ] "Go to Dashboard" navigates correctly
- [ ] "Copy Link" copies to clipboard

## Mobile Testing

Test on mobile device or using Chrome DevTools device emulation:

1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Navigate to /sell
5. Test the following mobile-specific features:
   - Progress bar shows steps compactly
   - Photo upload opens camera
   - Touch interactions work
   - Layout is responsive
   - Buttons are tap-friendly

## Performance Testing

### Image Upload Performance
1. Upload a 2MB image
2. Check if it compresses properly
3. Verify preview loads quickly

### Search Performance
1. Type in search box
2. Verify debounce works (waits 500ms)
3. Check that results load within 1-2 seconds

### Auto-Save Performance
1. Make changes to form
2. Wait 30 seconds
3. Check network tab for POST /api/books/drafts
4. Verify no UI lag during save

## API Testing

Use Postman or curl to test API endpoints:

### Create Book Listing
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "title": "Fourth Wing",
    "author": "Rebecca Yarros",
    "condition": "like-new",
    "conditionNotes": "Perfect condition, read once",
    "priceCents": 3500,
    "description": "Amazing dragon book!",
    "tropes": ["enemies-to-lovers", "dragons"],
    "spiceLevel": 3,
    "status": "active"
  }'
```

### Save Draft
```bash
curl -X POST http://localhost:5000/api/books/drafts \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "title": "Draft Book",
    "author": "Test Author"
  }'
```

### Get Drafts
```bash
curl http://localhost:5000/api/books/drafts \
  -H "Cookie: your-auth-cookie"
```

## Debugging Tips

### Enable Verbose Logging
In `book-listing-wizard.tsx`, add console logs:
```typescript
const handleStepDataChange = (stepKey: keyof BookWizardData, data: any) => {
  console.log('Step data changed:', stepKey, data); // ADD THIS
  setWizardData((prev) => ({
    ...prev,
    [stepKey]: data,
  }));
};
```

### Check React Dev Tools
1. Install React Developer Tools browser extension
2. Open DevTools → Components tab
3. Find `BookListingWizard` component
4. Inspect state: `wizardData`, `currentStep`, `errors`

### Check Network Requests
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for requests to `/api/books` or `/api/books/drafts`
4. Check request payload and response

### Check Browser Console
1. Open DevTools → Console tab
2. Look for any error messages
3. Check for validation errors
4. Look for auto-save notifications

## Next Steps

After testing the wizard:
1. ✅ Verify all features work
2. 🔄 Integrate Cloudinary for real image uploads
3. 📊 Add analytics tracking
4. 🎨 Customize branding/colors if needed
5. 🚀 Deploy to production

## Support

If you encounter issues:
1. Check the console for errors
2. Review the implementation guide: `BOOK_LISTING_WIZARD_IMPLEMENTATION.md`
3. Check API logs in `apps/api`
4. Verify database has correct schema

## Success Criteria

The wizard is working correctly when:
- ✅ All 7 steps complete without errors
- ✅ Validation prevents invalid submissions
- ✅ Auto-save works every 30 seconds
- ✅ Photos upload successfully
- ✅ Confetti shows on success
- ✅ Draft can be saved and loaded
- ✅ Mobile interface is usable
- ✅ No console errors during normal use

---

**Happy Listing! 📚💖**
