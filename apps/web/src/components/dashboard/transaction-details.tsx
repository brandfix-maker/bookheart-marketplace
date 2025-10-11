'use client';

import { UploadTracking } from './upload-tracking';
import { Check } from 'lucide-react';

interface TransactionDetailsProps {
  transaction: any;
  onRefresh: () => void;
}

export function TransactionDetails({ transaction, onRefresh }: TransactionDetailsProps) {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const timeline = [
    { label: 'Paid', completed: !!transaction.paidAt, date: transaction.paidAt },
    { label: 'Shipped', completed: !!transaction.shippedAt, date: transaction.shippedAt },
    { label: 'Delivered', completed: !!transaction.deliveredAt, date: transaction.deliveredAt },
    { label: 'Completed', completed: !!transaction.completedAt, date: transaction.completedAt },
  ];

  const showTrackingUpload = transaction.status === 'paid' && !transaction.trackingNumber;

  return (
    <div className="px-6 pb-6 border-t border-gray-700">
      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Shipping Address & Timeline */}
        <div className="space-y-6">
          {/* Shipping Address (placeholder - would come from transaction) */}
          <div>
            <h4 className="font-semibold text-white mb-3">Buyer Information</h4>
            <div className="p-4 bg-gray-700/50 rounded-lg space-y-1">
              <p className="text-gray-300">{transaction.buyer?.username || 'Unknown Buyer'}</p>
              {transaction.buyer?.location && (
                <p className="text-sm text-gray-400">{transaction.buyer.location}</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-semibold text-white mb-3">Status Timeline</h4>
            <div className="space-y-3">
              {timeline.map((step, index) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-400">
                        {new Date(step.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Transaction Details & Tracking */}
        <div className="space-y-6">
          {/* Transaction Details */}
          <div>
            <h4 className="font-semibold text-white mb-3">Transaction Details</h4>
            <div className="p-4 bg-gray-700/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Item Price</span>
                <span className="text-white">{formatPrice(transaction.itemPriceCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Shipping</span>
                <span className="text-white">{formatPrice(transaction.shippingCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Platform Fee (7%)</span>
                <span className="text-white">-{formatPrice(transaction.platformFeeCents)}</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Your Payout</span>
                  <span className="text-green-400">{formatPrice(transaction.sellerPayoutCents)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {showTrackingUpload ? (
            <UploadTracking transaction={transaction} onSuccess={onRefresh} />
          ) : transaction.trackingNumber ? (
            <div>
              <h4 className="font-semibold text-white mb-3">Tracking Information</h4>
              <div className="p-4 bg-gray-700/50 rounded-lg space-y-2">
                <div>
                  <p className="text-xs text-gray-400">Carrier</p>
                  <p className="text-white font-medium">{transaction.trackingCarrier}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tracking Number</p>
                  <p className="text-white font-mono">{transaction.trackingNumber}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

