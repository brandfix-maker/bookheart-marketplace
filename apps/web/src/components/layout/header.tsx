'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Search, Menu } from 'lucide-react';
import { UserMenu, UserMenuCompact } from './user-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BookHeart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/browse" 
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Browse Books
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search books, authors, series..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
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
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
