'use client';

import { useEffect, useState } from 'react';
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { apiClient } from '@/lib/api-client';
import { Package } from 'lucide-react';
import { TransactionTable } from '@/components/dashboard/transaction-table';

export default function SoldPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const query = statusFilter === 'all' 
        ? '?role=seller' 
        : `?role=seller&status=${statusFilter}`;
      const response = await apiClient.get(`/transactions${query}`);
      if (response.data?.success) {
        setTransactions(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'paid', label: 'Pending Shipment' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <DashboardWrapper
      title="Sales History"
      action={
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No sales yet
          </h3>
          <p className="text-gray-300">
            Your first sale is just around the corner!
          </p>
        </div>
      ) : (
        <TransactionTable transactions={transactions} onRefresh={fetchTransactions} />
      )}
    </DashboardWrapper>
  );
}

