'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Info } from 'lucide-react';

interface Step7Props {
  data: {
    description: string;
  };
  onChange: (data: any) => void;
  errors: any;
  previewData?: any;
}

export function Step7YourStory({ data, onChange, errors, previewData }: Step7Props) {
  const [showPreview, setShowPreview] = useState(false);

  const insertEmoji = (emoji: string) => {
    const newText = data.description + emoji;
    onChange({ ...data, description: newText });
  };

  const applyFormatting = (format: 'bold' | 'italic') => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = data.description.substring(start, end);

    if (!selectedText) return;

    let formattedText = '';
    if (format === 'bold') {
      formattedText = `**${selectedText}**`;
    } else if (format === 'italic') {
      formattedText = `*${selectedText}*`;
    }

    const newText =
      data.description.substring(0, start) +
      formattedText +
      data.description.substring(end);

    onChange({ ...data, description: newText });
  };

  const renderFormattedText = (text: string) => {
    // Simple markdown-like rendering for preview
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Story
        </h2>
        <p className="text-gray-600">
          Tell buyers why you're parting with this treasure
        </p>
      </div>

      <Card className="p-4 bg-primary/10 border-primary/30 backdrop-blur-sm">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-foreground">
            <p>
              <strong>Share your connection:</strong> Was this your favorite cozy read? A
              reread you're ready to pass on? Personal stories help buyers connect with
              your book!
            </p>
          </div>
        </div>
      </Card>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 border-r pr-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('bold')}
            title="Bold (select text first)"
          >
            <strong>B</strong>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('italic')}
            title="Italic (select text first)"
          >
            <em>I</em>
          </Button>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertEmoji('💖')}
          >
            💖
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertEmoji('📚')}
          >
            📚
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertEmoji('✨')}
          >
            ✨
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertEmoji('🌙')}
          >
            🌙
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertEmoji('🔥')}
          >
            🔥
          </Button>
        </div>
      </div>

      {/* Description Editor */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Your Story <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Example: This book got me through a tough time and holds a special place in my heart. I've read it twice and loved every page! The cover art is stunning, and the sprayed edges are perfection. Ready to share it with someone who will love it as much as I did. ✨"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={8}
          maxLength={1000}
          className={`bg-input/50 backdrop-blur-sm border-border/50 ${errors?.description ? 'border-red-500' : ''}`}
        />
        <div className="flex justify-between text-xs">
          {errors?.description ? (
            <p className="text-red-500">{errors.description.message}</p>
          ) : (
            <p className="text-gray-500">Minimum 50 characters, maximum 1000</p>
          )}
          <p
            className={
              data.description.length > 1000
                ? 'text-red-500'
                : data.description.length < 50
                ? 'text-gray-400'
                : 'text-green-600'
            }
          >
            {data.description.length} / 1000
          </p>
        </div>
      </div>

      {/* Preview Toggle */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowPreview(!showPreview)}
        className="w-full"
      >
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </Button>

      {/* Preview Pane */}
      {showPreview && (
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/30">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            How Your Listing Will Appear
          </h3>
          <div className="space-y-4">
            {/* Book Title Preview */}
            {previewData?.title && (
              <div>
                <h4 className="text-2xl font-serif font-bold text-gray-900">
                  {previewData.title}
                </h4>
                {previewData.author && (
                  <p className="text-lg text-gray-600">by {previewData.author}</p>
                )}
              </div>
            )}

            {/* Price Preview */}
            {previewData?.price && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-pink-600">
                  ${parseFloat(previewData.price).toFixed(2)}
                </span>
                {previewData.shippingPrice && (
                  <span className="text-sm text-gray-500">
                    + ${parseFloat(previewData.shippingPrice).toFixed(2)} shipping
                  </span>
                )}
              </div>
            )}

            {/* Condition Preview */}
            {previewData?.condition && (
              <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {previewData.condition.replace('-', ' ').toUpperCase()}
              </div>
            )}

            {/* Description Preview */}
            {data.description && (
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900">Seller's Story:</h5>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: renderFormattedText(data.description),
                  }}
                />
              </div>
            )}

            {/* Tropes Preview */}
            {previewData?.tropes && previewData.tropes.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900">Tropes:</h5>
                <div className="flex flex-wrap gap-2">
                  {previewData.tropes.slice(0, 8).map((trope: string) => (
                    <span
                      key={trope}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
                    >
                      {trope}
                    </span>
                  ))}
                  {previewData.tropes.length > 8 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{previewData.tropes.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Final Review Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 backdrop-blur-sm">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Ready to Publish?
        </h3>
        <div className="space-y-2 text-sm text-foreground">
          <p>✓ Book details complete</p>
          <p>✓ Photos uploaded</p>
          <p>✓ Pricing set</p>
          <p>✓ Story written</p>
          <p className="text-primary font-medium mt-4">
            Your listing will go live as soon as you click "Publish Listing"!
          </p>
        </div>
      </Card>
    </div>
  );
}
