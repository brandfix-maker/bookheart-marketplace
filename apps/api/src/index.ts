import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from multiple locations
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config(); // Load from process.env

// Set development defaults for missing environment variables
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  // Development defaults
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'dev-jwt-secret-key-change-in-production';
    console.log('⚠️  Using development JWT_SECRET - change for production!');
  }
  
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = 'dev-jwt-refresh-secret-key-change-in-production';
    console.log('⚠️  Using development JWT_REFRESH_SECRET - change for production!');
  }
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is required even in development!');
    console.error('Please set DATABASE_URL in your .env.local file.');
    process.exit(1);
  }
} else {
  // Production validation
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env files and ensure all required variables are set.');
    process.exit(1);
  }
}

console.log('✅ Environment variables loaded successfully');
console.log('🔗 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('🔐 JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('🔐 JWT Refresh Secret:', process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not set');
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Import routes
import authRoutes from './routes/auth';
import googleAuthRoutes from './routes/google-auth';
import booksRoutes from './routes/books';
import usersRoutes from './routes/users';
import transactionsRoutes from './routes/transactions';
import reviewsRoutes from './routes/reviews';
import imagesRoutes from './routes/images';
import wishlistRoutes from './routes/wishlist';

// Import middleware
import { errorHandler } from './middleware/error';
import { notFound } from './middleware/notFound';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Validate PORT is a valid number
if (isNaN(PORT)) {
  console.error('❌ Invalid PORT value:', process.env.PORT);
  process.exit(1);
}

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:3006',
  'http://localhost:3007',
  'https://bookheart-marketplace-web.vercel.app',
  'https://www.thebookheart.com',
  'https://thebookheart.com',
  'https://bookheart.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Check database connection
    const { checkDatabaseConnection } = await import('./lib/db');
    const dbHealthy = await checkDatabaseConnection();
    
    res.json({
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy,
        stripe: false, // TODO: Implement Stripe health check
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: {
        database: false,
        stripe: false,
      },
      error: 'Health check failed'
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes); // Google OAuth routes
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server with comprehensive logging
console.log('🔧 Starting server setup...');
console.log('📦 Environment variables loaded');
console.log('🔌 Setting up middleware...');
console.log('🛣️ Registering routes...');
console.log(`🚀 Attempting to start server on port ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server successfully started!`);
  console.log(`🌐 API server running on http://localhost:${PORT}`);
  console.log(`📚 BookHeart API v1.0.0`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Test health endpoint: http://localhost:${PORT}/health`);
  console.log(`🔍 Test registration endpoint: http://localhost:${PORT}/api/auth/register`);
});

server.on('error', (err: any) => {
  console.error('❌ Server startup error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error('💡 Try a different port or kill the process using this port');
    console.error('💡 You can check what\'s using the port with: netstat -an | findstr :5000');
  } else if (err.code === 'EACCES') {
    console.error(`❌ Permission denied to bind to port ${PORT}`);
    console.error('💡 Try running with elevated permissions or use a different port');
  } else {
    console.error('❌ Unexpected server error:', err.message);
  }
  process.exit(1);
});
