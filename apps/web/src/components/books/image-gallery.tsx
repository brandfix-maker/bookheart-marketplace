'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookImage {
  id: string;
  cloudinaryUrl: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

interface ImageGalleryProps {
  images: BookImage[];
  bookTitle: string;
}

export function ImageGallery({ images, bookTitle }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Sort images by order and ensure primary is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  if (sortedImages.length === 0) {
    return (
      <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 aspect-[3/4] flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  const currentImage = sortedImages[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {/* Main Image */}
      <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 relative group">
        <div className="aspect-[3/4] relative">
          <Image
            src={currentImage.cloudinaryUrl}
            alt={currentImage.altText || `${bookTitle} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover cursor-pointer"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onClick={() => setLightboxOpen(true)}
            priority={selectedIndex === 0}
          />
        </div>

        {/* Navigation arrows (show on hover) */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-white text-sm">
          {selectedIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {sortedImages.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`
                flex-shrink-0 w-20 h-28 rounded overflow-hidden border-2 cursor-pointer transition-all
                ${
                  index === selectedIndex
                    ? 'border-brand-pink-500 ring-2 ring-brand-pink-400'
                    : 'border-gray-600 hover:border-gray-500'
                }
              `}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.cloudinaryUrl}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="bg-gray-800 border border-gray-700 max-w-7xl w-full p-4">
          <div className="relative w-full" style={{ maxHeight: '90vh' }}>
            <div className="relative" style={{ maxHeight: '90vh' }}>
              <Image
                src={currentImage.cloudinaryUrl}
                alt={currentImage.altText || `${bookTitle} - Image ${selectedIndex + 1}`}
                width={1200}
                height={1600}
                className="object-contain w-full h-auto"
                style={{ maxHeight: '85vh' }}
              />
            </div>

            {/* Lightbox navigation */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-gray-800/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-700"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gray-800/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-700"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Lightbox counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800/90 backdrop-blur-sm rounded-full text-white">
              {selectedIndex + 1} / {sortedImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

