'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { MessageSquare } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  sellerId: string;
  sellerUsername: string;
  bookTitle: string;
}

export function MessageModal({ 
  isOpen, 
  onClose, 
  bookId, 
  sellerId, 
  sellerUsername, 
  bookTitle 
}: MessageModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please enter a message.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/messages', {
        recipientId: sellerId,
        bookId,
        messageText: message.trim(),
      });

      toast({
        title: 'Message Sent! 💜',
        description: 'The seller will receive your message.',
      });

      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to Send Message',
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
            Message Seller
          </DialogTitle>
          <p className="text-sm text-gray-300">
            Send a message to <span className="text-brand-pink-500 font-medium">{sellerUsername}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message-content" className="text-gray-200">
              Message
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="message-content"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${sellerUsername}, I'm interested in your listing for "${bookTitle}". Could you tell me more about...`}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                rows={4}
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Be respectful and specific about your question or interest.
            </p>
          </div>

          {/* Tips */}
          <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-300">
              <strong>Tips for a great message:</strong>
            </p>
            <ul className="text-xs text-gray-400 mt-1 space-y-1">
              <li>• Ask about book condition or shipping details</li>
              <li>• Mention your location if relevant</li>
              <li>• Be polite and professional</li>
            </ul>
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
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
