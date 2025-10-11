'use client';

import React, { useState } from 'react';
import { Camera, Upload, X, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ImageUpload, IMAGE_SLOT_CONFIG, ImageType } from '@/types/book-wizard';

interface Step4Props {
  data: {
    images: ImageUpload[];
  };
  onChange: (data: any) => void;
  errors: any;
  isSigned?: boolean;
}

export function Step4PhotoUpload({ data, onChange, errors, isSigned }: Step4Props) {
  const [showTips, setShowTips] = useState(false);
  // const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  // const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Filter slots based on whether book is signed
  const requiredSlots = IMAGE_SLOT_CONFIG.filter(
    (slot) => slot.required || (slot.type === 'signature' && isSigned)
  );

  const handleFileSelect = async (type: ImageType, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage: ImageUpload = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: e.target?.result as string,
        type,
        uploaded: false,
        order: data.images.length,
      };

      onChange({
        ...data,
        images: [...data.images, newImage],
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id: string) => {
    onChange({
      ...data,
      images: data.images.filter((img) => img.id !== id),
    });
  };

  const getImagesForType = (type: ImageType) => {
    return data.images.filter((img) => img.type === type);
  };

  const openFilePicker = (type: ImageType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Prefer back camera on mobile
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(type, file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Book Photos
        </h2>
        <p className="text-gray-300">
          Quality photos help your book sell faster
        </p>
      </div>

      {/* Photo Tips */}
      <Card className="p-4 bg-gray-700/50 border-gray-600">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left"
          onClick={() => setShowTips(!showTips)}
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-400" />
            <span className="font-medium text-white">Photo Tips</span>
          </div>
          {showTips ? (
            <ChevronUp className="w-5 h-5 text-amber-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-amber-400" />
          )}
        </button>
        {showTips && (
          <div className="mt-3 text-sm text-gray-300 space-y-2">
            <ul className="space-y-1 ml-4 list-disc">
              <li>Use natural lighting near a window (avoid harsh shadows)</li>
              <li>Place book on a clean, neutral background</li>
              <li>Show all edges clearly, especially painted/sprayed edges</li>
              <li>Photograph any flaws or wear honestly</li>
              <li>Keep camera steady for sharp images</li>
              <li>Photos will be compressed to 2MB max</li>
            </ul>
          </div>
        )}
      </Card>

      {/* Image Upload Slots */}
      <div className="space-y-4">
        {requiredSlots.map((slot) => {
          const slotImages = getImagesForType(slot.type);
          const hasImage = slotImages.length > 0;

          return (
            <Card
              key={slot.type}
              className={cn(
                'p-4',
                slot.required && !hasImage && 'border-brand-brand-pink-500 bg-pink-900/30'
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">
                      {slot.label}
                      {slot.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <p className="text-sm text-gray-400">{slot.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {slotImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={slot.label}
                        className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {image.uploaded && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                          ✓ Uploaded
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Photo Button */}
                  <button
                    type="button"
                    onClick={() => openFilePicker(slot.type)}
                    className="w-full aspect-[3/4] border-2 border-dashed border-gray-600 rounded-lg hover:border-pink-400 hover:bg-pink-900/30 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-pink-400"
                  >
                    <div className="flex gap-2">
                      <Camera className="w-5 h-5" />
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-center px-2">
                      {hasImage ? 'Add More' : 'Add Photo'}
                    </span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Photos */}
      <Card className="p-4 bg-gray-700/50 border-gray-600">
        <div className="space-y-3">
          <div>
            <Label className="text-base font-semibold">
              Additional Photos (Optional)
            </Label>
            <p className="text-sm text-gray-400">
              Show any additional details, special features, or unique aspects
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getImagesForType('additional').map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt="Additional"
                  className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => openFilePicker('additional')}
              className="w-full aspect-[3/4] border-2 border-dashed border-gray-600 rounded-lg hover:border-pink-400 hover:bg-pink-900/30 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-pink-400"
            >
              <div className="flex gap-2">
                <Camera className="w-5 h-5" />
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs">Add Photo</span>
            </button>
          </div>
        </div>
      </Card>

      {errors?.images && (
        <p className="text-sm text-red-500">{errors.images.message}</p>
      )}

      <div className="text-sm text-gray-400 text-center">
        <p>
          {data.images.length} photo{data.images.length !== 1 ? 's' : ''} added
          {requiredSlots.length > 0 && ` • ${requiredSlots.length} required photos`}
        </p>
      </div>
    </div>
  );
}
