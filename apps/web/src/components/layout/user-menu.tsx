'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  ShoppingBag, 
  Store, 
  ChevronDown,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            Join Now
          </Button>
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    return user.displayName || user.username;
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'buyer':
        return 'Reader';
      case 'seller':
        return 'Seller';
      case 'both':
        return 'Reader & Seller';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'buyer':
        return <BookOpen className="h-4 w-4" />;
      case 'seller':
        return <Store className="h-4 w-4" />;
      case 'both':
        return <Heart className="h-4 w-4" />;
      case 'admin':
        return <Settings className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={getDisplayName()}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getUserInitials(getDisplayName())
          )}
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
          <p className="text-xs text-gray-500 flex items-center">
            {getRoleIcon(user.role)}
            <span className="ml-1">{getRoleDisplayName(user.role)}</span>
          </p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={getDisplayName()}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  getUserInitials(getDisplayName())
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  {getRoleIcon(user.role)}
                  <span className="ml-1">{getRoleDisplayName(user.role)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile */}
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-gray-400" />
              View Profile
            </Link>

            {/* Settings */}
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3 text-gray-400" />
              Settings
            </Link>

            {/* Role-specific links */}
            {(user.role === 'buyer' || user.role === 'both') && (
              <>
                <Link
                  href="/purchases"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4 mr-3 text-gray-400" />
                  My Purchases
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-4 w-4 mr-3 text-gray-400" />
                  Wishlist
                </Link>
              </>
            )}

            {(user.role === 'seller' || user.role === 'both') && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Store className="h-4 w-4 mr-3 text-gray-400" />
                  Seller Dashboard
                </Link>
                <Link
                  href="/listings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                  My Listings
                </Link>
              </>
            )}

            {/* Admin links */}
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3 text-gray-400" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Compact version for mobile
export function UserMenuCompact() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="text-gray-700">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Join
          </Button>
        </Link>
      </div>
    );
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    return user.displayName || user.username;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:opacity-80 transition-opacity"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={getDisplayName()}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          getUserInitials(getDisplayName())
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium text-gray-900 text-sm">{getDisplayName()}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <div className="py-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            {(user.role === 'seller' || user.role === 'both') && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
          
          <div className="border-t border-gray-100 my-2"></div>
          
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
