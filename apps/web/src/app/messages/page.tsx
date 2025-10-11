import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <MessageSquare className="h-24 w-24 text-transparent bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 bg-clip-text" />
        </div>
        
        <div>
          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-brand-pink-500 to-brand-purple-500 bg-clip-text text-transparent mb-4">
            Messages
          </h1>
          <p className="text-xl text-gray-600">
            Chat with buyers and sellers
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-pink-200 p-12">
          <p className="text-gray-500 text-lg">
            💬 Real-time messaging system coming soon...
          </p>
          <p className="text-gray-400 text-sm mt-4">
            WebSocket-powered chat with notifications
          </p>
        </div>
      </div>
    </div>
  );
}
