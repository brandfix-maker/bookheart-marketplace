export interface User {
  id: string;
  email: string;
  username: string;
  role: 'buyer' | 'seller' | 'both' | 'admin';
  displayName?: string;
  avatarUrl?: string;
  sellerVerified?: boolean;
  location?: string;
  bio?: string;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  role: 'buyer' | 'seller' | 'both';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}
