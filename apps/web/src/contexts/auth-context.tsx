'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, LoginRequest, RegisterRequest } from '@bookheart/shared';
import { apiClient, setAuthContextRef } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data && response.data.success && response.data.data) {
        setUser(response.data.data as User);
        scheduleTokenRefresh();
      }
    } catch (error) {
      // User not authenticated - this is fine
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Schedule token refresh before expiration (14 minutes for 15-minute tokens)
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(async () => {
      const success = await refreshToken();
      if (!success) {
        // Refresh failed, redirect to login
        setUser(null);
        router.push('/login');
      }
    }, 14 * 60 * 1000); // 14 minutes
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      return false;
    }

    isRefreshingRef.current = true;

    try {
      const response = await apiClient.post('/auth/refresh');
      if (response.data && response.data.success && response.data.data?.user) {
        setUser(response.data.data.user as User);
        scheduleTokenRefresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [scheduleTokenRefresh]);

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setUser(null);
      
      // Clear refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      toast({
        title: 'Logged out',
        description: 'See you next time!',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if logout request fails
      setUser(null);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Register auth context with API client
  useEffect(() => {
    setAuthContextRef({ logout });
    return () => {
      setAuthContextRef(null);
    };
  }, [logout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data && response.data.success && response.data.data?.user) {
        setUser(response.data.data.user as User);
        scheduleTokenRefresh();
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${response.data.data.user.username}`,
        });
        router.push('/');
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.error || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data && response.data.success && response.data.data?.user) {
        setUser(response.data.data.user as User);
        scheduleTokenRefresh();
        toast({
          title: 'Account created!',
          description: 'Welcome to BookHeart',
        });
        router.push('/');
      }
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.error || 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshToken,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
