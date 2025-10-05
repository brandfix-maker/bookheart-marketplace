import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <BookOpenCheck className="h-24 w-24 text-transparent bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text" />
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text text-transparent mb-4">
            Book Details
          </h1>
          <p className="text-xl text-gray-600">
            Book ID: {params.id}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            📖 Detailed book listing page coming soon...
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Image gallery, condition details, seller info, and purchase options
          </p>
        </div>
      </div>
    </div>
  );
}
