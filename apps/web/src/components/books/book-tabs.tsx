'use client';

import React, { useState } from 'react';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Package, Truck, Calendar, Tag } from 'lucide-react';

interface BookTabsProps {
  book: Book;
}

type TabType = 'description' | 'details' | 'reviews';

export function BookTabs({ book }: BookTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs = [
    { id: 'description' as const, label: 'Description' },
    { id: 'details' as const, label: 'Details' },
    { id: 'reviews' as const, label: 'Reviews' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderDescriptionTab = () => (
    <div className="space-y-6">
      {/* Seller Story */}
      {book.sellerStory && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Seller's Story</h3>
          <p className="text-gray-300 leading-relaxed">{book.sellerStory}</p>
        </div>
      )}

      {/* Condition Notes */}
      {book.conditionNotes && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Condition Details</h3>
          <p className="text-gray-300 leading-relaxed">{book.conditionNotes}</p>
        </div>
      )}

      {/* Shipping Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Shipping & Handling</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <Truck className="h-5 w-5 text-brand-pink-500" />
            <span>
              Shipping: ${((book.shippingPriceCents || book.shippingCents || 0) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Package className="h-5 w-5 text-brand-pink-500" />
            <span>Packaging: Protective bubble wrap and sturdy box</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="h-5 w-5 text-brand-pink-500" />
            <span>Ships from: {book.city && book.state ? `${book.city}, ${book.state}` : 'United States'}</span>
          </div>
        </div>
      </div>

      {/* No Content Message */}
      {!book.sellerStory && !book.conditionNotes && (
        <div className="text-center py-8">
          <p className="text-gray-400">No additional description provided.</p>
        </div>
      )}
    </div>
  );

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Special Features */}
      {(book.specialEditionDetails || book.isSigned || book.isSpecialEdition) && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Special Features</h3>
          <div className="flex flex-wrap gap-2">
            {book.isSigned && (
              <Badge className="bg-amber-500 text-white">Signed Copy</Badge>
            )}
            {book.isSpecialEdition && (
              <Badge className="bg-purple-500 text-white">Special Edition</Badge>
            )}
            {book.specialEditionDetails?.paintedEdges && (
              <Badge className="bg-brand-pink-500 text-white">Painted Edges</Badge>
            )}
            {book.specialEditionDetails?.sprayedEdges && (
              <Badge className="bg-blue-500 text-white">Sprayed Edges</Badge>
            )}
            {book.specialEditionDetails?.foilStamped && (
              <Badge className="bg-yellow-500 text-white">Foil Stamped</Badge>
            )}
            {book.specialEditionDetails?.embossed && (
              <Badge className="bg-green-500 text-white">Embossed</Badge>
            )}
          </div>
        </div>
      )}

      {/* Tropes */}
      {book.tropes && book.tropes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Tropes</h3>
          <div className="flex flex-wrap gap-2">
            {book.tropes.map((trope, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Tag className="h-3 w-3 mr-1" />
                {trope}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Publication Details */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Publication Details</h3>
        <div className="space-y-2">
          {book.isbn && (
            <div className="flex justify-between text-gray-300">
              <span>ISBN:</span>
              <span className="font-mono text-sm">{book.isbn}</span>
            </div>
          )}
          {book.publisher && (
            <div className="flex justify-between text-gray-300">
              <span>Publisher:</span>
              <span>{book.publisher}</span>
            </div>
          )}
          {book.publishedYear && (
            <div className="flex justify-between text-gray-300">
              <span>Published:</span>
              <span>{book.publishedYear}</span>
            </div>
          )}
          {book.pages && (
            <div className="flex justify-between text-gray-300">
              <span>Pages:</span>
              <span>{book.pages}</span>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Box */}
      {book.subscriptionBox && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Subscription Box</h3>
          <Badge className="bg-gradient-to-r from-brand-purple-500 to-brand-pink-500 text-white">
            {book.subscriptionBox}
          </Badge>
        </div>
      )}

      {/* Listed Date */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Listing Info</h3>
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="h-4 w-4 text-brand-pink-500" />
          <span>Listed {book.createdAt ? formatDate(book.createdAt) : 'Recently'}</span>
        </div>
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div className="space-y-4">
      {/* Placeholder for reviews - will be populated when review system is implemented */}
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Reviews Yet</h3>
        <p className="text-gray-400">
          Be the first to review this seller's listing!
        </p>
        <Button 
          variant="outline" 
          className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
          disabled
        >
          Leave a Review
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Tab Headers */}
      <div className="border-b border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-brand-pink-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && renderDescriptionTab()}
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
      </div>
    </div>
  );
}
