# BookHeart API Setup Guide

## Environment Configuration

The BookHeart API requires several environment variables to function properly. Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/bookheart_dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Stripe Configuration (for future use)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Database Setup

1. **Install PostgreSQL** or use a cloud service like Neon
2. **Create a database** named `bookheart_dev`
3. **Update DATABASE_URL** with your actual database credentials
4. **Run database migrations** (when available)

## Running the API

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   cd apps/api
   npm run dev
   ```

3. **Test the API:**
   ```bash
   # Test health check
   curl http://localhost:5000/health
   
   # Test registration
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "username": "testuser",
       "password": "TestPassword123",
       "role": "buyer"
     }'
   ```

## Troubleshooting

### Common Issues

1. **"DATABASE_URL environment variable is not set!"**
   - Create `.env.local` file with DATABASE_URL
   - Restart the server

2. **"Database connection failed"**
   - Check if PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

3. **"Email already registered"**
   - Use a different email address
   - Check if user already exists in database

4. **CORS errors from frontend**
   - Ensure FRONTEND_URL is set to http://localhost:3000
   - Check that credentials: true is set in frontend requests

### Debugging

The API now includes comprehensive logging. Check the console output for:
- 🔗 Database connection status
- 📝 Registration flow steps
- 🔍 Email/username existence checks
- 🔐 Password hashing and token generation

## Testing

Use the provided test script:
```bash
node test-registration.js
```

This will test:
- Health check endpoint
- User registration
- User login
- Token generation

