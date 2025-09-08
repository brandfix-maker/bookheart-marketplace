import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db';
import { users } from '@bookheart/database';
import { eq } from '@bookheart/database';
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
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
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
   * Create a new user with hashed password
   */
  static async createUser(data: RegisterRequest): Promise<User> {
    const passwordHash = await this.hashPassword(data.password);
    
    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        username: data.username,
        passwordHash,
        role: data.role,
        displayName: data.username, // Default display name to username
      })
      .returning();

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      displayName: newUser.displayName ?? undefined,
      avatarUrl: newUser.avatarUrl ?? undefined,
      sellerVerified: newUser.sellerVerified ?? undefined,
      location: newUser.location ?? undefined,
      bio: newUser.bio ?? undefined,
      emailVerified: newUser.emailVerified ?? undefined,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
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

    return user;
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

    return user;
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
    const user = await this.findUserById(userId);
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
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return !!user;
  }

  /**
   * Check if username already exists
   */
  static async usernameExists(username: string): Promise<boolean> {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return !!user;
  }

  /**
   * Authenticate user with email and password
   */
  static async authenticateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    
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
      displayName: user.displayName ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      sellerVerified: user.sellerVerified ?? undefined,
      location: user.location ?? undefined,
      bio: user.bio ?? undefined,
      emailVerified: user.emailVerified ?? undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Refresh user tokens
   */
  static async refreshUserTokens(userId: string) {
    const user = await this.findUserById(userId);
    
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
        displayName: user.displayName ?? undefined,
        avatarUrl: user.avatarUrl ?? undefined,
        sellerVerified: user.sellerVerified ?? undefined,
        location: user.location ?? undefined,
        bio: user.bio ?? undefined,
        emailVerified: user.emailVerified ?? undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
