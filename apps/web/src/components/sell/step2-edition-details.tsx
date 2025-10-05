'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { SUBSCRIPTION_BOXES } from '@/lib/tropes-data';
import { cn } from '@/lib/utils';

interface Step2Props {
  data: {
    editionType: 'special' | 'first' | 'standard';
    subscriptionBoxes: string[];
    isSigned: boolean;
    signatureType?: string;
    specialFeatures: {
      paintedEdges: boolean;
      paintedEdgesColor?: string;
      dustJacket: boolean;
      firstEdition: boolean;
      exclusiveCover: boolean;
    };
    additionalDetails?: string;
  };
  onChange: (data: any) => void;
  errors: any;
}

export function Step2EditionDetails({ data, onChange, errors }: Step2Props) {
  const toggleSubscriptionBox = (box: string) => {
    const boxes = data.subscriptionBoxes.includes(box)
      ? data.subscriptionBoxes.filter((b) => b !== box)
      : [...data.subscriptionBoxes, box];
    onChange({ ...data, subscriptionBoxes: boxes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Edition Details
        </h2>
        <p className="text-gray-300">
          Tell us what makes this edition special
        </p>
      </div>

      {/* Edition Type */}
      <div className="space-y-3">
        <Label>Edition Type</Label>
        <RadioGroup
          value={data.editionType}
          onValueChange={(value: any) => onChange({ ...data, editionType: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="special" id="special" />
            <Label htmlFor="special" className="font-normal cursor-pointer">
              Special Edition
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="first" id="first" />
            <Label htmlFor="first" className="font-normal cursor-pointer">
              First Edition
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="font-normal cursor-pointer">
              Standard Edition
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Subscription Boxes */}
      <div className="space-y-3">
        <Label>From a Subscription Box?</Label>
        <p className="text-sm text-gray-400">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SUBSCRIPTION_BOXES.map((box) => (
            <Card
              key={box.value}
              className={cn(
                'p-3 cursor-pointer transition-all hover:shadow-md',
                data.subscriptionBoxes.includes(box.value)
                  ? 'border-pink-500 bg-pink-900/30'
                  : 'border-gray-600 bg-gray-700/50'
              )}
              onClick={() => toggleSubscriptionBox(box.value)}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{box.logo}</div>
                <div className="text-xs font-medium">{box.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Signed */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="signed"
            checked={data.isSigned}
            onCheckedChange={(checked) =>
              onChange({ ...data, isSigned: checked as boolean })
            }
          />
          <Label htmlFor="signed" className="font-medium cursor-pointer">
            Is it signed?
          </Label>
        </div>

        {data.isSigned && (
          <div className="ml-6 space-y-2">
            <Label>Signature Type</Label>
            <RadioGroup
              value={data.signatureType}
              onValueChange={(value) => onChange({ ...data, signatureType: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hand" id="hand" />
                <Label htmlFor="hand" className="font-normal cursor-pointer">
                  Hand Signature
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bookplate" id="bookplate" />
                <Label htmlFor="bookplate" className="font-normal cursor-pointer">
                  Bookplate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="digital" id="digital" />
                <Label htmlFor="digital" className="font-normal cursor-pointer">
                  Digital/Pre-signed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Special Features */}
      <div className="space-y-3">
        <Label>Special Features</Label>
        <div className="space-y-3 p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paintedEdges"
              checked={data.specialFeatures.paintedEdges}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  specialFeatures: {
                    ...data.specialFeatures,
                    paintedEdges: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="paintedEdges" className="font-normal cursor-pointer">
              Painted Edges
            </Label>
          </div>

          {data.specialFeatures.paintedEdges && (
            <div className="ml-6">
              <Input
                placeholder="Specify color (e.g., purple, gold sprayed)"
                value={data.specialFeatures.paintedEdgesColor || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    specialFeatures: {
                      ...data.specialFeatures,
                      paintedEdgesColor: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dustJacket"
              checked={data.specialFeatures.dustJacket}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  specialFeatures: {
                    ...data.specialFeatures,
                    dustJacket: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="dustJacket" className="font-normal cursor-pointer">
              Dust Jacket Included
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="firstEdition"
              checked={data.specialFeatures.firstEdition}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  specialFeatures: {
                    ...data.specialFeatures,
                    firstEdition: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="firstEdition" className="font-normal cursor-pointer">
              First Edition
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclusiveCover"
              checked={data.specialFeatures.exclusiveCover}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  specialFeatures: {
                    ...data.specialFeatures,
                    exclusiveCover: checked as boolean,
                  },
                })
              }
            />
            <Label htmlFor="exclusiveCover" className="font-normal cursor-pointer">
              Exclusive Cover Art
            </Label>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-2">
        <Label htmlFor="additionalDetails">
          Additional Special Edition Details (Optional)
        </Label>
        <Textarea
          id="additionalDetails"
          placeholder="Any other special features? Limited edition number, exclusive bookmarks, etc."
          value={data.additionalDetails || ''}
          onChange={(e) => onChange({ ...data, additionalDetails: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
