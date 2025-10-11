'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to listings by default
    router.push('/dashboard/listings');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-300">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
