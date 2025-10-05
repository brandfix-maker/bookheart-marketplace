'use client';

import { useState, useEffect } from 'react';
import { X, Info, DollarSign, Package, Star, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TROPES_DATA, TROPE_CATEGORIES, SUBSCRIPTION_BOXES, CONDITION_GUIDE } from '@/lib/tropes-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterState {
  priceMin?: number;
  priceMax?: number;
  condition?: string[];
  editionType?: string[];
  subscriptionBoxes?: string[];
  tropes?: string[];
  location?: {
    zipCode?: string;
    radius?: number;
  };
  sellerRating?: number;
  specialFeatures?: string[];
  isSigned?: boolean;
  localPickupOnly?: boolean;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: FilterPanelProps) {
  const [searchTropes, setSearchTropes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTropes = TROPES_DATA.filter((trope) => {
    const matchesSearch = trope.label.toLowerCase().includes(searchTropes.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || trope.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({
      ...filters,
      ...(field === 'min' ? { priceMin: numValue } : { priceMax: numValue }),
    });
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    onFiltersChange({ ...filters, [key]: newArray });
  };

  const toggleBooleanFilter = (key: keyof FilterState) => {
    onFiltersChange({ ...filters, [key]: !filters[key] });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.condition?.length) count += filters.condition.length;
    if (filters.editionType?.length) count += filters.editionType.length;
    if (filters.subscriptionBoxes?.length) count += filters.subscriptionBoxes.length;
    if (filters.tropes?.length) count += filters.tropes.length;
    if (filters.location?.zipCode) count++;
    if (filters.sellerRating) count++;
    if (filters.specialFeatures?.length) count += filters.specialFeatures.length;
    if (filters.isSigned) count++;
    if (filters.localPickupOnly) count++;
    return count;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            {getActiveFilterCount() > 0 && (
              <Badge variant="default" className="bg-purple-600">
                {getActiveFilterCount()}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Price Range */}
          <div>
            <Label className="flex items-center gap-2 text-base font-semibold mb-3">
              <DollarSign className="h-4 w-4" />
              Price Range
            </Label>
            <div className="flex items-center gap-2 mb-3">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="flex-1"
                min="0"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="flex-1"
                min="0"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Under $20', min: 0, max: 20 },
                { label: '$20-$40', min: 20, max: 40 },
                { label: '$40-$60', min: 40, max: 60 },
                { label: '$60+', min: 60, max: undefined },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      priceMin: preset.min,
                      priceMax: preset.max,
                    })
                  }
                  className={`${
                    filters.priceMin === preset.min && filters.priceMax === preset.max
                      ? 'bg-purple-50 border-purple-600'
                      : ''
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <Label className="flex items-center gap-2 text-base font-semibold mb-3">
              <Package className="h-4 w-4" />
              Condition
            </Label>
            <div className="space-y-2">
              {CONDITION_GUIDE.map((cond) => (
                <div key={cond.value} className="flex items-start gap-2">
                  <Checkbox
                    id={`condition-${cond.value}`}
                    checked={filters.condition?.includes(cond.value) || false}
                    onCheckedChange={() => toggleArrayFilter('condition', cond.value)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`condition-${cond.value}`}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {cond.label}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">{cond.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edition Type */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Edition Type</Label>
            <div className="space-y-2">
              {[
                { value: 'special', label: 'Special Edition' },
                { value: 'first', label: 'First Edition' },
                { value: 'signed', label: 'Signed' },
                { value: 'standard', label: 'Standard' },
              ].map((edition) => (
                <div key={edition.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`edition-${edition.value}`}
                    checked={filters.editionType?.includes(edition.value) || false}
                    onCheckedChange={() => toggleArrayFilter('editionType', edition.value)}
                  />
                  <label
                    htmlFor={`edition-${edition.value}`}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {edition.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Boxes */}
          <div>
            <Label className="flex items-center gap-2 text-base font-semibold mb-3">
              <Sparkles className="h-4 w-4" />
              Subscription Boxes
            </Label>
            <div className="space-y-2">
              {SUBSCRIPTION_BOXES.map((box) => (
                <div key={box.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`box-${box.value}`}
                    checked={filters.subscriptionBoxes?.includes(box.value) || false}
                    onCheckedChange={() => toggleArrayFilter('subscriptionBoxes', box.value)}
                  />
                  <label
                    htmlFor={`box-${box.value}`}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    <span>{box.logo}</span>
                    <span>{box.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tropes */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Tropes</Label>
            <Input
              type="text"
              placeholder="Search tropes..."
              value={searchTropes}
              onChange={(e) => setSearchTropes(e.target.value)}
              className="mb-2"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="mb-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TROPE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.tropes && filters.tropes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {filters.tropes.map((trope) => (
                  <Badge
                    key={trope}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('tropes', trope)}
                  >
                    {TROPES_DATA.find((t) => t.value === trope)?.label || trope}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredTropes.map((trope) => (
                <div key={trope.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`trope-${trope.value}`}
                    checked={filters.tropes?.includes(trope.value) || false}
                    onCheckedChange={() => toggleArrayFilter('tropes', trope.value)}
                  />
                  <label
                    htmlFor={`trope-${trope.value}`}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {trope.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="flex items-center gap-2 text-base font-semibold mb-3">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              type="text"
              placeholder="Zip code"
              value={filters.location?.zipCode || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  location: { ...filters.location, zipCode: e.target.value },
                })
              }
              className="mb-3"
            />
            <Label className="text-sm text-gray-600 mb-2 block">Radius (miles)</Label>
            <Select
              value={filters.location?.radius?.toString() || ''}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  location: { ...filters.location, radius: parseInt(value) },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100, 250, 500].map((radius) => (
                  <SelectItem key={radius} value={radius.toString()}>
                    {radius} miles
                  </SelectItem>
                ))}
                <SelectItem value="999999">Nationwide</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 mt-3">
              <Checkbox
                id="local-pickup"
                checked={filters.localPickupOnly || false}
                onCheckedChange={() => toggleBooleanFilter('localPickupOnly')}
              />
              <label
                htmlFor="local-pickup"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Local Pickup Only
              </label>
            </div>
          </div>

          {/* Seller Rating */}
          <div>
            <Label className="flex items-center gap-2 text-base font-semibold mb-3">
              <Star className="h-4 w-4" />
              Seller Rating
            </Label>
            <Select
              value={filters.sellerRating?.toString() || 'any'}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, sellerRating: value === 'any' ? undefined : parseFloat(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any rating</SelectItem>
                <SelectItem value="4">4+ stars</SelectItem>
                <SelectItem value="3">3+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special Features */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Special Features</Label>
            <div className="space-y-2">
              {[
                { value: 'paintedEdges', label: 'Painted Edges' },
                { value: 'dustJacket', label: 'Dust Jacket' },
                { value: 'acceptsOffers', label: 'Accepting Offers' },
              ].map((feature) => (
                <div key={feature.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`feature-${feature.value}`}
                    checked={filters.specialFeatures?.includes(feature.value) || false}
                    onCheckedChange={() => toggleArrayFilter('specialFeatures', feature.value)}
                  />
                  <label
                    htmlFor={`feature-${feature.value}`}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <Button onClick={onApply} className="w-full" size="lg">
            Apply Filters
          </Button>
          <Button onClick={onClear} variant="outline" className="w-full" size="lg">
            Clear All
          </Button>
        </div>
      </div>
    </>
  );
}

