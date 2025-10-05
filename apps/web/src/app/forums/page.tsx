import React from 'react';
import { MessageCircle, Users } from 'lucide-react';

export default function ForumsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <MessageCircle className="h-24 w-24 text-transparent bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text" />
            <Users className="h-8 w-8 text-[#9C27B0] absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text text-transparent mb-4">
            Community Forums
          </h1>
          <p className="text-xl text-gray-600">
            Connect with fellow book lovers
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            🗣️ Community discussion forums coming soon...
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Book discussions, recommendations, and community engagement
          </p>
        </div>
      </div>
    </div>
  );
}
