'use client';

import { MetricsRow } from './metrics-row';
import { NotificationsBell } from './notifications-bell';
import { TabNavigation } from './tab-navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface DashboardWrapperProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export function DashboardWrapper({ children, title, action }: DashboardWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-800 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-serif font-bold text-white">
                Seller Dashboard
              </h1>
            </div>
            <NotificationsBell />
          </div>
          
          {/* Metrics Row */}
          <MetricsRow />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {action}
        </div>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Page Content */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

