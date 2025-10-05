'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { BookFormData, BookCondition, ROMANTASY_TROPES, SpecialEditionDetails } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { Upload, X, Heart, Star, BookOpen, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookListingFormProps {
  initialData?: Partial<BookFormData>;
  bookId?: string;
  onSuccess?: () => void;
}

const BOOK_CONDITIONS: { value: BookCondition; label: string; description: string }[] = [
  { value: 'new', label: 'New', description: 'Brand new, never read' },
  { value: 'like-new', label: 'Like New', description: 'Excellent condition, barely used' },
  { value: 'very-good', label: 'Very Good', description: 'Minor wear, no major issues' },
  { value: 'good', label: 'Good', description: 'Some wear but still readable' },
  { value: 'acceptable', label: 'Acceptable', description: 'Worn but functional' },
];

const SPICE_LEVELS = [
  { value: 0, label: 'Closed Door', description: 'No explicit content' },
  { value: 1, label: 'Mild', description: 'Light romantic tension' },
  { value: 2, label: 'Moderate', description: 'Some steamy scenes' },
  { value: 3, label: 'Hot', description: 'Explicit romantic content' },
  { value: 4, label: 'Very Hot', description: 'Very explicit content' },
  { value: 5, label: 'Extreme', description: 'Maximum explicit content' },
];

