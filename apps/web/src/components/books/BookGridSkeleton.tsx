'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface BookGridSkeletonProps {
  count?: number;
  className?: string;
}

export function BookGridSkeleton({ count = 8, className = '' }: BookGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          {/* Image Skeleton */}
          <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
            
            {/* Author Skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            
            {/* Tropes Skeleton */}
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
            </div>
            
            {/* Price Skeleton */}
            <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
            
            {/* Button Skeleton */}
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  );
}
