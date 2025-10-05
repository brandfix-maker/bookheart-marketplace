import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function SalesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <TrendingUp className="h-24 w-24 text-transparent bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text" />
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text text-transparent mb-4">
            My Sales
          </h1>
          <p className="text-xl text-gray-600">
            Manage your book sales
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            💰 Sales dashboard coming soon...
          </p>
          <p className="text-gray-400 text-sm mt-4">
            View completed sales, pending orders, and earnings
          </p>
        </div>
      </div>
    </div>
  );
}
