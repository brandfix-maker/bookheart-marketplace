import React from 'react';
import { Tag } from 'lucide-react';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <Tag className="h-24 w-24 text-transparent bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text" />
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text text-transparent mb-4">
            {categoryName}
          </h1>
          <p className="text-xl text-gray-600">
            Curated collection of {categoryName.toLowerCase()}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            🏷️ Category browsing coming soon...
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Explore books filtered by: {categoryName}
          </p>
        </div>
      </div>
    </div>
  );
}
