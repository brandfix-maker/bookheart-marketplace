'use client';

import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardMessagesPage() {
  const router = useRouter();

  return (
    <DashboardWrapper title="Messages">
      <div className="flex flex-col items-center justify-center py-12 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg">
        <div className="p-4 bg-gray-700 rounded-full mb-4">
          <MessageSquare className="w-16 h-16 text-brand-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Messages
        </h3>
        <p className="text-gray-300 mb-6 text-center max-w-md">
          View and respond to buyer messages about your listings
        </p>
        <Button
          onClick={() => router.push('/messages')}
          className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 hover:from-brand-pink-600 hover:to-brand-purple-600"
        >
          Go to Messages
        </Button>
      </div>
    </DashboardWrapper>
  );
}

