export interface User {
  id: string;
  email: string;
  username: string;
  role: 'buyer' | 'seller' | 'both' | 'admin'; // Deprecated but kept for backward compatibility
  
  // Activity tracking for progressive disclosure
  hasMadePurchase: boolean;
  hasListedItem: boolean;
  lastBuyerActivity?: string;
  lastSellerActivity?: string;
  
  // Seller onboarding
  sellerOnboardingCompleted: boolean;
  sellerVerified?: boolean;
  
  // Profile
  displayName?: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
  
  // Optional survey data
  registrationSurvey?: {
    whatBringsYouHere?: string;
    interests?: string[];
    heardAboutUs?: string;
  };
  
  // System
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
  // Optional survey data for analytics
  registrationSurvey?: {
    whatBringsYouHere?: string;
    interests?: string[];
    heardAboutUs?: string;
  };
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
