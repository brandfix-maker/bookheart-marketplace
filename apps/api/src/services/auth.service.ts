import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, users, eq } from '@bookheart/database';
import { User, RegisterRequest } from '@bookheart/shared';

interface TokenPayload {
  userId: string;
  email: string;
  role: User['role'];
  iat: number;
  exp: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export class AuthService {
  /**
   * Hash a password using bcrypt with 10 salt rounds
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate access and refresh token pair
   */
  static generateTokens(userId: string, email: string, role: User['role']): TokenPair {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId,
      email,
      role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string, secret: string): TokenPayload {
    return jwt.verify(token, secret) as TokenPayload;
  }

  /**
   * Create a new user with hashed password (Universal Account)
   */
  static async createUser(data: RegisterRequest): Promise<User> {
    console.log('🔐 AuthService.createUser: Starting universal user creation for', data.email);
    console.log('🔐 AuthService.createUser: Data received:', { email: data.email, username: data.username, registrationSurvey: data.registrationSurvey });
    
    try {
      console.log('🔐 AuthService.createUser: Hashing password...');
      const passwordHash = await this.hashPassword(data.password);
      console.log('🔐 AuthService.createUser: Password hashed successfully');
      
      console.log('🔐 AuthService.createUser: Preparing database insert...');
      const insertData = {
        email: data.email,
        username: data.username,
        passwordHash,
        // role omitted; DB default 'user' applies
        displayName: data.username, // Default display name to username
        // Universal account fields
        hasMadePurchase: false,
        hasListedItem: false,
        sellerOnboardingCompleted: false,
        registrationSurvey: data.registrationSurvey || null,
      };
      console.log('🔐 AuthService.createUser: Insert data prepared:', { ...insertData, passwordHash: '[HASHED]' });
      
      console.log('🔐 AuthService.createUser: Executing database insert...');
      const [newUser] = await db
        .insert(users)
        .values(insertData)
        .returning();

      console.log('🔐 AuthService.createUser: Database insert successful');
      console.log('🔐 AuthService.createUser: Raw user data:', newUser);

      const userResponse = {
        id: (newUser as any).id,
        email: (newUser as any).email,
        username: (newUser as any).username,
        role: (newUser as any).role,
        // Activity tracking
        hasMadePurchase: (newUser as any).hasMadePurchase || false,
        hasListedItem: (newUser as any).hasListedItem || false,
        lastBuyerActivity: (newUser as any).lastBuyerActivity?.toISOString() || undefined,
        lastSellerActivity: (newUser as any).lastSellerActivity?.toISOString() || undefined,
        // Seller onboarding
        sellerOnboardingCompleted: (newUser as any).sellerOnboardingCompleted || false,
        sellerVerified: (newUser as any).sellerVerified || undefined,
        // Profile
        displayName: (newUser as any).displayName || undefined,
        avatarUrl: (newUser as any).avatarUrl || undefined,
        location: (newUser as any).location || undefined,
        bio: (newUser as any).bio || undefined,
        // Survey data
        registrationSurvey: (newUser as any).registrationSurvey || undefined,
        // System
        emailVerified: (newUser as any).emailVerified || undefined,
        createdAt: (newUser as any).createdAt.toISOString(),
        updatedAt: (newUser as any).updatedAt.toISOString(),
      };

      console.log('🔐 AuthService.createUser: Universal user created successfully with ID:', userResponse.id);
      return userResponse;
    } catch (error: any) {
      console.error('🔐 AuthService.createUser: Detailed error creating user:');
      console.error('🔐 AuthService.createUser: Error type:', typeof error);
      console.error('🔐 AuthService.createUser: Error message:', error?.message || 'Unknown error');
      console.error('🔐 AuthService.createUser: Error code:', error?.code || 'Unknown code');
      console.error('🔐 AuthService.createUser: Error stack:', error?.stack || 'No stack trace');
      console.error('🔐 AuthService.createUser: Full error object:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  }

  /**
   * Find user by ID
   */
  static async findUserById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  }

  /**
   * Update refresh token in database
   */
  static async updateRefreshToken(userId: string, token: string): Promise<void> {
    await db
      .update(users)
      .set({ refreshToken: token })
      .where(eq(users.id, userId));
  }

  /**
   * Validate refresh token against database
   */
  static async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const user = await this.findUserById(userId) as any;
    return user?.refreshToken === token;
  }

  /**
   * Clear refresh token from database
   */
  static async clearRefreshToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.id, userId));
  }

  /**
   * Check if email already exists
   */
  static async emailExists(email: string): Promise<boolean> {
    try {
      console.log('🔍 AuthService.emailExists: Checking email:', email);
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const exists = !!user;
      console.log('🔍 AuthService.emailExists: Email exists:', exists);
      return exists;
    } catch (error) {
      console.error('🔍 AuthService.emailExists: Error checking email:', error);
      throw error;
    }
  }

  /**
   * Check if username already exists
   */
  static async usernameExists(username: string): Promise<boolean> {
    try {
      console.log('🔍 AuthService.usernameExists: Checking username:', username);
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      const exists = !!user;
      console.log('🔍 AuthService.usernameExists: Username exists:', exists);
      return exists;
    } catch (error) {
      console.error('🔍 AuthService.usernameExists: Error checking username:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   */
  static async authenticateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email) as any;
    
    if (!user) {
      return null;
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      // Activity tracking
      hasMadePurchase: user.hasMadePurchase || false,
      hasListedItem: user.hasListedItem || false,
      lastBuyerActivity: user.lastBuyerActivity?.toISOString() || undefined,
      lastSellerActivity: user.lastSellerActivity?.toISOString() || undefined,
      // Seller onboarding
      sellerOnboardingCompleted: user.sellerOnboardingCompleted || false,
      sellerVerified: user.sellerVerified || undefined,
      // Profile
      displayName: user.displayName || undefined,
      avatarUrl: user.avatarUrl || undefined,
      location: user.location || undefined,
      bio: user.bio || undefined,
      // Survey data
      registrationSurvey: user.registrationSurvey || undefined,
      // System
      emailVerified: user.emailVerified || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Refresh user tokens
   */
  static async refreshUserTokens(userId: string) {
    const user = await this.findUserById(userId) as any;
    
    if (!user) {
      throw new Error('User not found');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    
    // Update refresh token in database
    await this.updateRefreshToken(userId, tokens.refreshToken);

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        // Activity tracking
        hasMadePurchase: user.hasMadePurchase || false,
        hasListedItem: user.hasListedItem || false,
        lastBuyerActivity: user.lastBuyerActivity?.toISOString() || undefined,
        lastSellerActivity: user.lastSellerActivity?.toISOString() || undefined,
        // Seller onboarding
        sellerOnboardingCompleted: user.sellerOnboardingCompleted || false,
        sellerVerified: user.sellerVerified || undefined,
        // Profile
        displayName: user.displayName || undefined,
        avatarUrl: user.avatarUrl || undefined,
        location: user.location || undefined,
        bio: user.bio || undefined,
        // Survey data
        registrationSurvey: user.registrationSurvey || undefined,
        // System
        emailVerified: user.emailVerified || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
