# ✅ NextAuth v5 Fixed!

## 🐛 What Was Wrong:

You had **NextAuth v5 (beta)** installed, but the code was written for NextAuth v4. The API changed completely between versions!

### The Error:
```
⨯ TypeError: r is not a function
```

This happened because NextAuth v5 has a completely different export format.

---

## ✅ What I Fixed:

### 1. **Updated `apps/web/src/lib/auth-config.ts`**

**Before (NextAuth v4 style):**
```typescript
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  // config...
};
```

**After (NextAuth v5 style):**
```typescript
import NextAuth from 'next-auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  // config...
});
```

### 2. **Updated `apps/web/src/app/api/auth/[...nextauth]/route.ts`**

**Before:**
```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**After:**
```typescript
import { handlers } from '@/lib/auth-config';

export const { GET, POST } = handlers;
```

### 3. **Fixed AuthContext**
- Made sure `refreshToken` is properly included in the context value

---

## 🎯 Now Try This:

1. **Go to:** http://localhost:3000/login
2. **Hard refresh:** Press `Ctrl + Shift + R` (clears cached errors)
3. **Try both buttons:**
   - Regular "Sign In" button (purple) should work
   - "Sign in with Google" button should open Google popup

---

## 🔍 What Should Work Now:

### ✅ Regular Email/Password Login:
1. Fill in email/password
2. Click "Sign In"
3. Should redirect to home page
4. See your username in header

### ✅ Google Sign-In:
1. Click "Sign in with Google"
2. Google popup appears
3. Choose your Google account
4. Approve BookHeart access
5. Redirected back to BookHeart
6. Automatically logged in!

---

## 🐛 If You Still Have Issues:

### Check Browser Console (F12):
- Look for any error messages
- Should see "Google sign-in clicked" when clicking Google button

### Clear Browser Cache:
1. Press `Ctrl + Shift + Delete`
2. Clear "Cached images and files"
3. Reload the page

### Still not working?
- Make sure BOTH servers are running (check terminals)
- API: `http://localhost:5000`
- Web: `http://localhost:3000`
- Copy any error messages and I'll help debug!

---

## 📚 References:

- NextAuth v5 (Auth.js) Migration Guide: https://authjs.dev/guides/upgrade-to-v5
- Key change: The entire API was redesigned for better type safety and simpler configuration

---

**Go ahead and try it now!** 🚀
