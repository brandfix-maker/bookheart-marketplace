'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Eye, MessageSquare, DollarSign } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { DashboardMetrics } from '@bookheart/shared';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  badge?: boolean;
  onClick?: () => void;
}

function MetricCard({ title, value, icon, trend, badge, onClick }: MetricCardProps) {
  return (
    <div
      className={`relative p-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-gray-600 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {badge && typeof value === 'number' && value > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                {value}
              </span>
            )}
          </div>
          {trend && (
            <p className="text-xs text-green-400 mt-1">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-gray-700/50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="p-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}

export function MetricsRow() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get('/dashboard/metrics');
      if (response?.success) {
        setMetrics(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch metrics:', err);
      setError('Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg text-center">
        <p className="text-gray-400">Unable to load metrics</p>
        <button
          onClick={fetchMetrics}
          className="mt-2 text-brand-purple-400 hover:text-brand-purple-300 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Active Listings"
        value={metrics?.activeListings || 0}
        icon={<BookOpen className="w-6 h-6 text-brand-purple-400" />}
      />
      <MetricCard
        title="Views This Week"
        value={metrics?.viewsThisWeek || 0}
        icon={<Eye className="w-6 h-6 text-blue-400" />}
      />
      <MetricCard
        title="Messages"
        value={metrics?.unreadMessages || 0}
        icon={<MessageSquare className="w-6 h-6 text-green-400" />}
        badge={true}
      />
      <MetricCard
        title="Sales This Month"
        value={metrics?.salesThisMonth || 0}
        icon={<DollarSign className="w-6 h-6 text-yellow-400" />}
      />
    </div>
  );
}

