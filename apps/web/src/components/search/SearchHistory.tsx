'use client';

import React, { useState } from 'react';
import { SavedSearch, BookSearchParams } from '@bookheart/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Search, Trash2, Edit2, Bell, BellOff, Clock, TrendingUp } from 'lucide-react';

interface SearchHistoryProps {
  savedSearches: SavedSearch[];
  onSearchSelect: (searchParams: BookSearchParams) => void;
  onRemoveSearch: (searchId: string) => void;
  onUpdateSearchName: (searchId: string, newName: string) => void;
  onToggleNotifications: (searchId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function SearchHistory({
  savedSearches,
  onSearchSelect,
  onRemoveSearch,
  onUpdateSearchName,
  onToggleNotifications,
  onClearAll,
  className = ''
}: SearchHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditStart = (search: SavedSearch) => {
    setEditingId(search.id);
    setEditName(search.name);
  };

  const handleEditSave = () => {
    if (editingId && editName.trim()) {
      onUpdateSearchName(editingId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  const formatSearchParams = (params: BookSearchParams): string => {
    const parts: string[] = [];
    
    if (params.query) parts.push(`"${params.query}"`);
    if (params.author) parts.push(`by ${params.author}`);
    if (params.seriesName) parts.push(`series: ${params.seriesName}`);
    if (params.tropes && params.tropes.length > 0) {
      parts.push(`tropes: ${params.tropes.slice(0, 2).join(', ')}`);
    }
    if (params.minPrice || params.maxPrice) {
      const min = params.minPrice ? `$${params.minPrice}` : '$0';
      const max = params.maxPrice ? `$${params.maxPrice}` : '∞';
      parts.push(`price: ${min}-${max}`);
    }
    if (params.condition && params.condition.length > 0) {
      parts.push(`condition: ${params.condition.join(', ')}`);
    }
    if (params.isSpecialEdition) parts.push('special editions');
    if (params.localPickupAvailable) parts.push('local pickup');
    
    return parts.length > 0 ? parts.join(' • ') : 'Custom Search';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Filter searches based on current filter and search query
  const filteredSearches = savedSearches
    .filter(search => {
      if (searchQuery) {
        return search.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               formatSearchParams(search.searchParams).toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (filter === 'recent') {
        const dateA = new Date(a.lastUsed || a.createdAt);
        const dateB = new Date(b.lastUsed || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      } else {
        return b.useCount - a.useCount;
      }
    });

  if (savedSearches.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <History className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Searches</h3>
        <p className="text-gray-500">Your search history will appear here</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Search History</h2>
          <span className="text-sm text-gray-500">({savedSearches.length})</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="text-gray-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={filter === 'recent' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('recent')}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Recent
          </Button>
          <Button
            variant={filter === 'popular' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('popular')}
            className="text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search your saved searches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search List */}
      <div className="space-y-3">
        {filteredSearches.map((search) => (
          <Card key={search.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Search Name */}
                <div className="flex items-center space-x-2 mb-2">
                  {editingId === search.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleEditSave}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-900 truncate">{search.name}</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStart(search)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Search Parameters */}
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {formatSearchParams(search.searchParams)}
                </p>

                {/* Metadata */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Used {search.useCount} times</span>
                  <span>Last used {formatDate(search.lastUsed || search.createdAt)}</span>
                  {search.notifications && (
                    <span className="text-purple-600 flex items-center">
                      <Bell className="h-3 w-3 mr-1" />
                      Notifications on
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleNotifications(search.id)}
                  className="h-8 w-8 p-0"
                >
                  {search.notifications ? (
                    <Bell className="h-4 w-4 text-purple-600" />
                  ) : (
                    <BellOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => onSearchSelect(search.searchParams)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Search
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveSearch(search.id)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSearches.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <Search className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching searches</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}
