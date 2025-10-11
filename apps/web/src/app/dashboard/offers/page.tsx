'use client';

import { useEffect, useState } from 'react';
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { apiClient } from '@/lib/api-client';
import { Tag } from 'lucide-react';
import { OfferCard } from '@/components/dashboard/offer-card';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOffers();
  }, [statusFilter]);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const query = statusFilter === 'all' 
        ? '?type=received' 
        : `?type=received&status=${statusFilter}`;
      const response = await apiClient.get(`/offers${query}`);
      if (response.data?.success) {
        setOffers(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' },
  ];

  return (
    <DashboardWrapper
      title="Offers Received"
      action={
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === filter.value
                  ? 'bg-brand-purple-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-700/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg">
          <Tag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No offers yet
          </h3>
          <p className="text-gray-300">
            Offers will appear here when buyers are interested in your books
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onRefresh={fetchOffers} />
          ))}
        </div>
      )}
    </DashboardWrapper>
  );
}

