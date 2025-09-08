import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '@bookheart/shared';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: User['role'];
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer <token>

    // Also check for token in cookies
    const cookieToken = req.cookies?.accessToken;
    
    const finalToken = token || cookieToken;

    if (!finalToken) {
      res.status(401).json({
        success: false,
        error: 'No authentication token provided',
      });
      return;
    }

    // Verify token
    const payload = AuthService.verifyToken(finalToken, process.env.JWT_SECRET || 'your-secret-key');
    req.user = payload;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

// Middleware to require specific roles
export const requireRole = (...roles: User['role'][]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Allow 'both' role to access buyer and seller routes
    const userRole = req.user.role;
    const hasPermission = roles.includes(userRole) || 
      (userRole === 'both' && (roles.includes('buyer') || roles.includes('seller')));

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const cookieToken = req.cookies?.accessToken;
    const finalToken = token || cookieToken;

    if (finalToken) {
      const payload = AuthService.verifyToken(finalToken, process.env.JWT_SECRET || 'your-secret-key');
      req.user = payload;
    }
  } catch (error) {
    // Ignore errors - optional auth
  }
  
  next();
};
