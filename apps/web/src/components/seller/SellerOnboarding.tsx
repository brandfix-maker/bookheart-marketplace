'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';

interface SellerOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface OnboardingData {
  displayName: string;
  bio: string;
  location: string;
  stripeAccountId?: string;
  acceptTerms: boolean;
  acceptFees: boolean;
}

export function SellerOnboarding({ isOpen, onClose, onComplete }: SellerOnboardingProps) {
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    displayName: user?.displayName || user?.username || '',
    bio: '',
    location: '',
    acceptTerms: false,
    acceptFees: false,
  });

  const totalSteps = 3;

  const handleInputChange = (field: keyof OnboardingData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!formData.acceptTerms || !formData.acceptFees) {
      return;
    }

    setIsLoading(true);
    try {
      // Update user profile with seller information
      await apiClient.patch('/auth/profile', {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
      });

      // Mark seller onboarding as completed
      await apiClient.patch('/auth/seller-onboarding', {
        completed: true,
      });

      // Refresh user data
      await refreshUser();
      
      onComplete();
      onClose();
    } catch (error) {
      console.error('Seller onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.displayName.trim().length > 0;
      case 2:
        return formData.location.trim().length > 0;
      case 3:
        return formData.acceptTerms && formData.acceptFees;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Become a Seller
          </DialogTitle>
          <DialogDescription>
            Complete your seller profile to start listing books
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1 < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`w-12 h-1 ${
                    i + 1 < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Profile Setup */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Set Up Your Seller Profile
              </h3>
              <p className="text-gray-600">
                Tell buyers about yourself and what makes your books special
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="How should buyers see your name?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell buyers about your book collection, interests, or what makes you unique..."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location & Shipping */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Location & Shipping
              </h3>
              <p className="text-gray-600">
                Set your location for local pickup and shipping calculations
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State (e.g., Austin, TX)"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This helps buyers find local pickup options
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Shipping Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• We'll help you calculate shipping costs automatically</li>
                  <li>• You can offer local pickup to save on shipping</li>
                  <li>• Buyers can choose their preferred shipping method</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Terms & Payment */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Terms & Payment Setup
              </h3>
              <p className="text-gray-600">
                Review our terms and set up payment processing
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Seller Terms</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You're responsible for accurate book descriptions and condition</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ship items within 2 business days of purchase</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Respond to buyer messages within 24 hours</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Follow our community guidelines</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Processing
                </h4>
                <p className="text-sm text-purple-800 mb-3">
                  We use Stripe for secure payment processing. You'll receive payments directly to your bank account.
                </p>
                <div className="text-sm text-purple-700">
                  <p className="font-medium mb-1">Platform Fee: 7% per sale</p>
                  <p>• Secure payment processing included</p>
                  <p>• Automatic tax handling</p>
                  <p>• Direct bank deposits</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    I agree to the seller terms and community guidelines
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptFees"
                    checked={formData.acceptFees}
                    onCheckedChange={(checked) => handleInputChange('acceptFees', checked as boolean)}
                  />
                  <Label htmlFor="acceptFees" className="text-sm">
                    I understand and accept the 7% platform fee
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