export function BookListingForm({ initialData, bookId, onSuccess }: BookListingFormProps) {
  const { user: _user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    isbn: initialData?.isbn || '',
    description: initialData?.description || '',
    seriesName: initialData?.seriesName || '',
    seriesNumber: initialData?.seriesNumber || '',
    tropes: initialData?.tropes || [],
    spiceLevel: initialData?.spiceLevel || '0',
    condition: initialData?.condition || 'like-new',
    conditionNotes: initialData?.conditionNotes || '',
    price: initialData?.price || '',
    shippingPrice: initialData?.shippingPrice || '0',
    localPickupAvailable: initialData?.localPickupAvailable || false,
    isSpecialEdition: initialData?.isSpecialEdition || false,
    specialEditionDetails: initialData?.specialEditionDetails || {
      paintedEdges: false,
      firstEdition: false,
      exclusiveCover: false,
      sprayed: false,
      customDustJacket: false,
      details: '',
    },
    images: initialData?.images || [],
    status: initialData?.status || 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof BookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTropeToggle = (trope: string) => {
    setFormData(prev => ({
      ...prev,
      tropes: prev.tropes.includes(trope)
        ? prev.tropes.filter(t => t !== trope)
        : [...prev.tropes, trope]
    }));
  };

  const handleImageUpload = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: 'Invalid files',
        description: 'Please select image files only.',
        variant: 'destructive',
      });
      return;
    }

    // Create previews
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
    setUploadedImages(prev => [...prev, ...imageFiles]);
  }, []);

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (formData.seriesNumber && (Number(formData.seriesNumber) < 1 || !Number.isInteger(Number(formData.seriesNumber)))) {
      newErrors.seriesNumber = 'Series number must be a positive integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        const formData = new FormData();
        uploadedImages.forEach((file, _index) => {
          formData.append('images', file);
        });

        const response = await apiClient.post('/images/upload-multiple', formData);

        imageUrls = response.data.map((img: any) => img.url);
      }

      // Prepare book data
      const bookData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || undefined,
        description: formData.description || undefined,
        seriesName: formData.seriesName || undefined,
        seriesNumber: formData.seriesNumber ? Number(formData.seriesNumber) : undefined,
        tropes: formData.tropes,
        spiceLevel: formData.spiceLevel ? Number(formData.spiceLevel) : undefined,
        condition: formData.condition,
        conditionNotes: formData.conditionNotes || undefined,
        priceCents: Math.round(Number(formData.price) * 100),
        shippingPriceCents: Math.round(Number(formData.shippingPrice) * 100),
        localPickupAvailable: formData.localPickupAvailable,
        isSpecialEdition: formData.isSpecialEdition,
        specialEditionDetails: formData.isSpecialEdition ? formData.specialEditionDetails : undefined,
        status,
      };

      if (bookId) {
        // Update existing book
        await apiClient.put(`/books/${bookId}`, bookData);
        toast({
          title: 'Book Updated',
          description: `Your book has been ${status === 'active' ? 'published' : 'saved as draft'}.`,
        });
      } else {
        // Create new book
        const response = await apiClient.post('/books', bookData);
        const newBookId = response.data.id;

        // Add images to the book
        for (const imageUrl of imageUrls) {
          await apiClient.post(`/books/${newBookId}/images`, {
            cloudinaryUrl: imageUrl,
            cloudinaryPublicId: '', // This would be set by the upload response
            isPrimary: imageUrls.indexOf(imageUrl) === 0,
          });
        }

        toast({
          title: 'Book Created',
          description: `Your book has been ${status === 'active' ? 'published' : 'saved as draft'}.`,
        });
      }

      onSuccess?.();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving book:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us about your book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Book Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={errors.title ? 'border-red-500' : ''}
            placeholder="Enter the book title"
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author" className="text-sm font-medium text-gray-700">
            Author *
          </Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className={errors.author ? 'border-red-500' : ''}
            placeholder="Enter the author name"
          />
          {errors.author && <p className="text-sm text-red-600">{errors.author}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="isbn" className="text-sm font-medium text-gray-700">
            ISBN (Optional)
          </Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => handleInputChange('isbn', e.target.value)}
            placeholder="978-0-123456-78-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seriesName" className="text-sm font-medium text-gray-700">
            Series Name (Optional)
          </Label>
          <Input
            id="seriesName"
            value={formData.seriesName}
            onChange={(e) => handleInputChange('seriesName', e.target.value)}
            placeholder="e.g., A Court of Thorns and Roses"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seriesNumber" className="text-sm font-medium text-gray-700">
          Book Number in Series (Optional)
        </Label>
        <Input
          id="seriesNumber"
          type="number"
          value={formData.seriesNumber}
          onChange={(e) => handleInputChange('seriesNumber', e.target.value)}
          className={errors.seriesNumber ? 'border-red-500' : ''}
          placeholder="1"
          min="1"
        />
        {errors.seriesNumber && <p className="text-sm text-red-600">{errors.seriesNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={errors.description ? 'border-red-500' : ''}
          placeholder="Describe the book's condition, any special features, or why someone should buy it..."
          rows={4}
        />
        <div className="text-xs text-gray-500">
          {formData.description.length}/2000 characters
        </div>
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Romantasy Details</h2>
        <p className="text-gray-600">Help readers find the perfect book</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Tropes & Themes
          </Label>
          <p className="text-sm text-gray-500">Select all that apply (helps with discoverability)</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
            {ROMANTASY_TROPES.map((trope) => (
              <label key={trope} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.tropes.includes(trope)}
                  onCheckedChange={() => handleTropeToggle(trope)}
                />
                <span className="text-sm text-gray-700 capitalize">
                  {trope.replace(/-/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spiceLevel" className="text-sm font-medium text-gray-700">
            Spice Level
          </Label>
          <Select value={formData.spiceLevel} onValueChange={(value) => handleInputChange('spiceLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select spice level" />
            </SelectTrigger>
            <SelectContent>
              {SPICE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value.toString()}>
                  <div>
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-gray-500">{level.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Condition & Pricing</h2>
        <p className="text-gray-600">Set the price and describe the condition</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
            Book Condition *
          </Label>
          <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
            <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {BOOK_CONDITIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  <div>
                    <div className="font-medium">{condition.label}</div>
                    <div className="text-sm text-gray-500">{condition.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-sm text-red-600">{errors.condition}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price (USD) *
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditionNotes" className="text-sm font-medium text-gray-700">
          Condition Notes
        </Label>
        <Textarea
          id="conditionNotes"
          value={formData.conditionNotes}
          onChange={(e) => handleInputChange('conditionNotes', e.target.value)}
          placeholder="Any specific details about the book's condition..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="shippingPrice" className="text-sm font-medium text-gray-700">
            Shipping Cost (USD)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="shippingPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.shippingPrice}
              onChange={(e) => handleInputChange('shippingPrice', e.target.value)}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="localPickup"
              checked={formData.localPickupAvailable}
              onCheckedChange={(checked) => handleInputChange('localPickupAvailable', checked)}
            />
            <Label htmlFor="localPickup" className="text-sm font-medium text-gray-700">
              Local Pickup Available
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Special Edition Details</h2>
        <p className="text-gray-600">Is this a special edition book?</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSpecialEdition"
            checked={formData.isSpecialEdition}
            onCheckedChange={(checked) => handleInputChange('isSpecialEdition', checked)}
          />
          <Label htmlFor="isSpecialEdition" className="text-sm font-medium text-gray-700">
            This is a special edition book
          </Label>
        </div>

        {formData.isSpecialEdition && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-900">Special Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'paintedEdges', label: 'Painted Edges' },
                { key: 'signedCopy', label: 'Signed Copy' },
                { key: 'firstEdition', label: 'First Edition' },
                { key: 'exclusiveCover', label: 'Exclusive Cover' },
                { key: 'sprayed', label: 'Sprayed Edges' },
                { key: 'customDustJacket', label: 'Custom Dust Jacket' },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.key}
                    checked={formData.specialEditionDetails[feature.key as keyof SpecialEditionDetails] as boolean}
                    onCheckedChange={(checked) => 
                      handleInputChange('specialEditionDetails', {
                        ...formData.specialEditionDetails,
                        [feature.key]: checked
                      })
                    }
                  />
                  <Label htmlFor={feature.key} className="text-sm text-gray-700">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialDetails" className="text-sm font-medium text-gray-700">
                Additional Details
              </Label>
              <Textarea
                id="specialDetails"
                value={formData.specialEditionDetails.details || ''}
                onChange={(e) => 
                  handleInputChange('specialEditionDetails', {
                    ...formData.specialEditionDetails,
                    details: e.target.value
                  })
                }
                placeholder="Any additional details about the special edition..."
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Images</h2>
        <p className="text-gray-600">Upload photos of your book (up to 10 images)</p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="imageUpload"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="hidden"
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Upload Images</p>
            <p className="text-sm text-gray-500">Click to select images or drag and drop</p>
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Basic Info', icon: BookOpen },
    { number: 2, title: 'Romantasy', icon: Heart },
    { number: 3, title: 'Condition', icon: Star },
    { number: 4, title: 'Special Edition', icon: Sparkles },
    { number: 5, title: 'Images', icon: Upload },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span key={step.number} className={`text-sm ${
                currentStep >= step.number ? 'text-purple-600 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex space-x-4">
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSubmit('draft')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save as Draft'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSubmit('active')}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Book'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
