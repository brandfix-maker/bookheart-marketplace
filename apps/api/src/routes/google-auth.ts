import { Router } from 'express';
import { asyncHandler } from '../middleware/error';
import { AuthService } from '../services/auth.service';
import { ApiResponse, AuthResponse } from '@bookheart/shared';
import { z } from 'zod';

const router = Router();

const googleSignInSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  image: z.string().optional(),
  googleId: z.string(),
});

// Google OAuth sign-in/signup endpoint
router.post('/google-signin', asyncHandler(async (req, res) => {
  const validation = googleSignInSchema.safeParse(req.body);
  
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request data',
    });
    return;
  }

  const { email, googleId } = validation.data;

  try {
    // Check if user exists by email
    let user = await AuthService.findUserByEmail(email) as any;

    if (!user) {
      // Create new user with Google OAuth
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      
      user = await AuthService.createUser({
        email,
        username,
        password: Math.random().toString(36) + googleId, // Random password (won't be used)
        registrationSurvey: {
          whatBringsYouHere: 'Google OAuth',
        },
      });

      // Update user with Google info
      // TODO: Store Google ID and avatar in database
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
      sameSite: 'lax', // Changed from 'strict' for OAuth
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' for OAuth
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          location: user.location,
          bio: user.bio,
          hasMadePurchase: user.hasMadePurchase,
          hasListedItem: user.hasListedItem,
          sellerOnboardingCompleted: user.sellerOnboardingCompleted,
          sellerVerified: user.sellerVerified,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        accessToken,
        refreshToken,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sign in with Google',
    });
  }
}));

export default router;
