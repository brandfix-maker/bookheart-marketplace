'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { SellerDashboard } from '@/components/seller/SellerDashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRoles={['user', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <SellerDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}
