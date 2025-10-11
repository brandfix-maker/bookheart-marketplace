'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { CONDITION_GUIDE } from '@/lib/tropes-data';
import { cn } from '@/lib/utils';
import { BookCondition } from '@bookheart/shared';

interface Step3Props {
  data: {
    condition: BookCondition;
    conditionNotes: string;
  };
  onChange: (data: any) => void;
  errors: any;
}

export function Step3ConditionGrading({ data, onChange, errors }: Step3Props) {
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Condition Grading
        </h2>
        <p className="text-gray-300">
          Help buyers know exactly what to expect
        </p>
      </div>

      {/* Info Panel */}
      <Card className="p-4 bg-gray-700/50 border-gray-600">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left"
          onClick={() => setShowInfo(!showInfo)}
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-white">
              Why is condition important?
            </span>
          </div>
          {showInfo ? (
            <ChevronUp className="w-5 h-5 text-blue-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-400" />
          )}
        </button>
        {showInfo && (
          <div className="mt-3 text-sm text-gray-300 space-y-2">
            <p>
              Accurate condition descriptions build trust and reduce disputes. Be honest
              about wear and damage - buyers appreciate transparency!
            </p>
            <p className="font-medium">
              Pro tip: Over-deliver on condition. It's better to under-promise and
              delight your buyer.
            </p>
          </div>
        )}
      </Card>

      {/* Condition Selection */}
      <div className="space-y-3">
        <Label>
          Book Condition <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(value: any) => onChange({ ...data, condition: value })}
        >
          <div className="space-y-3">
            {CONDITION_GUIDE.map((condition) => (
              <Card
                key={condition.value}
                className={cn(
                  'p-4 cursor-pointer transition-all',
                  data.condition === condition.value
                    ? 'border-brand-pink-500 bg-brand-pink-900/30 ring-2 ring-brand-pink-400'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:bg-gray-700'
                )}
                onClick={() => onChange({ ...data, condition: condition.value })}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={condition.value}
                    id={condition.value}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={condition.value}
                      className="font-semibold text-base cursor-pointer"
                    >
                      {condition.label}
                    </Label>
                    <p className="text-sm text-gray-300 mt-1">
                      {condition.description}
                    </p>

                    {/* Expandable Details */}
                    <button
                      type="button"
                      className="text-xs text-pink-600 mt-2 hover:text-pink-700 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCondition(
                          expandedCondition === condition.value ? null : condition.value
                        );
                      }}
                    >
                      {expandedCondition === condition.value ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Hide details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Show details
                        </>
                      )}
                    </button>

                    {expandedCondition === condition.value && (
                      <ul className="mt-2 space-y-1 text-xs text-gray-300">
                        {condition.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-brand-pink-500">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
        {errors?.condition && (
          <p className="text-sm text-red-500 mt-1">{errors.condition.message}</p>
        )}
      </div>

      {/* Condition Notes */}
      <div className="space-y-2">
        <Label htmlFor="conditionNotes">
          Detailed Condition Notes <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-gray-400">
          Be specific about any wear, marks, or imperfections. Transparency builds trust!
        </p>
        <Textarea
          id="conditionNotes"
          placeholder="Example: Spine has minor creasing from being read once. Small corner bump on bottom right. Pages are clean with no writing or highlighting. Binding is tight and secure."
          value={data.conditionNotes}
          onChange={(e) => onChange({ ...data, conditionNotes: e.target.value })}
          rows={5}
          className={errors?.conditionNotes ? 'border-red-500' : ''}
        />
        <div className="flex justify-between text-xs">
          {errors?.conditionNotes ? (
            <p className="text-red-500">{errors.conditionNotes.message}</p>
          ) : (
            <p className="text-gray-400">Minimum 20 characters</p>
          )}
          <p className="text-gray-400">{data.conditionNotes.length} characters</p>
        </div>
      </div>
    </div>
  );
}
