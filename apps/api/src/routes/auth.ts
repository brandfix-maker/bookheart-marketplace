import { Router } from 'express';
import { AuthResponse, ApiResponse } from '@bookheart/shared';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { 
  registerSchema, 
  loginSchema
} from '../utils/validation';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many attempts, please try again later',
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: 'Too many registration attempts, please try again later',
});

// Register new user
router.post('/register', 
  registerLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    console.log('📝 POST /api/auth/register: Registration attempt for', req.body.email);
    
    try {
      const { email, username, password, role } = req.body;
      console.log('📝 Registration data:', { email, username, role });

      // Check if email already exists
      console.log('📝 Checking if email exists:', email);
      const emailExists = await AuthService.emailExists(email);
      if (emailExists) {
        console.log('📝 Email already exists:', email);
        res.status(409).json({
          success: false,
          error: 'Email already registered',
          code: 'EMAIL_EXISTS',
        });
        return;
      }

      // Check if username already exists
      console.log('📝 Checking if username exists:', username);
      const usernameExists = await AuthService.usernameExists(username);
      if (usernameExists) {
        console.log('📝 Username already exists:', username);
        res.status(409).json({
          success: false,
          error: 'Username already taken',
          code: 'USERNAME_EXISTS',
        });
        return;
      }

      // Create user with hashed password
      console.log('📝 Creating new user...');
      const user = await AuthService.createUser({ email, username, password, role });

      // Generate tokens
      console.log('📝 Generating tokens...');
      const { accessToken, refreshToken } = AuthService.generateTokens(
        user.id,
        user.email,
        user.role
      );

      // Update refresh token in database
      console.log('📝 Updating refresh token in database...');
      await AuthService.updateRefreshToken(user.id, refreshToken);

      // Set cookies
      console.log('📝 Setting cookies...');
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: {
        user: {
          ...user,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
          accessToken,
          refreshToken,
        },
      };

      console.log('📝 Registration successful for user:', user.id);
      res.status(201).json(response);
    } catch (error: any) {
      console.error('📝 Registration error:', error);
      
      // Check if it's a database connection error
      if (error.message && error.message.includes('DATABASE_URL')) {
        res.status(503).json({
          success: false,
          error: 'Database connection not configured. Please check DATABASE_URL environment variable.',
          code: 'DATABASE_CONFIG_ERROR',
        });
        return;
      }
      
      // Check if it's a database connection error
      if (error.message && (error.message.includes('connection') || error.message.includes('ECONNREFUSED'))) {
        res.status(503).json({
          success: false,
          error: 'Database connection failed. Please check your database configuration.',
          code: 'DATABASE_CONNECTION_ERROR',
        });
        return;
      }
      
      // Generic server error
      res.status(500).json({
        success: false,
        error: 'Internal server error during registration',
        code: 'INTERNAL_ERROR',
      });
    }
  })
);

// Login
router.post('/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Authenticate user
    const user = await AuthService.authenticateUser(email, password);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = AuthService.generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Update refresh token in database
    await AuthService.updateRefreshToken(user.id, refreshToken);

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: {
          ...user,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken,
      },
    };

    res.json(response);
  })
);

// Refresh token
router.post('/refresh',
  asyncHandler(async (req, res) => {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: 'Refresh token required',
      });
      return;
    }

    try {
      // Verify refresh token
      const payload = AuthService.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);

      // Validate refresh token against database
      const isValid = await AuthService.validateRefreshToken(payload.userId, refreshToken);

      if (!isValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token',
        });
        return;
      }

      // Generate new token pair
      const { tokens, user } = await AuthService.refreshUserTokens(payload.userId);

      // Set cookies
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: {
        user: {
          ...user,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };

      res.json(response);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
      });
    }
  })
);

// Get current user
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await AuthService.findUserById(req.user!.userId) as any;

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        displayName: user.displayName || undefined,
        avatarUrl: user.avatarUrl || undefined,
        sellerVerified: user.sellerVerified || undefined,
        location: user.location || undefined,
        bio: user.bio || undefined,
        emailVerified: user.emailVerified || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };

    res.json(response);
  })
);

// Logout
router.post('/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    // Clear refresh token in database
    await AuthService.clearRefreshToken(req.user!.userId);

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  })
);

export default router;
