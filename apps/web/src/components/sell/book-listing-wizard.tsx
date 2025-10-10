'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, Sparkles } from 'lucide-react';
// form resolver imports removed (not used in this component)
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';
import { BookWizardData } from '@/types/book-wizard';
import {
  bookIdentificationSchema,
  editionDetailsSchema,
  conditionGradingSchema,
  photosSchema,
  tropesAndTagsSchema,
  pricingAndShippingSchema,
  yourStorySchema,
} from '@/lib/book-wizard-validation';
import { WizardProgress } from './wizard-progress';
import { Step1BookIdentification } from './step1-book-identification';
import { Step2EditionDetails } from './step2-edition-details';
import { Step3ConditionGrading } from './step3-condition-grading';
import { Step4PhotoUpload } from './step4-photo-upload';
import { Step5TropesAndTags } from './step5-tropes-tags';
import { Step6PricingAndShipping } from './step6-pricing-shipping';
import { Step7YourStory } from './step7-your-story';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';

const STEPS = [
  { number: 1, schema: bookIdentificationSchema },
  { number: 2, schema: editionDetailsSchema },
  { number: 3, schema: conditionGradingSchema },
  { number: 4, schema: photosSchema },
  { number: 5, schema: tropesAndTagsSchema },
  { number: 6, schema: pricingAndShippingSchema },
  { number: 7, schema: yourStorySchema },
];

const INITIAL_DATA: BookWizardData = {
  bookIdentification: {
    searchMethod: 'api',
    title: '',
    author: '',
    isbn: '',
    seriesName: '',
    seriesNumber: '',
  },
  editionDetails: {
    editionType: 'standard',
    subscriptionBoxes: [],
    isSigned: false,
    specialFeatures: {
      paintedEdges: false,
      dustJacket: false,
      firstEdition: false,
      exclusiveCover: false,
    },
  },
  conditionGrading: {
    condition: 'like-new',
    conditionNotes: '',
  },
  photos: {
    images: [],
  },
  tropesAndTags: {
    tropes: [],
    spiceLevel: 0,
  },
  pricingAndShipping: {
    price: '',
    acceptsOffers: false,
    enableAuction: false,
    shippingPrice: '4.99',
    localPickupAvailable: false,
    allowBundles: false,
  },
  yourStory: {
    description: '',
  },
};

interface BookListingWizardProps {
  draftId?: string;
}

