# 🎯 Google OAuth - Next Steps

## ✅ What's Already Done (I did this for you!)

1. ✅ **NextAuth.js installed**
2. ✅ **Auth configuration created** (`apps/web/src/lib/auth-config.ts`)
3. ✅ **API route created** (`apps/web/src/app/api/auth/[...nextauth]/route.ts`)
4. ✅ **Google Sign-In button component created**
5. ✅ **Backend Google auth endpoint created** (`apps/api/src/routes/google-auth.ts`)
6. ✅ **Backend configured** to handle Google OAuth

## 📋 What YOU Need to Do

### Step 1: Get Google Credentials (10 min)
Follow the guide in: **`GOOGLE_OAUTH_SETUP_GUIDE.md`**

Quick version:
1. Go to: https://console.cloud.google.com
2. Create project: "BookHeart"
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy your Client ID and Client Secret

### Step 2: Add to .env.local (1 min)
Add these lines to your `.env.local` file in the ROOT directory:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=super-secret-key-change-this-in-production-xyz123

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-client-secret-here
```

Replace:
- `your-actual-client-id-here` → Your Google Client ID
- `your-actual-client-secret-here` → Your Google Client Secret

### Step 3: Restart Servers (1 min)
After adding credentials:

**Terminal 1 (API Server):**
```powershell
# Press Ctrl+C, then:
cd "C:\Users\brand\Projects\BookHeart\BookHeart Marketplace\apps\api"
npm run build
npm run dev
```

**Terminal 2 (Web Server):**
```powershell
# Press Ctrl+C, then:
cd "C:\Users\brand\Projects\BookHeart\BookHeart Marketplace\apps\web"
npm run dev
```

### Step 4: Add Google Button to Login Page (2 min)
**I'll do this for you** once you have the credentials!

---

## 🎉 What You'll Get

After setup, your login page will have:

```
┌─────────────────────────────────────┐
│                                     │
│    📧 Sign in with Email            │
│    [email field]                    │
│    [password field]                 │
│    [Sign In]                        │
│                                     │
│    ─────── OR ───────               │
│                                     │
│    🔵 Sign in with Google           │
│    (One-click authentication!)      │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚀 Ready to Start?

1. **Open** `GOOGLE_OAUTH_SETUP_GUIDE.md`
2. **Follow** the steps to get credentials
3. **Tell me** when you have them
4. **I'll help** you add them and test!

---

## ⏱️ Time to Complete

- Get Google credentials: **10 minutes**
- Add to .env: **1 minute**
- Restart servers: **1 minute**
- Update UI (I'll do it): **2 minutes**
- **Total: ~15 minutes**

---

## 💡 Tips

**Can't find .env.local?**
It's in the root directory: `C:\Users\brand\Projects\BookHeart\BookHeart Marketplace\.env.local`

**Need help with Google Console?**
Just tell me where you're stuck and I'll guide you!

**Want to test without Google first?**
We can test with email/password if you want to see the new setup working first.

---

**Status:** ⏳ Waiting for Google credentials  
**Next:** Follow GOOGLE_OAUTH_SETUP_GUIDE.md

**Let me know when you have your Client ID and Client Secret!** 🎯
