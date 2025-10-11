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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftRight } from 'lucide-react';

interface CounterOfferModalProps {
  offer: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CounterOfferModal({
  offer,
  isOpen,
  onClose,
  onSuccess,
}: CounterOfferModalProps) {
  const [counterAmount, setCounterAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const validateCounterOffer = (value: string) => {
    const amount = parseFloat(value);
    const originalOffer = offer.offerAmountCents / 100;
    const askingPrice = (offer.book?.priceCents || 0) / 100;

    if (isNaN(amount) || amount <= 0) {
      return 'Please enter a valid amount';
    }
    if (amount <= originalOffer) {
      return `Counter offer must be higher than original offer ($${originalOffer})`;
    }
    if (amount > askingPrice) {
      return `Counter offer cannot exceed asking price ($${askingPrice})`;
    }
    return '';
  };

  const handleCounterAmountChange = (value: string) => {
    setCounterAmount(value);
    const validationError = validateCounterOffer(value);
    setError(validationError);
  };

  const handleSubmit = async () => {
    const validationError = validateCounterOffer(counterAmount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const counterAmountCents = Math.round(parseFloat(counterAmount) * 100);
      
      await apiClient.post(`/offers/${offer.id}/counter`, {
        counterOfferAmountCents: counterAmountCents,
        counterOfferMessage: message.trim() || undefined,
      });
      
      toast({
        title: 'Counter Offer Sent',
        description: 'The buyer has been notified of your counter offer.',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to send counter offer:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to send counter offer. Please try again.',
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
            <div className="p-2 bg-brand-purple-500/20 rounded-lg">
              <ArrowLeftRight className="w-6 h-6 text-brand-purple-400" />
            </div>
            <DialogTitle>Send Counter Offer</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300 pt-2">
            Propose a different price for this book
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Offer */}
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="font-semibold text-white mb-1">
              {offer.book?.title || 'Book Title'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Their Offer</p>
                <p className="text-white font-medium">
                  {formatPrice(offer.offerAmountCents)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Your Asking Price</p>
                <p className="text-white font-medium">
                  {formatPrice(offer.book?.priceCents || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Counter Offer Amount */}
          <div>
            <Label htmlFor="counter-amount" className="text-gray-300">
              Your Counter Offer *
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="counter-amount"
                type="number"
                step="0.01"
                min="0"
                value={counterAmount}
                onChange={(e) => handleCounterAmountChange(e.target.value)}
                placeholder="0.00"
                className="pl-7 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400 mt-1">{error}</p>
            )}
          </div>

          {/* Optional Message */}
          <div>
            <Label htmlFor="message" className="text-gray-300">
              Message to Buyer (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why you're proposing this amount..."
              rows={3}
              maxLength={500}
              className="mt-1 bg-gray-700 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              {message.length}/500 characters
            </p>
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
            onClick={handleSubmit}
            disabled={isLoading || !!error || !counterAmount}
            className="bg-brand-purple-500 hover:bg-brand-purple-600"
          >
            {isLoading ? 'Sending...' : 'Send Counter Offer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

