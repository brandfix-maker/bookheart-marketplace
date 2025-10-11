'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Grid, Package, Tag, MessageSquare } from 'lucide-react';

const tabs = [
  {
    name: 'Listings',
    href: '/dashboard/listings',
    icon: Grid,
  },
  {
    name: 'Sold',
    href: '/dashboard/sold',
    icon: Package,
  },
  {
    name: 'Offers',
    href: '/dashboard/offers',
    icon: Tag,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex border-b border-gray-700">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-1 pb-4 border-b-2 font-medium transition-colors ${
                  isActive
                    ? 'border-brand-purple-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation (Bottom Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
        <nav className="flex justify-around">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center gap-1 py-3 px-4 flex-1 ${
                  isActive ? 'text-brand-purple-400' : 'text-gray-400'
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

