# 🧪 Seller Dashboard - Complete Testing Checklist

## 🚀 Setup Verification (Do This First!)

Before testing the dashboard, verify:

- [ ] ✅ Database migration completed successfully (notifications table created)
- [ ] ✅ API server running on `http://localhost:5000`
  - Check terminal for: "API server running on http://localhost:5000"
  - Test health: Open `http://localhost:5000/health` in browser
- [ ] ✅ Web server running on `http://localhost:3000`
  - Check terminal for: "Local: http://localhost:3000"
- [ ] ✅ Can login successfully
  - Go to `http://localhost:3000/login`
  - Login with your account
- [ ] ✅ Have at least 1 book listing
  - If not, create one via `http://localhost:3000/sell`

---

## 📍 Access Points

**Dashboard URL:** `http://localhost:3000/dashboard`

The dashboard will automatically redirect to `/dashboard/listings` on first visit.

---

## 🎯 Tab 1: Active Listings

### Grid View
- [ ] Navigate to `/dashboard/listings`
- [ ] See your active listings displayed in grid format
- [ ] Cards show book cover image
- [ ] Cards show title, author, price, condition
- [ ] Status badge shows "Active" (green)
- [ ] **Hover over a card** → overlay stats appear (Views, Wishlists, Offers)
- [ ] Three-dot menu appears on hover (top-right of card)

### Table View
- [ ] Click table icon (list icon) to switch views
- [ ] See listings in table format
- [ ] Table shows: Thumbnail, Title, Price, Condition, Views, Listed Date, Status, Actions
- [ ] Click column headers to sort
  - [ ] Sort by Title (A-Z, Z-A)
  - [ ] Sort by Price (Low-High, High-Low)
  - [ ] Sort by Views (Low-High, High-Low)
  - [ ] Sort by Listed Date (Newest-Oldest, Oldest-Newest)
- [ ] Three-dot actions menu in last column

### Actions Menu (Both Views)
- [ ] Click three-dot menu on any listing
- [ ] See 4 options: Edit Listing, Pause Listing, Mark as Sold, Delete Listing

