'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { number: 1, label: 'Book Details', shortLabel: 'Details' },
  { number: 2, label: 'Edition Info', shortLabel: 'Edition' },
  { number: 3, label: 'Condition', shortLabel: 'Condition' },
  { number: 4, label: 'Photos', shortLabel: 'Photos' },
  { number: 5, label: 'Tropes & Tags', shortLabel: 'Tags' },
  { number: 6, label: 'Pricing', shortLabel: 'Pricing' },
  { number: 7, label: 'Your Story', shortLabel: 'Story' },
];

interface WizardProgressProps {
  currentStep: number;
  completedSteps: number[];
}

export function WizardProgress({ currentStep, completedSteps }: WizardProgressProps) {
  return (
    <div className="w-full py-6">
      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-200">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm text-gray-400">
            {STEPS[currentStep - 1].label}
          </span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-brand-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                    currentStep === step.number &&
                      'bg-gradient-to-r from-brand-pink-500 to-purple-600 text-white ring-4 ring-pink-100',
                    completedSteps.includes(step.number) &&
                      currentStep !== step.number &&
                      'bg-green-500 text-white',
                    !completedSteps.includes(step.number) &&
                      currentStep !== step.number &&
                      'bg-gray-600 text-gray-400'
                  )}
                >
                  {completedSteps.includes(step.number) && currentStep !== step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium text-center',
                    currentStep === step.number && 'text-pink-600',
                    completedSteps.includes(step.number) &&
                      currentStep !== step.number &&
                      'text-green-600',
                    !completedSteps.includes(step.number) &&
                      currentStep !== step.number &&
                      'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative top-[-16px]">
                  <div
                    className={cn(
                      'h-full transition-all',
                      completedSteps.includes(step.number)
                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                        : 'bg-gray-600'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
