'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { DollarSign, Percent, MessageSquare } from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  askingPrice: number;
  sellerId: string;
}

export function OfferModal({ isOpen, onClose, bookId, askingPrice, sellerId }: OfferModalProps) {
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offerAmount || isNaN(Number(offerAmount))) {
      toast({
        title: 'Invalid Offer',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    const amount = Number(offerAmount);
    const minOffer = 5;
    
    if (amount < minOffer) {
      toast({
        title: 'Offer Too Low',
        description: `Minimum offer is $${minOffer}.`,
        variant: 'destructive',
      });
      return;
    }

    if (amount >= askingPrice) {
      toast({
        title: 'Offer Too High',
        description: 'Your offer must be less than the asking price.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/offers', {
        bookId,
        sellerId,
        offerAmountCents: Math.round(amount * 100),
        messageToSeller: message.trim() || undefined,
      });

      toast({
        title: 'Offer Sent! 💜',
        description: 'The seller will be notified of your offer.',
      });

      setOfferAmount('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending offer:', error);
      toast({
        title: 'Failed to Send Offer',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const offerPercentage = offerAmount && !isNaN(Number(offerAmount)) 
    ? Math.round((Number(offerAmount) / askingPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Make an Offer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="offer-amount" className="text-gray-200">
              Your Offer Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="offer-amount"
                type="number"
                step="0.01"
                min="5"
                max={askingPrice - 0.01}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="0.00"
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <p className="text-sm text-gray-400">
              Asking price: ${askingPrice.toFixed(2)} • Min: $5.00
            </p>
          </div>

          {/* Percentage Indicator */}
          {offerAmount && !isNaN(Number(offerAmount)) && (
            <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <Percent className="h-4 w-4 text-brand-pink-500" />
              <span className="text-sm text-gray-300">
                Your offer is <span className="font-semibold text-white">{offerPercentage}%</span> of the asking price
              </span>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="offer-message" className="text-gray-200">
              Message (Optional)
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="offer-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to your offer..."
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                rows={3}
                maxLength={500}
              />
            </div>
            <p className="text-xs text-gray-500">
              {message.length}/500 characters
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
              {isSubmitting ? 'Sending...' : 'Send Offer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
