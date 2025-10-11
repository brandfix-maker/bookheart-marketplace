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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface DeclineOfferModalProps {
  offer: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeclineOfferModal({
  offer,
  isOpen,
  onClose,
  onSuccess,
}: DeclineOfferModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const reasons = [
    { value: 'too-low', label: 'Offer is too low' },
    { value: 'sold-elsewhere', label: 'Already sold elsewhere' },
    { value: 'not-selling', label: 'No longer selling' },
    { value: 'other', label: 'Other reason' },
  ];

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/offers/${offer.id}/reject`);
      
      toast({
        title: 'Offer Declined',
        description: 'The buyer has been notified.',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to decline offer:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to decline offer. Please try again.',
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
            <div className="p-2 bg-red-500/20 rounded-lg">
              <X className="w-6 h-6 text-red-400" />
            </div>
            <DialogTitle>Decline Offer</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300 pt-2">
            Are you sure you want to decline this offer?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Offer Details */}
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="font-semibold text-white mb-1">
              {offer.book?.title || 'Book Title'}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Their Offer</p>
                <p className="text-white font-medium">
                  {formatPrice(offer.offerAmountCents)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Your Asking Price</p>
                <p className="text-white font-medium">
                  {formatPrice(offer.book?.priceCents || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Reason (Optional) */}
          <div>
            <Label htmlFor="reason" className="text-gray-300">
              Reason (Optional)
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {reasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-200">
              <strong>Note:</strong> The buyer will be notified that you declined their offer. 
              This action cannot be undone.
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
            onClick={handleDecline}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Declining...' : 'Decline Offer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

