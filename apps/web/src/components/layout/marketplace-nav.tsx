'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import {
  Heart,
  ShoppingCart,
  Menu,
  X,
  Search,
  ChevronDown,
  User,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  BookOpen,
  Store,
  LayoutList,
  Calendar,
  MessageCircle,
  Plus,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MARKETPLACE_CATEGORIES = [
  { label: 'Special Editions', href: '/marketplace/categories/special-editions' },
  { label: 'Signed Copies', href: '/marketplace/categories/signed-copies' },
  { label: 'First Editions', href: '/marketplace/categories/first-editions' },
  { label: 'Subscription Boxes', href: '/marketplace/categories/subscription-boxes' },
  { label: 'Complete Series', href: '/marketplace/categories/complete-series' },
  { label: 'Under $20', href: '/marketplace/categories/under-20' },
];

interface NavDropdownProps {
  label: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function NavDropdown({ label, children, isOpen, onToggle }: NavDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-base font-semibold text-gray-200 hover:text-purple-400 transition-all duration-300"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

interface BadgeCountProps {
  count: number;
}

function BadgeCount({ count }: BadgeCountProps) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function MarketplaceNav() {
  const { user, isLoading, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Placeholder for unread messages - would come from WebSocket/API in production
  const unreadMessages = 0;

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const getUserInitials = () => {
    if (!user) return '';
    const name = user.displayName || user.username;
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    return user?.displayName || user?.username || '';
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <img src="/Logo/Logo_Horizontal_Pink.png" alt="BookHeart" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Marketplace Dropdown */}
              <NavDropdown
                label="Marketplace"
                isOpen={marketplaceOpen}
                onToggle={() => setMarketplaceOpen(!marketplaceOpen)}
              >
                <Link
                  href="/marketplace"
                  onClick={() => setMarketplaceOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  <LayoutList className="h-4 w-4" />
                  Browse All
                </Link>
                <Link
                  href="/marketplace/search"
                  onClick={() => setMarketplaceOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Link>
                <div className="border-t border-gray-700 my-1" />
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Categories
                </div>
                {MARKETPLACE_CATEGORIES.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    onClick={() => setMarketplaceOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    {category.label}
                  </Link>
                ))}
              </NavDropdown>

              {/* Events Bulletin */}
              <Link
                href="/events"
                className={`text-base font-semibold transition-all duration-300 ${
                  isActivePath('/events')
                    ? 'text-purple-400 border-b-[3px] border-purple-400 pb-[2px]'
                    : 'text-gray-200 hover:text-purple-400'
                }`}
              >
                Events Bulletin
              </Link>

              {/* Forums */}
              <Link
                href="/forums"
                className={`text-base font-semibold transition-all duration-300 ${
                  isActivePath('/forums')
                    ? 'text-purple-400 border-b-[3px] border-purple-400 pb-[2px]'
                    : 'text-gray-200 hover:text-purple-400'
                }`}
              >
                Forums
              </Link>

              {/* My Listings (visible after first listing) */}
              {user && user.hasListedItem && (
                <Link
                  href="/dashboard"
                  className={`text-base font-semibold transition-all duration-300 ${
                    isActivePath('/dashboard')
                      ? 'text-purple-400 border-b-[3px] border-purple-400 pb-[2px]'
                      : 'text-gray-200 hover:text-purple-400'
                  }`}
                >
                  My Listings
                </Link>
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {/* Sell Your Books Button */}
              <Link href="/sell">
                <Button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] hover:from-[#D81B60] hover:to-[#8E24AA] text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 min-w-[160px] group">
                  <Heart className="h-4 w-4 group-hover:animate-pulse" />
                  Sell Your Books
                </Button>
              </Link>
              
              {/* Mobile Sell Button */}
              <Link href="/sell" className="md:hidden">
                <Button size="icon" className="bg-gradient-to-r from-[#E91E63] to-[#9C27B0] hover:from-[#D81B60] hover:to-[#8E24AA] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 w-10 h-10 group">
                  <Heart className="h-4 w-4 group-hover:animate-pulse" />
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 hover:bg-pink-50 rounded-full transition-all duration-300">
                <ShoppingCart className="h-6 w-6 text-gray-200 hover:text-[#E91E63]" />
                <BadgeCount count={cartCount} />
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 hover:bg-pink-50 rounded-full transition-all duration-300">
                <Heart className="h-6 w-6 text-gray-200 hover:text-[#E91E63]" />
                <BadgeCount count={wishlistCount} />
              </Link>

              {/* User Menu / Auth Buttons */}
              {!isLoading && (
                <>
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded-full transition-all duration-300"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={getDisplayName()} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                      </button>
                      {profileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-3 border-b border-gray-700">
                            <p className="font-semibold text-white">{getDisplayName()}</p>
                            <p className="text-sm text-gray-300">{user.email}</p>
                          </div>
                          <div className="py-2">
                            <Link
                              href={`/profile/${user.username}`}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                            >
                              <User className="h-4 w-4" />
                              My Profile
                            </Link>
                            <Link
                              href="/purchases"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                            >
                              <ShoppingBag className="h-4 w-4" />
                              My Purchases
                            </Link>
                            {user.hasListedItem && (
                              <Link
                                href="/sales"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                              >
                                <Store className="h-4 w-4" />
                                My Sales
                              </Link>
                            )}
                            <Link
                              href="/wishlist"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                              Wishlists
                            </Link>
                            <Link
                              href="/messages"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Messages</span>
                              {unreadMessages > 0 && (
                                <span className="ml-auto bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white text-xs font-bold rounded-full px-2 py-0.5">
                                  {unreadMessages}
                                </span>
                              )}
                            </Link>
                            <Link
                              href="/profile/settings"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                            >
                              <Settings className="h-4 w-4" />
                              Settings
                            </Link>
                          </div>
                          <div className="border-t border-gray-700 my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="hidden lg:flex items-center gap-3">
                      <Link href="/login">
                        <Button variant="ghost" className="font-semibold text-gray-200 hover:text-[#E91E63]">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="bg-gradient-to-r from-[#E91E63] to-[#9C27B0] hover:from-[#D81B60] hover:to-[#8E24AA] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                          Join
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-pink-50 rounded-full transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-200" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-200" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-[72px] right-0 bottom-0 w-80 bg-gray-800 shadow-xl z-50 lg:hidden animate-in slide-in-from-right duration-300">
            <div className="h-full overflow-y-auto p-6">
              {/* User Info or Auth Buttons */}
              {user ? (
                <div className="mb-6 pb-6 border-b border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={getDisplayName()} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{getDisplayName()}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-gray-700 space-y-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-[#E91E63] to-[#9C27B0] hover:from-[#D81B60] hover:to-[#8E24AA] text-white font-semibold">
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                {/* Sell Your Books - Mobile */}
                <Link
                  href="/sell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                >
                  <Heart className="h-5 w-5 group-hover:animate-pulse" />
                  <span className="font-semibold">Sell Your Books</span>
                </Link>
                
                <Link
                  href="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LayoutList className="h-5 w-5" />
                  <span className="font-semibold">Browse Marketplace</span>
                </Link>
                <Link
                  href="/marketplace/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Search className="h-5 w-5" />
                  <span className="font-semibold">Search</span>
                </Link>
                <Link
                  href="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Events Bulletin</span>
                </Link>
                <Link
                  href="/forums"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">Forums</span>
                </Link>

                {user && (
                  <>
                    <div className="border-t border-gray-200 my-4" />
                    <Link
                      href={`/profile/${user.username}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-semibold">My Profile</span>
                    </Link>
                    <Link
                      href="/purchases"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span className="font-semibold">My Purchases</span>
                    </Link>
                    {user.hasListedItem && (
                      <>
                        <Link
                          href="/sales"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Store className="h-5 w-5" />
                          <span className="font-semibold">My Sales</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <BookOpen className="h-5 w-5" />
                          <span className="font-semibold">My Listings</span>
                        </Link>
                      </>
                    )}
                    <Link
                      href="/messages"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-semibold">Messages</span>
                      {unreadMessages > 0 && (
                        <span className="ml-auto bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {unreadMessages}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/profile/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-semibold">Settings</span>
                    </Link>
                    <div className="border-t border-gray-200 my-4" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </>
                )}
              </nav>

              {/* Categories */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  {MARKETPLACE_CATEGORIES.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden h-16 bg-gray-800 border-t border-gray-700 shadow-lg">
        <div className="h-full flex items-center justify-around px-2">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 ${
              pathname === '/' ? 'text-[#E91E63]' : 'text-gray-300'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            href="/marketplace/search"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 ${
              isActivePath('/marketplace/search') ? 'text-[#E91E63]' : 'text-gray-300'
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs font-medium">Search</span>
          </Link>
          <Link
            href="/sell"
            className="flex flex-col items-center justify-center -mt-8"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-300 mt-1">Sell</span>
          </Link>
          <Link
            href="/messages"
            className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 ${
              isActivePath('/messages') ? 'text-[#E91E63]' : 'text-gray-300'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs font-medium">Messages</span>
            {unreadMessages > 0 && (
              <span className="absolute top-0 right-1 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>
          <Link
            href={user ? `/profile/${user.username}` : '/login'}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 ${
              isActivePath('/profile') ? 'text-[#E91E63]' : 'text-gray-300'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>

      {/* Spacer for fixed navigation - desktop only, mobile has bottom nav */}
      <div className="h-[72px]" />
      {/* Mobile bottom nav spacer */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
