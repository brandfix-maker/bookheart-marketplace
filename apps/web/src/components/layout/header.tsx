'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Search, Menu, ChevronDown } from 'lucide-react';
import { UserMenu, UserMenuCompact } from './user-menu';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-800/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-brand-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-purple-600 to-brand-pink-600 bg-clip-text text-transparent">
              BookHeart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/books" 
              className="text-gray-200 hover:text-purple-400 transition-colors font-medium"
            >
              Browse Books
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-200 hover:text-purple-400 transition-colors font-medium"
            >
              Categories
            </Link>
            {user && (user.hasListedItem || user.sellerVerified) && (
              <Link 
                href="/dashboard" 
                className="text-gray-200 hover:text-purple-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-200 hover:text-purple-400 transition-colors font-medium focus:outline-none">
                About
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem asChild>
                  <Link href="/about/founder" className="w-full">
                    Message from Our Founder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/mission" className="w-full text-gray-500">
                    Our Mission
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/how-it-works" className="w-full text-gray-500">
                    How It Works
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/trust-safety" className="w-full text-gray-500">
                    Trust & Safety
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search books, authors, series..."
                className="pl-10 pr-4 py-2 w-full border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Sell Your Books Button - Desktop */}
            <Link href="/sell">
              <Button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 hover:from-brand-pink-700 hover:to-brand-purple-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 min-w-[160px] group">
                <Heart className="h-4 w-4 group-hover:animate-pulse" />
                Sell Your Books
              </Button>
            </Link>
            
            {/* Sell Your Books Button - Mobile */}
            <Link href="/sell" className="md:hidden">
              <Button size="icon" className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 hover:from-brand-pink-700 hover:to-brand-purple-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 w-10 h-10 group">
                <Heart className="h-4 w-4 group-hover:animate-pulse" />
              </Button>
            </Link>

            {/* Mobile Search Button */}
            <Button variant="ghost" size="sm" className="lg:hidden text-gray-200 hover:text-white hover:bg-gray-700">
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden text-gray-200 hover:text-white hover:bg-gray-700">
              <Menu className="h-4 w-4" />
            </Button>

            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <UserMenu />
            </div>

            {/* Mobile User Menu */}
            <div className="md:hidden">
              <UserMenuCompact />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search books, authors, series..."
              className="pl-10 pr-4 py-2 w-full border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-400 focus:border-purple-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