export function BookListingWizard({ draftId }: BookListingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [wizardData, setWizardData] = useState<BookWizardData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [listingId, setListingId] = useState<string>('');
  const [errors, setErrors] = useState<any>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { width, height } = useWindowSize();

  // Load draft if editing
  useEffect(() => {
    if (draftId) {
      loadDraft(draftId);
    }
  }, [draftId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      saveDraft(true);
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [wizardData, hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadDraft = async (id: string) => {
    try {
      const response = await apiClient.get(`/books/drafts/${id}`);
      if (response.data) {
        // Transform API response to wizard data format
        setWizardData(transformApiToWizardData(response.data));
        toast({
          title: 'Draft loaded',
          description: 'Continue where you left off',
        });
      }
    } catch (error) {
      toast({
        title: 'Error loading draft',
        description: 'Starting with a fresh listing',
        variant: 'destructive',
      });
    }
  };

  const saveDraft = async (isAutoSave = false) => {
    setIsSavingDraft(true);
    try {
      const payload = transformWizardDataToApi(wizardData, 'draft');
      await apiClient.post('/books/drafts', payload);
      
      if (!isAutoSave) {
        toast({
          title: 'Draft saved',
          description: 'You can continue editing later',
        });
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      toast({
        title: 'Error saving draft',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const validateStep = async (step: number) => {
    const stepKey = [
      'bookIdentification',
      'editionDetails',
      'conditionGrading',
      'photos',
      'tropesAndTags',
      'pricingAndShipping',
      'yourStory',
    ][step - 1] as keyof BookWizardData;

    const schema = STEPS[step - 1].schema;
    const data = wizardData[stepKey];

    try {
      await schema.parseAsync(data);
      setErrors((prev: any) => ({ ...prev, [stepKey]: null }));
      return true;
    } catch (error: any) {
      const fieldErrors: any = {};
      error.errors?.forEach((err: any) => {
        fieldErrors[err.path[0]] = { message: err.message };
      });
      setErrors((prev: any) => ({ ...prev, [stepKey]: fieldErrors }));
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast({
        title: 'Please fix the errors',
        description: 'Some required fields are missing or invalid',
        variant: 'destructive',
      });
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStepDataChange = (stepKey: keyof BookWizardData, data: any) => {
    setWizardData((prev) => ({
      ...prev,
      [stepKey]: data,
    }));
    setHasUnsavedChanges(true);
  };

  const handlePublish = async () => {
    // Validate all steps
    for (let i = 1; i <= 7; i++) {
      const isValid = await validateStep(i);
      if (!isValid) {
        toast({
          title: 'Please complete all steps',
          description: `Step ${i} has errors`,
          variant: 'destructive',
        });
        setCurrentStep(i);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Upload images to Cloudinary first
      const uploadedImages = await uploadImagesToCloudinary(wizardData.photos.images);

      // Create the listing
      const payload = transformWizardDataToApi(
        { ...wizardData, photos: { images: uploadedImages } },
        'active'
      );
      const response = await apiClient.post('/books', payload);

      if (response.success && response.data) {
        setListingId(response.data.id);
        setShowSuccess(true);
        setHasUnsavedChanges(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error publishing listing',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadImagesToCloudinary = async (images: any[]) => {
    // This would integrate with Cloudinary SDK
    // For now, return mock uploaded images
    return images.map((img) => ({
      ...img,
      uploaded: true,
      cloudinaryUrl: img.preview,
      cloudinaryPublicId: `book-${Date.now()}-${img.id}`,
    }));
  };

  const transformWizardDataToApi = (data: BookWizardData, status: 'draft' | 'active') => {
    return {
      title: data.bookIdentification.title,
      author: data.bookIdentification.author,
      isbn: data.bookIdentification.isbn,
      seriesName: data.bookIdentification.seriesName,
      seriesNumber: data.bookIdentification.seriesNumber
        ? parseInt(data.bookIdentification.seriesNumber)
        : undefined,
      condition: data.conditionGrading.condition,
      conditionNotes: data.conditionGrading.conditionNotes,
      description: data.yourStory.description,
      priceCents: Math.round(parseFloat(data.pricingAndShipping.price) * 100),
      shippingPriceCents: Math.round(
        parseFloat(data.pricingAndShipping.shippingPrice) * 100
      ),
      acceptsOffers: data.pricingAndShipping.acceptsOffers,
      localPickupAvailable: data.pricingAndShipping.localPickupAvailable,
      zipCode: data.pricingAndShipping.zipCode,
      isSpecialEdition: data.editionDetails.editionType !== 'standard',
      subscriptionBox: data.editionDetails.subscriptionBoxes[0],
      isSigned: data.editionDetails.isSigned,
      signatureType: data.editionDetails.signatureType,
      specialEditionDetails: {
        ...data.editionDetails.specialFeatures,
        details: data.editionDetails.additionalDetails,
      },
      tropes: data.tropesAndTags.tropes,
      spiceLevel: data.tropesAndTags.spiceLevel,
      status,
      images: data.photos.images.map((img, index) => ({
        cloudinaryUrl: img.cloudinaryUrl || img.preview,
        cloudinaryPublicId: img.cloudinaryPublicId || img.id,
        altText: `${data.bookIdentification.title} - Image ${index + 1}`,
        isPrimary: index === 0,
        order: index,
      })),
    };
  };

  const transformApiToWizardData = (_apiData: any): BookWizardData => {
    // Transform API response back to wizard format
    return INITIAL_DATA; // Implement transformation
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
        <Card className="max-w-2xl w-full p-8 text-center space-y-6 bg-gray-800/95 backdrop-blur-sm border-gray-700">
          <div className="flex justify-center">
            <Sparkles className="w-20 h-20 text-pink-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            ✨ Your listing is live! ✨
          </h1>
          <p className="text-xl text-gray-300">
            Listing ID: <span className="font-mono font-semibold">BH-2025-{listingId.slice(0, 6)}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => router.push(`/book/${listingId}`)} size="lg">
              View Your Listing
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccess(false);
                setWizardData(INITIAL_DATA);
                setCurrentStep(1);
                setCompletedSteps([]);
              }}
              size="lg"
            >
              List Another Book
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>
          <div className="pt-6 border-t">
            <p className="text-sm text-gray-400">Share your listing:</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/book/${listingId}`
                );
                toast({ title: 'Link copied!', description: 'Share with your community' });
              }}
            >
              Copy Link
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentStepKey = [
    'bookIdentification',
    'editionDetails',
    'conditionGrading',
    'photos',
    'tropesAndTags',
    'pricingAndShipping',
    'yourStory',
  ][currentStep - 1] as keyof BookWizardData;

  const currentErrors = errors[currentStepKey] || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-800/95 backdrop-blur-sm rounded-lg">
      <WizardProgress currentStep={currentStep} completedSteps={completedSteps} />

      <Card className="p-6 md:p-8 mt-6 bg-gray-800/95 backdrop-blur-sm border-gray-700">
        {currentStep === 1 && (
          <Step1BookIdentification
            data={wizardData.bookIdentification}
            onChange={(data) => handleStepDataChange('bookIdentification', data)}
            errors={currentErrors}
          />
        )}
        {currentStep === 2 && (
          <Step2EditionDetails
            data={wizardData.editionDetails}
            onChange={(data) => handleStepDataChange('editionDetails', data)}
            errors={currentErrors}
          />
        )}
        {currentStep === 3 && (
          <Step3ConditionGrading
            data={wizardData.conditionGrading}
            onChange={(data) => handleStepDataChange('conditionGrading', data)}
            errors={currentErrors}
          />
        )}
        {currentStep === 4 && (
          <Step4PhotoUpload
            data={wizardData.photos}
            onChange={(data) => handleStepDataChange('photos', data)}
            errors={currentErrors}
            isSigned={wizardData.editionDetails.isSigned}
          />
        )}
        {currentStep === 5 && (
          <Step5TropesAndTags
            data={wizardData.tropesAndTags}
            onChange={(data) => handleStepDataChange('tropesAndTags', data)}
            errors={currentErrors}
            subscriptionBoxes={wizardData.editionDetails.subscriptionBoxes}
          />
        )}
        {currentStep === 6 && (
          <Step6PricingAndShipping
            data={wizardData.pricingAndShipping}
            onChange={(data) => handleStepDataChange('pricingAndShipping', data)}
            errors={currentErrors}
            condition={wizardData.conditionGrading.condition}
            editionType={wizardData.editionDetails.editionType}
            subscriptionBox={wizardData.editionDetails.subscriptionBoxes[0]}
          />
        )}
        {currentStep === 7 && (
          <Step7YourStory
            data={wizardData.yourStory}
            onChange={(data) => handleStepDataChange('yourStory', data)}
            errors={currentErrors}
            previewData={{
              title: wizardData.bookIdentification.title,
              author: wizardData.bookIdentification.author,
              price: wizardData.pricingAndShipping.price,
              shippingPrice: wizardData.pricingAndShipping.shippingPrice,
              condition: wizardData.conditionGrading.condition,
              tropes: wizardData.tropesAndTags.tropes,
            }}
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => saveDraft()}
            disabled={isSavingDraft}
            className="flex-1 sm:flex-none"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>

        <div className="flex gap-2">
          {currentStep < 7 ? (
            <Button onClick={handleNext} className="flex-1 sm:flex-none">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-gradient-to-r from-pink-600 to-purple-600"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {hasUnsavedChanges && !isSavingDraft && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Auto-saving in progress...
        </p>
      )}
    </div>
  );
}
