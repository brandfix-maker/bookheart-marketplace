'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { Package } from 'lucide-react';

interface UploadTrackingProps {
  transaction: any;
  onSuccess: () => void;
}

export function UploadTracking({ transaction, onSuccess }: UploadTrackingProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const carriers = [
    { value: 'USPS', label: 'USPS' },
    { value: 'FedEx', label: 'FedEx' },
    { value: 'UPS', label: 'UPS' },
    { value: 'DHL', label: 'DHL' },
    { value: 'Other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim() || !trackingCarrier) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both tracking number and carrier.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.patch(`/transactions/${transaction.id}/tracking`, {
        trackingNumber: trackingNumber.trim(),
        trackingCarrier,
      });

      toast({
        title: 'Tracking Updated',
        description: 'The buyer has been notified with the tracking information.',
      });

      setTrackingNumber('');
      setTrackingCarrier('');
      onSuccess();
    } catch (error: any) {
      console.error('Failed to update tracking:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update tracking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-white mb-3">Upload Tracking</h4>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-700/50 rounded-lg space-y-4">
        <div>
          <Label htmlFor="carrier" className="text-gray-300">
            Carrier
          </Label>
          <Select value={trackingCarrier} onValueChange={setTrackingCarrier}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select carrier" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {carriers.map((carrier) => (
                <SelectItem key={carrier.value} value={carrier.value}>
                  {carrier.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tracking" className="text-gray-300">
            Tracking Number
          </Label>
          <Input
            id="tracking"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-purple-500 hover:bg-brand-purple-600"
        >
          <Package className="w-4 h-4 mr-2" />
          {isLoading ? 'Updating...' : 'Mark as Shipped'}
        </Button>
      </form>
    </div>
  );
}

