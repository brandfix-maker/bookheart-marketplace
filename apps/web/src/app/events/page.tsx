import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <Calendar className="h-24 w-24 text-transparent bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text" />
            <Sparkles className="h-8 w-8 text-[#E91E63] absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] bg-clip-text text-transparent mb-4">
            Events Bulletin
          </h1>
          <p className="text-xl text-gray-600">
            Discover upcoming book events, signings, and community gatherings
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            📅 Events calendar and listings coming soon...
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Book releases, author signings, virtual meet-ups, and more
          </p>
        </div>
      </div>
    </div>
  );
}
