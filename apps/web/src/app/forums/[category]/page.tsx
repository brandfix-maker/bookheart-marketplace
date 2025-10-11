import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function ForumCategoryPage({ params }: { params: { category: string } }) {
  const categoryName = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <FolderOpen className="h-24 w-24 text-transparent bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 bg-clip-text" />
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 bg-clip-text text-transparent mb-4">
            {categoryName}
          </h1>
          <p className="text-xl text-gray-600">
            Forum category discussions
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-brand-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            📂 Forum category: {categoryName}
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Thread listings coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
