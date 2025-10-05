# 🚀 Quick Fix: Start the API Server

## The Problem
Your API server isn't running, which is why you're getting `ERR_CONNECTION_REFUSED` errors when trying to register.

## The Solution

### Option 1: Start API Server (Recommended)
Open a **new terminal** (keep your web dev server running) and run:

```powershell
cd "C:\Users\brand\Projects\BookHeart\BookHeart Marketplace\apps\api"
npm run dev
```

You should see output like:
```
✅ Environment variables loaded successfully
🔗 Database URL: Set
🔐 JWT Secret: Set
✅ Server successfully started!
🌐 API server running on http://localhost:5000
```

### Option 2: Quick Test
If you don't see the server starting, try:

```powershell
cd "C:\Users\brand\Projects\BookHeart\BookHeart Marketplace"
node apps/api/dist/index.js
```

### Verify It's Working

In another terminal or browser, test:
```powershell
# PowerShell
Invoke-WebRequest -Uri http://localhost:5000/health

# Or open in browser:
http://localhost:5000/health
```

You should see a JSON response with `"status": "healthy"`

## After Starting the API Server

1. Go back to your registration page
2. Refresh the page (F5)
3. Try creating your account again
4. It should work now! ✨

## What You Need Running

For the full app to work, you need **TWO terminals**:

### Terminal 1: Web App
```powershell
cd "C:\Users\brand\Projects\BookHeart\BookHeart Marketplace\apps\web"
npm run dev
```
**Port:** 3000
**URL:** http://localhost:3000

### Terminal 2: API Server  
```powershell
cd "C:\Users\brand\Projects\BookHeart\BookHeart Marketplace\apps\api"
npm run dev
```
**Port:** 5000
**URL:** http://localhost:5000

## Troubleshooting

### "Port 5000 already in use"
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### "Cannot find module"
```powershell
cd apps/api
npm install
npm run build
npm run dev
```

### Database Connection Error
Your DATABASE_URL is already configured correctly in `.env.local`. If you get database errors, the Neon database might be paused (free tier auto-pauses). Just retry and it will wake up.

## Success!

Once both servers are running:
- ✅ Web App: http://localhost:3000
- ✅ API: http://localhost:5000
- ✅ Registration will work!

You should see the console logs showing your registration request being processed.
