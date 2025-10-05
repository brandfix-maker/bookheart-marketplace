'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Search } from 'lucide-react';
import { TROPES_DATA, TROPE_CATEGORIES } from '@/lib/tropes-data';
import { cn } from '@/lib/utils';

interface Step5Props {
  data: {
    tropes: string[];
    spiceLevel: number;
  };
  onChange: (data: any) => void;
  errors: any;
  subscriptionBoxes?: string[];
}

export function Step5TropesAndTags({ data, onChange, errors, subscriptionBoxes }: Step5Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleTrope = (trope: string) => {
    const tropes = data.tropes.includes(trope)
      ? data.tropes.filter((t) => t !== trope)
      : [...data.tropes, trope];
    onChange({ ...data, tropes });
  };

  const filteredTropes = TROPES_DATA.filter((trope) => {
    const matchesCategory =
      selectedCategory === 'all' || trope.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      trope.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Tropes & Tags
        </h2>
        <p className="text-gray-600">Help readers find your perfect book</p>
      </div>

      {/* Subscription Box Tags (auto-applied) */}
      {subscriptionBoxes && subscriptionBoxes.length > 0 && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <Label className="text-sm font-medium text-purple-900 mb-2 block">
            Auto-tagged from subscription boxes:
          </Label>
          <div className="flex flex-wrap gap-2">
            {subscriptionBoxes.map((box) => (
              <Badge
                key={box}
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                {box}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Trope Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tropes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {TROPE_CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category.value
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Tropes */}
      {data.tropes.length > 0 && (
        <Card className="p-4 bg-pink-50 border-pink-200">
          <Label className="text-sm font-medium text-pink-900 mb-2 block">
            Selected Tropes ({data.tropes.length}):
          </Label>
          <div className="flex flex-wrap gap-2">
            {data.tropes.map((tropeValue) => {
              const trope = TROPES_DATA.find((t) => t.value === tropeValue);
              return (
                <Badge
                  key={tropeValue}
                  variant="secondary"
                  className="bg-pink-100 text-pink-700 cursor-pointer hover:bg-pink-200"
                  onClick={() => toggleTrope(tropeValue)}
                >
                  {trope?.label || tropeValue}
                  <span className="ml-1 text-pink-900">×</span>
                </Badge>
              );
            })}
          </div>
        </Card>
      )}

      {/* Trope Grid */}
      <div className="space-y-2">
        <Label>
          Select Tropes <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto p-2">
          {filteredTropes.map((trope) => {
            const isSelected = data.tropes.includes(trope.value);
            return (
              <button
                key={trope.value}
                type="button"
                onClick={() => toggleTrope(trope.value)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all text-left',
                  isSelected
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
                )}
              >
                {trope.label}
              </button>
            );
          })}
        </div>
        {errors?.tropes && (
          <p className="text-sm text-red-500 mt-1">{errors.tropes.message}</p>
        )}
      </div>

      {/* Spice Level */}
      <div className="space-y-3">
        <Label>Spice Level</Label>
        <p className="text-sm text-gray-500">
          How steamy is this book? (0 = Closed door, 5 = Extremely spicy)
        </p>
        <div className="flex items-center gap-4">
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ ...data, spiceLevel: level })}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg transition-all',
                data.spiceLevel === level
                  ? 'bg-red-100 border-2 border-red-500'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < level
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  data.spiceLevel === level ? 'text-red-700' : 'text-gray-600'
                )}
              >
                {level === 0 ? 'None' : level}
              </span>
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <p>0 = Closed door / Fade to black</p>
          <p>1-2 = Sweet romance / Kissing</p>
          <p>3 = Moderate heat / Some explicit scenes</p>
          <p>4-5 = Very spicy / Explicit throughout</p>
        </div>
      </div>
    </div>
  );
}
