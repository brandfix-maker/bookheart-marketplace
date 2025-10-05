'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  Heart, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Plus,
  User,
  Settings
} from 'lucide-react';

interface SmartNavigationProps {
  className?: string;
}

export function SmartNavigation({ className = '' }: SmartNavigationProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const navigationItems = [
    {
      label: 'Browse',
      href: '/books',
      icon: Search,
      alwaysVisible: true,
    },
    {
      label: 'Home',
      href: '/',
      icon: Home,
      alwaysVisible: true,
    },
  ];

  // Progressive disclosure based on user activity
  const conditionalItems = [];

  // Show wishlist if user has made any purchases or has wishlist items
  if (user.hasMadePurchase) {
    conditionalItems.push({
      label: 'My Purchases',
      href: '/purchases',
      icon: ShoppingCart,
    });
  }

  // Show wishlist (always available for buyers)
  conditionalItems.push({
    label: 'Wishlist',
    href: '/wishlist',
    icon: Heart,
  });

  // Show seller features if user has listed items or completed onboarding
  if (user.hasListedItem || user.sellerOnboardingCompleted) {
    conditionalItems.push(
      {
        label: 'My Listings',
        href: '/seller/listings',
        icon: Package,
      },
      {
        label: 'Seller Dashboard',
        href: '/seller/dashboard',
        icon: BarChart3,
      }
    );
  }

  // Show "Start Selling" CTA if user hasn't completed seller onboarding
  const showStartSelling = !user.sellerOnboardingCompleted && !user.hasListedItem;

  return (
    <nav className={`flex items-center space-x-1 ${className}`}>
      {/* Always visible items */}
      {navigationItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        </Link>
      ))}

      {/* Conditional items */}
      {conditionalItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        </Link>
      ))}

      {/* Start Selling CTA */}
      {showStartSelling && (
        <Button
          variant="default"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => {
            // This will trigger seller onboarding
            const event = new CustomEvent('startSellerOnboarding');
            window.dispatchEvent(event);
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Start Selling</span>
        </Button>
      )}

      {/* User menu */}
      <div className="ml-2">
        <Link href="/profile">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user.displayName || user.username}</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}

// Hook for triggering seller onboarding
export function useSellerOnboarding() {
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);

  React.useEffect(() => {
    const handleStartOnboarding = () => {
      setIsOnboardingOpen(true);
    };

    window.addEventListener('startSellerOnboarding', handleStartOnboarding);
    return () => {
      window.removeEventListener('startSellerOnboarding', handleStartOnboarding);
    };
  }, []);

  const openOnboarding = () => setIsOnboardingOpen(true);
  const closeOnboarding = () => setIsOnboardingOpen(false);
  const completeOnboarding = () => {
    setIsOnboardingOpen(false);
    // Optionally redirect to seller dashboard or listings page
  };

  return {
    isOnboardingOpen,
    openOnboarding,
    closeOnboarding,
    completeOnboarding,
  };
}
