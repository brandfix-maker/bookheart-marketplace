'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TransactionDetails } from './transaction-details';
import { StatusBadge } from './status-badge';

interface TransactionTableProps {
  transactions: any[];
  onRefresh: () => void;
}

export function TransactionTable({ transactions, onRefresh }: TransactionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden"
        >
          {/* Main Row */}
          <button
            onClick={() => toggleExpand(transaction.id)}
            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-700/50 transition-colors text-left"
          >
            <div className="flex-shrink-0">
              {expandedId === transaction.id ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Buyer */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Buyer</p>
                <p className="text-white font-medium">
                  {transaction.buyer?.username || 'Unknown'}
                </p>
              </div>

              {/* Book */}
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-1">Book</p>
                <p className="text-white font-medium line-clamp-1">
                  {transaction.book?.title || 'N/A'}
                </p>
              </div>

              {/* Date */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Sale Date</p>
                <p className="text-white">{formatDate(transaction.createdAt)}</p>
              </div>

              {/* Amount */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Amount</p>
                <p className="text-white font-bold">
                  {formatPrice(transaction.totalCents)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex-shrink-0">
              <StatusBadge status={transaction.status} />
            </div>
          </button>

          {/* Expanded Details */}
          {expandedId === transaction.id && (
            <TransactionDetails transaction={transaction} onRefresh={onRefresh} />
          )}
        </div>
      ))}
    </div>
  );
}

