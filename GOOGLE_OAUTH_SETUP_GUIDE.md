# 🔐 Google OAuth Setup Guide - Step by Step

## Step 1: Get Google Credentials (10 minutes)

### A. Go to Google Cloud Console
Open in your browser: **https://console.cloud.google.com**

### B. Create a New Project
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it: **"BookHeart Marketplace"**
4. Click "Create"
5. Wait for it to create (30 seconds)

### C. Enable Google+ API
1. In the left sidebar, go to: **"APIs & Services" > "Library"**
2. Search for: **"Google+ API"**
3. Click on it
4. Click **"Enable"**

### D. Create OAuth 2.0 Credentials
1. Go to: **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. If asked, configure consent screen:
   - User Type: **External**
   - App name: **BookHeart**
   - User support email: your email
   - Developer contact: your email
   - Click **Save and Continue** through all steps
5. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: **BookHeart Web Client**
   - Authorized redirect URIs - ADD THESE:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3001/api/auth/callback/google` (backup)
6. Click **Create**
7. **SAVE** the Client ID and Client Secret that appear!

### E. Copy Your Credentials
You'll see something like:
```
Client ID: 1234567890-abc123def456.apps.googleusercontent.com
Client Secret: GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**Keep these safe! We'll use them in Step 2.**

---

## Step 2: Add to Environment Variables

I'll do this part for you automatically, just paste your credentials when ready!

---

## ⏱️ Time Estimate
- Following this guide: **5-10 minutes**
- If you get stuck: Let me know where!

## 🆘 Common Issues

**"OAuth consent screen required"**
- Just fill in the minimum fields (app name, email)
- Choose "External" user type
- No need for verification for development

**"Can't find Google+ API"**
- It might be called "Google Identity" now
- Or skip this - OAuth works without it in most cases

**"Redirect URI mismatch"**
- Make sure you added: `http://localhost:3000/api/auth/callback/google`
- Exact spelling, no trailing slash

---

## ✅ Once You Have Credentials

**Tell me:**
"I have my Client ID and Client Secret"

And paste them (they're safe to share with me in this environment).

I'll then:
1. ✅ Add them to `.env.local`
2. ✅ Install NextAuth.js
3. ✅ Configure everything
4. ✅ Add the Google sign-in button
5. ✅ Test it together

---

**Ready? Go to Google Cloud Console and follow the steps above!** 🚀

If you get stuck at any point, just tell me where and I'll help!
