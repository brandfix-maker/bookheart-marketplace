'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface AcceptOfferModalProps {
  offer: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AcceptOfferModal({
  offer,
  isOpen,
  onClose,
  onSuccess,
}: AcceptOfferModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/offers/${offer.id}/accept`);
      
      toast({
        title: 'Offer Accepted!',
        description: 'The buyer has been notified and can now proceed with checkout.',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to accept offer:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to accept offer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <DialogTitle>Accept Offer</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300 pt-2">
            Accept this offer for {formatPrice(offer.offerAmountCents)}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Book Info */}
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="font-semibold text-white mb-1">
              {offer.book?.title || 'Book Title'}
            </p>
            <p className="text-sm text-gray-300">
              {offer.book?.author || 'Unknown Author'}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Your Asking Price</p>
                <p className="text-white font-medium">
                  {formatPrice(offer.book?.priceCents || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Offer Amount</p>
                <p className="text-green-400 font-bold text-lg">
                  {formatPrice(offer.offerAmountCents)}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-200 font-medium mb-2">What happens next?</p>
            <ul className="text-sm text-blue-100 space-y-1 list-disc list-inside">
              <li>The buyer will be notified immediately</li>
              <li>They can proceed to checkout at the offer price</li>
              <li>Your listing will be marked as pending</li>
              <li>You'll receive payment once the buyer completes checkout</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Accepting...' : 'Accept Offer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

