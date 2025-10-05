import React from 'react';
import { MessagesSquare } from 'lucide-react';

export default function ThreadPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <MessagesSquare className="h-24 w-24 text-transparent bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text" />
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text text-transparent mb-4">
            Discussion Thread
          </h1>
          <p className="text-xl text-gray-600">
            Thread ID: {params.id}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            💬 Forum thread view coming soon...
          </p>
          <p className="text-gray-400 text-sm mt-4">
            View posts, reply, and engage with the community
          </p>
        </div>
      </div>
    </div>
  );
}
