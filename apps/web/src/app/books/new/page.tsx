'use client';

import React from 'react';
import { BookListingForm } from '@/components/books/BookListingForm';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function NewBookPage() {
  return (
    <ProtectedRoute requiredRoles={['user', 'admin']}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8">
        <BookListingForm />
      </div>
    </ProtectedRoute>
  );
}
