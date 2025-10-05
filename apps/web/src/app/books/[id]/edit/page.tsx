'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookListingForm } from '@/components/books/BookListingForm';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Book } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { BookOpen } from 'lucide-react';

export default function EditBookPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/books/${bookId}`);
      const bookData = response.data;
      

      setBook(bookData);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast({
        title: 'Error',
        description: 'Failed to load book details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600">The book you're looking for doesn't exist or you don't have permission to edit it.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['user', 'admin']}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8">
        <BookListingForm 
          initialData={{
            title: book.title,
            author: book.author,
            isbn: book.isbn || '',
            description: book.description || '',
            seriesName: book.seriesName || '',
            seriesNumber: book.seriesNumber?.toString() || '',
            tropes: book.tropes || [],
            spiceLevel: book.spiceLevel?.toString() || '0',
            condition: book.condition,
            conditionNotes: book.conditionNotes || '',
            price: (book.priceCents / 100).toString(),
            shippingPrice: (book.shippingPriceCents / 100).toString(),
            localPickupAvailable: book.localPickupAvailable,
            isSpecialEdition: book.isSpecialEdition,
            specialEditionDetails: book.specialEditionDetails || {
              paintedEdges: false,
              firstEdition: false,
              exclusiveCover: false,
              sprayed: false,
              customDustJacket: false,
              details: '',
            },
            images: [],
            status: book.status,
          }}
          bookId={bookId}
        />
      </div>
    </ProtectedRoute>
  );
}
