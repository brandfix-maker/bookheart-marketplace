'use client';

import { useState } from 'react';
import { Book } from '@bookheart/shared';
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
import { AlertTriangle, Check, Pause, Trash2 } from 'lucide-react';

interface ListingActionsProps {
  book: Book;
  action: 'pause' | 'sold' | 'delete';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBook?: Book) => void;
}

export function ListingActions({
  book,
  action,
  isOpen,
  onClose,
  onSuccess,
}: ListingActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (action === 'delete') {
        await apiClient.delete(`/books/${book.id}`);
        toast({
          title: 'Listing Deleted',
          description: 'Your listing has been successfully deleted.',
        });
        onSuccess();
      } else if (action === 'pause') {
        const response = await apiClient.put(`/books/${book.id}`, {
          status: 'pending',
        });
        toast({
          title: 'Listing Paused',
          description: 'Your listing has been paused and is no longer visible.',
        });
        onSuccess(response.data.data);
      } else if (action === 'sold') {
        const response = await apiClient.put(`/books/${book.id}`, {
          status: 'sold',
        });
        toast({
          title: 'Marked as Sold',
          description: 'Your listing has been marked as sold.',
        });
        onSuccess(response.data.data);
      }
    } catch (error: any) {
      console.error('Action failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfig = () => {
    switch (action) {
      case 'pause':
        return {
          title: 'Pause Listing',
          description: 'This will temporarily hide your listing from the marketplace. You can reactivate it later.',
          icon: Pause,
          iconColor: 'text-yellow-500',
          confirmText: 'Pause Listing',
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'sold':
        return {
          title: 'Mark as Sold',
          description: 'This will mark your listing as sold and remove it from the marketplace.',
          icon: Check,
          iconColor: 'text-green-500',
          confirmText: 'Mark as Sold',
          confirmClass: 'bg-green-600 hover:bg-green-700',
        };
      case 'delete':
        return {
          title: 'Delete Listing',
          description: 'This action cannot be undone. Your listing will be permanently deleted.',
          icon: Trash2,
          iconColor: 'text-red-500',
          confirmText: 'Delete Listing',
          confirmClass: 'bg-red-600 hover:bg-red-700',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gray-700 rounded-lg ${config.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300 pt-2">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">{book.title}</p>
              <p className="text-sm text-gray-300">{book.author}</p>
              <p className="text-sm text-gray-400 mt-1">
                ${(book.priceCents / 100).toFixed(2)} • {book.condition}
              </p>
            </div>
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
            onClick={handleAction}
            disabled={isLoading}
            className={config.confirmClass}
          >
            {isLoading ? 'Processing...' : config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

