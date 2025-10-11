'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AcceptOfferModal } from './accept-offer-modal';
import { CounterOfferModal } from './counter-offer-modal';
import { DeclineOfferModal } from './decline-offer-modal';
import { StatusBadge } from './status-badge';

interface OfferCardProps {
  offer: any;
  onRefresh: () => void;
}

export function OfferCard({ offer, onRefresh }: OfferCardProps) {
  const [showAccept, setShowAccept] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [showDecline, setShowDecline] = useState(false);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  
  const getTimeRemaining = () => {
    const expiresAt = new Date(offer.expiresAt);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff < 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 24) {
      return `${hours}h ${minutes}m remaining`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  };

  const getPercentageDiff = () => {
    if (!offer.book?.priceCents) return null;
    const diff = ((offer.offerAmountCents - offer.book.priceCents) / offer.book.priceCents) * 100;
    return diff.toFixed(0);
  };

  const percentDiff = getPercentageDiff();
  const isPending = offer.status === 'pending';

  return (
    <>
      <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Header with Book Info */}
          <div className="flex gap-4">
            {offer.book?.images?.[0] && (
              <div className="relative w-20 h-28 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={offer.book.images[0].cloudinaryUrl}
                  alt={offer.book.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white line-clamp-2">
                {offer.book?.title || 'Book Title'}
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {offer.book?.author || 'Unknown Author'}
              </p>
              <div className="mt-2">
                <StatusBadge status={offer.status} />
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="p-4 bg-gray-700/50 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400">Offer Amount</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(offer.offerAmountCents)}
                </p>
              </div>
              {percentDiff && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">vs. Asking Price</p>
                  <p className={`text-sm font-semibold ${
                    parseInt(percentDiff) < 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {percentDiff}%
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatPrice(offer.book?.priceCents || 0)}
                  </p>
                </div>
              )}
            </div>

            {/* Buyer Message */}
            {offer.messageToSeller && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Message from buyer</p>
                <p className="text-sm text-gray-300 italic">
                  &quot;{offer.messageToSeller}&quot;
                </p>
              </div>
            )}

            {/* Time Remaining */}
            {isPending && (
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <Clock className="w-4 h-4" />
                <span>{getTimeRemaining()}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {isPending && (
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAccept(true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Accept
              </Button>
              <Button
                onClick={() => setShowCounter(true)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                Counter
              </Button>
              <Button
                onClick={() => setShowDecline(true)}
                variant="outline"
                className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAccept && (
        <AcceptOfferModal
          offer={offer}
          isOpen={showAccept}
          onClose={() => setShowAccept(false)}
          onSuccess={() => {
            setShowAccept(false);
            onRefresh();
          }}
        />
      )}
      {showCounter && (
        <CounterOfferModal
          offer={offer}
          isOpen={showCounter}
          onClose={() => setShowCounter(false)}
          onSuccess={() => {
            setShowCounter(false);
            onRefresh();
          }}
        />
      )}
      {showDecline && (
        <DeclineOfferModal
          offer={offer}
          isOpen={showDecline}
          onClose={() => setShowDecline(false)}
          onSuccess={() => {
            setShowDecline(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
}

