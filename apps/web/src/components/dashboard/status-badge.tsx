'use client';

import { Check, Clock, Circle, Package } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    active: {
      label: 'Active',
      icon: Check,
      className: 'bg-green-500/90 text-white',
    },
    draft: {
      label: 'Draft',
      icon: Circle,
      className: 'bg-gray-500/90 text-white',
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-yellow-500/90 text-white',
    },
    sold: {
      label: 'Sold',
      icon: Package,
      className: 'bg-blue-500/90 text-white',
    },
    removed: {
      label: 'Removed',
      icon: Circle,
      className: 'bg-red-500/90 text-white',
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.draft;
  const Icon = statusConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}
    >
      <Icon className="w-3 h-3" />
      {statusConfig.label}
    </span>
  );
}