**Edit Listing:**
- [ ] Click "Edit Listing"
- [ ] Redirects to `/sell/edit/[id]`
- [ ] (If edit page doesn't exist yet, you'll see a 404 - that's expected)

**Pause Listing:**
- [ ] Click "Pause Listing"
- [ ] Modal appears with yellow pause icon
- [ ] Shows book details
- [ ] Click "Pause Listing" button
- [ ] Success toast appears: "Listing Paused"
- [ ] Listing status changes to "Pending" (yellow badge)
- [ ] Listing refreshes and shows new status

**Mark as Sold:**
- [ ] Click "Mark as Sold"
- [ ] Modal appears with green check icon
- [ ] Shows book details
- [ ] Click "Mark as Sold" button
- [ ] Success toast appears: "Marked as Sold"
- [ ] Listing disappears from active listings (moved to sold status)

**Delete Listing:**
- [ ] Click "Delete Listing"
- [ ] Modal appears with red trash icon
- [ ] Warning message about permanent deletion
- [ ] Click "Delete Listing" button
- [ ] Success toast appears: "Listing Deleted"
- [ ] Listing disappears from grid/table

### Create New Listing
- [ ] Click "Create Listing" button (top-right, purple gradient)
- [ ] Redirects to `/sell` page
- [ ] Book listing wizard opens

### Empty State
- [ ] If you have no active listings, see empty state
- [ ] Shows grid icon, message, and "Create Your First Listing" button
- [ ] Click button → redirects to `/sell`

### Loading State
- [ ] On page load, see skeleton loaders (6 gray boxes animating)
- [ ] After data loads, listings appear

---

## 💰 Tab 2: Sold (Transactions)

### Navigation
- [ ] Click "Sold" tab (or package icon on mobile)
- [ ] URL changes to `/dashboard/sold`

### Status Filters
- [ ] See 5 filter buttons at top: All, Pending Shipment, Shipped, Delivered, Completed
- [ ] Click each filter
- [ ] Active filter highlighted in purple
- [ ] Transaction list updates based on filter

### Transaction List
**Note:** You'll need actual transactions to test this. For testing:
- Have someone buy one of your books, OR
- Manually insert a test transaction in the database

- [ ] See transactions in expandable cards
- [ ] Each card shows: Buyer, Book, Sale Date, Amount, Status
- [ ] Status badge shows transaction status (green/yellow/blue)
- [ ] Click anywhere on card OR chevron icon to expand

### Expanded Transaction (Click to Expand)
- [ ] Card expands showing two columns

**Left Column - Buyer Info & Timeline:**
- [ ] See buyer username and location
- [ ] Timeline shows 4 steps: Paid → Shipped → Delivered → Completed
- [ ] Completed steps have green checkmark
- [ ] Incomplete steps show gray numbers
- [ ] Timestamps shown for completed steps

**Right Column - Transaction Details:**
- [ ] **Fee Breakdown:**
  - [ ] Item Price: Shows correct amount
  - [ ] Shipping: Shows shipping cost
  - [ ] Platform Fee (7%): Shows -7% deduction
  - [ ] Your Payout: Shows green amount (total minus fees)
  - [ ] Math checks out correctly

### Upload Tracking (If transaction is "Paid" status)
- [ ] See "Upload Tracking" section (right column)
- [ ] Carrier dropdown with options: USPS, FedEx, UPS, DHL, Other
- [ ] Tracking number input field
- [ ] "Mark as Shipped" button (purple, with package icon)

**Upload Tracking Flow:**
- [ ] Select a carrier from dropdown
- [ ] Enter a tracking number (any format, e.g., "1Z999AA10123456784")
- [ ] Click "Mark as Shipped"
- [ ] Success toast: "Tracking Updated - The buyer has been notified"
- [ ] Status changes to "Shipped"
- [ ] Upload form disappears
- [ ] Tracking info now displayed instead:
  - [ ] Shows "Tracking Information" heading
  - [ ] Shows carrier name
  - [ ] Shows tracking number (in monospace font)

### Empty State
- [ ] If you have no sales yet, see empty state
- [ ] Shows package icon and "Your first sale is just around the corner!"

### Loading State
- [ ] On page load, see 5 gray animated skeleton boxes
- [ ] After data loads, transactions appear

---

## 🏷️ Tab 3: Offers

### Navigation
- [ ] Click "Offers" tab (or tag icon on mobile)
- [ ] URL changes to `/dashboard/offers`

### Status Filters
- [ ] See 5 filter buttons: All, Pending, Accepted, Rejected, Expired
- [ ] Click each filter
- [ ] Active filter highlighted in purple
- [ ] Offers list updates

### Offer Cards
**Note:** You need someone to make an offer on your book to test this.

**Each offer card shows:**
- [ ] Book cover thumbnail
- [ ] Book title and author
- [ ] Status badge (Pending/Accepted/Rejected/Expired)
- [ ] Offer amount (large text)
- [ ] Percentage vs. asking price (red if lower, green if higher)
- [ ] Buyer's message (if provided)
- [ ] Time remaining (if pending and < 24 hours)
- [ ] Action buttons (if pending): Accept, Counter, Decline

### Accept Offer Flow
- [ ] Click green "Accept" button on a pending offer
- [ ] Modal opens with green check icon
- [ ] Shows offer details comparison (asking price vs offer amount)
- [ ] "What happens next?" section with 4 bullet points
- [ ] Click "Accept Offer" button
- [ ] Success toast: "Offer Accepted! The buyer has been notified..."
- [ ] Offer status changes to "Accepted"
- [ ] Action buttons disappear
- [ ] **Notification created for buyer** (they'll see it in their notifications)

### Counter Offer Flow
- [ ] Click "Counter" button on a pending offer
- [ ] Modal opens with purple arrow icon
- [ ] Shows original offer and asking price
- [ ] Counter offer input field (with $ prefix)

**Validation Testing:**
- [ ] Try entering amount LOWER than original offer → Error: "Counter offer must be higher..."
- [ ] Try entering amount HIGHER than asking price → Error: "Counter offer cannot exceed asking price..."
- [ ] Enter valid amount (between offer and asking) → No error
- [ ] Optional message field (max 500 chars)
- [ ] Character count updates as you type

**Submit Counter:**
- [ ] Enter valid counter amount (e.g., if offer is $35 and asking is $50, enter $42)
- [ ] Optionally add message
- [ ] Click "Send Counter Offer"
- [ ] Success toast: "Counter Offer Sent - The buyer has been notified"
- [ ] Offer status changes to "Countered"
- [ ] **Notification created for buyer**

### Decline Offer Flow
- [ ] Click red "Decline" button on a pending offer
- [ ] Modal opens with red X icon
- [ ] Shows offer details
- [ ] Optional reason dropdown
- [ ] Warning note about buyer being notified
- [ ] Click "Decline Offer" button
- [ ] Success toast: "Offer Declined - The buyer has been notified"
- [ ] Offer status changes to "Rejected"
- [ ] Action buttons disappear
- [ ] **Notification created for buyer**

### Empty State
- [ ] If you have no offers, see empty state
- [ ] Shows tag icon and "Offers will appear here when buyers are interested"

### Loading State
- [ ] On page load, see 4 gray animated skeleton boxes in grid
- [ ] After data loads, offer cards appear

---

## 💬 Tab 4: Messages

### Navigation
- [ ] Click "Messages" tab (or message icon on mobile)
- [ ] URL changes to `/dashboard/messages`

### Messages Link Page
- [ ] See centered card with large message icon (purple)
- [ ] Heading: "Messages"
- [ ] Description text
- [ ] "Go to Messages" button (purple gradient)
- [ ] Click button
- [ ] Redirects to `/messages` (existing messages page)

---

## 🔔 Notifications Bell

### Location
- [ ] Bell icon visible in dashboard header (top-right)
- [ ] Badge shows unread count if > 0
- [ ] Badge shows "9+" if count > 9

### Opening Notifications
- [ ] Click bell icon
- [ ] Dropdown opens (white popup, max height ~400px)
- [ ] Header shows "Notifications" and "Mark all read" link

### Notification List
**To test, you need notifications. Create them by:**
- Having someone make an offer (creates "New Offer Received" notification)
- Sending a message (creates "New Message" notification)
- Accepting/rejecting an offer (creates notification for buyer)

- [ ] See last 10 notifications (most recent first)
- [ ] Unread notifications have:
  - [ ] Light gray background
  - [ ] Purple dot indicator on left
- [ ] Read notifications have:
  - [ ] No background
  - [ ] No dot indicator
- [ ] Each notification shows:
  - [ ] Title (bold)
  - [ ] Message (2 lines max, truncated)
  - [ ] Time ago ("2m ago", "1h ago", "2d ago")

### Notification Actions
- [ ] Click on a notification
- [ ] Notification marked as read (dot disappears, background clears)
- [ ] Badge count decreases by 1
- [ ] Navigates to related page:
  - Offer notification → `/dashboard/offers`
  - Message notification → `/dashboard/messages`
  - Transaction notification → `/dashboard/sold`
- [ ] Dropdown closes

### Mark All Read
- [ ] Have multiple unread notifications
- [ ] Click "Mark all read" link (top-right of dropdown)
- [ ] All notifications marked as read
- [ ] Badge count goes to 0
- [ ] Purple dots disappear
- [ ] Backgrounds clear

### Polling (Real-time Updates)
- [ ] Leave dashboard open
- [ ] Have someone create an offer or send message
- [ ] **Within 30 seconds**, new notification appears
- [ ] Badge count updates automatically
- [ ] Bell icon animates briefly (optional visual feedback)

### Empty State
- [ ] Mark all notifications as read
- [ ] Delete all notifications (or use fresh account)
- [ ] Click bell icon
- [ ] See empty state: Bell icon (gray), "No notifications yet"

---

## 📊 Metrics Row (Dashboard Header)

### Location
- [ ] Visible at top of all dashboard pages
- [ ] Below "Seller Dashboard" heading
- [ ] Above tab navigation

### Four Metric Cards

**Card 1 - Active Listings:**
- [ ] Shows BookOpen icon (purple)
- [ ] Label: "Active Listings"
- [ ] Large number showing count of active books
- [ ] Updates when you pause/delete/add listings

**Card 2 - Views This Week:**
- [ ] Shows Eye icon (blue)
- [ ] Label: "Views This Week"
- [ ] Large number showing total views in last 7 days
- [ ] (Number should increase as people view your listings)

**Card 3 - Messages:**
- [ ] Shows MessageSquare icon (green)
- [ ] Label: "Messages"
- [ ] Large number showing unread message count
- [ ] Red badge badge if > 0
- [ ] Updates when you read/receive messages

**Card 4 - Sales This Month:**
- [ ] Shows DollarSign icon (yellow)
- [ ] Label: "Sales This Month"
- [ ] Large number showing completed sales in last 30 days
- [ ] Updates when transactions complete

### Responsive Behavior
- [ ] Desktop (>1024px): 4 cards in a row
- [ ] Tablet (768-1023px): 2 cards per row
- [ ] Mobile (<768px): 1 card per row (stacked)

### Loading State
- [ ] On initial load, see 4 skeleton boxes
- [ ] Boxes animate (pulse effect)
- [ ] After data loads, metrics appear

---

## 📱 Mobile Responsiveness

### Bottom Navigation (Mobile Only)
**Resize browser to < 1024px width or test on mobile device:**

- [ ] Bottom navigation bar appears (fixed at bottom)
- [ ] Shows 4 icons: Grid, Package, Tag, MessageSquare
- [ ] Each icon has label below
- [ ] Active tab highlighted in purple
- [ ] Inactive tabs in gray
- [ ] Click each icon → navigates to correct tab

### Mobile Layout Changes
- [ ] Metrics cards stack vertically (1 per row)
- [ ] Tab navigation hidden (replaced by bottom nav)
- [ ] Table views convert to card views
- [ ] Modals become full-screen
- [ ] Action buttons stack vertically
- [ ] Smaller padding and margins

---

## 🎨 Design System Verification

### Colors (Following DARK_THEME_STYLE_GUIDE.md)

**Backgrounds:**
- [ ] Page background: Dark gray (`bg-gray-800`)
- [ ] Cards: Glass morphism (`bg-gray-800/95 backdrop-blur-sm`)
- [ ] Borders: Gray-700 (`border-gray-700`)

**Text:**
- [ ] Headings: White (`text-white`)
- [ ] Body text: Gray-300 (`text-gray-300`)
- [ ] Helper text: Gray-400 (`text-gray-400`)

**Brand Colors:**
- [ ] Primary buttons: Purple-pink gradient (`from-brand-pink-500 to-brand-purple-500`)
- [ ] Active tabs: Brand purple (`brand-purple-500`)
- [ ] Hover states: Purple tints

**Status Colors:**
- [ ] Active: Green (`green-500`)
- [ ] Pending: Yellow (`yellow-500`)
- [ ] Error/Decline: Red (`red-500/600`)
- [ ] Sold: Blue (`blue-500`)

---

## 🐛 Error Handling & Edge Cases

### Network Errors
- [ ] Disconnect internet
- [ ] Try loading dashboard
- [ ] See error state: "Unable to load metrics" with retry button
- [ ] Click retry → attempts to reload
- [ ] Reconnect internet → retry succeeds

### Empty States (All Verified Above)
- [ ] Each tab has friendly empty state
- [ ] Empty states have icon, heading, description, CTA
- [ ] CTAs work correctly

### Loading States (All Verified Above)
- [ ] Skeleton loaders show while fetching
- [ ] Smooth transition from skeleton to content
- [ ] No layout shift or jumpy behavior

### Toast Notifications
**Success toasts (green/default):**
- [ ] Appear on successful actions
- [ ] Show in top-right corner
- [ ] Auto-dismiss after ~5 seconds
- [ ] Can be manually dismissed (X button)

**Error toasts (red):**
- [ ] Appear on failed actions
- [ ] Show error message
- [ ] Stay longer (~7 seconds)
- [ ] Can be manually dismissed

### Protected Routes
- [ ] Logout
- [ ] Try accessing `/dashboard` directly
- [ ] Redirected to `/login?redirect=/dashboard`
- [ ] Login
- [ ] Redirected back to `/dashboard`

---

## 🔄 Data Consistency

### Real-time Updates
- [ ] Accept an offer → listing status changes to pending
- [ ] Upload tracking → transaction status changes to shipped
- [ ] Delete listing → immediately removed from grid/table
- [ ] Pause listing → status badge updates instantly

### Metric Updates
- [ ] Delete a listing → Active Listings count decreases
- [ ] Mark as sold → Sales count may increase (depends on timing)
- [ ] Receive message → Messages count increases
- [ ] Read message → Messages count decreases

### Notification Updates
- [ ] Receive offer → notification badge increases
- [ ] Click notification → badge decreases
- [ ] Mark all read → badge goes to 0

---

## ⚡ Performance

### Page Load Speed
- [ ] Dashboard loads in < 2 seconds (on decent connection)
- [ ] Metrics load quickly (< 1 second)
- [ ] No unnecessary re-renders
- [ ] Smooth animations

### Polling Performance
- [ ] Notifications poll every 30 seconds
- [ ] No noticeable performance impact
- [ ] No console errors during polling

---

## 🎯 Cross-Browser Testing (Optional but Recommended)

### Browsers to Test
- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if on Mac)

### Things to Check
- [ ] Layout looks correct
- [ ] Modals work properly
- [ ] Dropdowns function
- [ ] Icons render correctly
- [ ] Gradients display properly

---

## ✅ Final Checklist Summary

### Critical Features (Must Work)
- [ ] Can login and access dashboard
- [ ] Can view active listings
- [ ] Can edit/pause/delete listings
- [ ] Can view transaction history
- [ ] Can upload tracking numbers
- [ ] Can accept/counter/decline offers
- [ ] Notifications appear and work
- [ ] All tabs load without errors

### Nice-to-Have Features (Should Work)
- [ ] Smooth animations
- [ ] Proper empty states
- [ ] Helpful loading states
- [ ] Good mobile experience
- [ ] Correct brand colors

### Known Limitations (Expected - Phase 2)
- ❌ No analytics tab (intentionally skipped)
- ❌ No payments/Stripe tab (intentionally skipped)
- ❌ No CSV export (Phase 2)
- ❌ Wishlist counts show "0" (need to implement wishlist query)
- ❌ Offer counts show "0" (need to implement offer query)

---

## 🎉 Testing Complete!

Once you've gone through this checklist, you'll have thoroughly tested the entire Seller Dashboard MVP.

### Report Issues
If you find any bugs:
1. Note the tab/page where it occurred
2. Describe what you did (steps to reproduce)
3. What you expected vs what happened
4. Check browser console for errors (F12 → Console tab)

### Next Steps After Testing
- Collect user feedback
- Prioritize Phase 2 features (Analytics, Payments)
- Add missing features (wishlist/offer counts)
- Optimize performance if needed
- Add email notifications

---

**Happy Testing! 🚀**

