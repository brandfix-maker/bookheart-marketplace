'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gavel, Users } from 'lucide-react';

interface Auction {
  id: string;
  currentBidCents: number;
  reservePriceCents?: number;
  totalBids: number;
  uniqueBidders: number;
  endTime: string;
  status: string;
}

interface AuctionDisplayProps {
  auction: Auction;
}

export function AuctionDisplay({ auction }: AuctionDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(auction.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining('Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;

      setTimeRemaining(timeString.trim());
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime]);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const reserveMet = auction.reservePriceCents 
    ? auction.currentBidCents >= auction.reservePriceCents 
    : true;

  return (
    <div className="p-6 bg-gray-700/50 border border-gray-600 rounded-lg">
      {/* Auction Active Label */}
      <div className="flex items-center gap-2 mb-3">
        <Gavel className="w-5 h-5 text-purple-400" />
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
          Auction Active
        </span>
      </div>

      {/* Current Bid */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-1">Current Bid</div>
        <div className="text-3xl font-bold text-white">
          {formatPrice(auction.currentBidCents)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
          <Users className="w-4 h-4" />
          <span>
            {auction.totalBids} {auction.totalBids === 1 ? 'bid' : 'bids'} from{' '}
            {auction.uniqueBidders} {auction.uniqueBidders === 1 ? 'bidder' : 'bidders'}
          </span>
        </div>
      </div>

      {/* Reserve Price Indicator */}
      {auction.reservePriceCents && (
        <div className="mb-4">
          {reserveMet ? (
            <div className="flex items-center gap-2 text-sm px-3 py-2 bg-green-900/30 border border-green-500 text-green-400 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Reserve price met
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm px-3 py-2 bg-yellow-900/30 border border-yellow-500 text-yellow-400 rounded">
              Reserve price not yet met
            </div>
          )}
        </div>
      )}

      {/* Time Remaining */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="text-sm text-gray-400 text-center mb-1">Time Remaining</div>
        <div className="text-lg font-bold text-white text-center">
          {timeRemaining}
        </div>
      </div>

      {/* Place Bid Button */}
      <Button 
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 font-semibold"
        disabled={auction.status !== 'active' || timeRemaining === 'Ended'}
      >
        <Gavel className="w-5 h-5 mr-2" />
        {timeRemaining === 'Ended' ? 'Auction Ended' : 'Place Bid'}
      </Button>

      {/* Auction End Date */}
      <div className="mt-3 text-xs text-gray-400 text-center">
        Ends: {new Date(auction.endTime).toLocaleString()}
      </div>
    </div>
  );
}

