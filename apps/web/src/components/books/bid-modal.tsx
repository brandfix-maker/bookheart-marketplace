'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { DollarSign, Clock, Users, AlertCircle } from 'lucide-react';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionId: string;
  currentBid: number;
  minimumBid: number;
  timeRemaining: string;
  bidCount: number;
}

export function BidModal({ 
  isOpen, 
  onClose, 
  auctionId, 
  currentBid, 
  minimumBid, 
  timeRemaining,
  bidCount
}: BidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bidAmount || isNaN(Number(bidAmount))) {
      toast({
        title: 'Invalid Bid',
        description: 'Please enter a valid bid amount.',
        variant: 'destructive',
      });
      return;
    }

    const amount = Number(bidAmount);
    
    if (amount < minimumBid) {
      toast({
        title: 'Bid Too Low',
        description: `Minimum bid is $${minimumBid.toFixed(2)}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post(`/auctions/${auctionId}/bid`, {
        bidAmountCents: Math.round(amount * 100),
      });

      toast({
        title: 'Bid Placed! 💜',
        description: 'Your bid has been recorded.',
      });

      setBidAmount('');
      onClose();
    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: 'Failed to Place Bid',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Place Your Bid
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Auction Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <DollarSign className="h-4 w-4" />
              <span>Current Bid: <span className="font-semibold text-white">${currentBid.toFixed(2)}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="h-4 w-4" />
              <span>{bidCount} {bidCount === 1 ? 'bid' : 'bids'} placed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="h-4 w-4" />
              <span>Time remaining: <span className="font-semibold text-brand-pink-500">{timeRemaining}</span></span>
            </div>
          </div>

          {/* Bid Rules */}
          <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-brand-pink-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-300">
                <p className="font-semibold mb-1">Bid Rules:</p>
                <ul className="space-y-1">
                  <li>• Bids are binding and cannot be retracted</li>
                  <li>• You'll be notified if you're outbid</li>
                  <li>• Winner pays immediately when auction ends</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bid Amount */}
            <div className="space-y-2">
              <Label htmlFor="bid-amount" className="text-gray-200">
                Your Bid Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="bid-amount"
                  type="number"
                  step="0.01"
                  min={minimumBid}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={minimumBid.toFixed(2)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
              <p className="text-sm text-gray-400">
                Minimum bid: ${minimumBid.toFixed(2)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 hover:from-brand-pink-700 hover:to-brand-purple-700"
              >
                {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
