import React, { useState } from 'react';
import { SearchFilters } from '../types';

interface SearchInputProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    onlyLebanon: true,
    type: 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, filters);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            placeholder="Search for a place (e.g., 'McDonalds', 'Phoenicia Hotel')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Filter:</span>
          </div>
          
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
              checked={filters.onlyLebanon}
              onChange={(e) => setFilters(prev => ({ ...prev, onlyLebanon: e.target.checked }))}
            />
            <span className="ml-2">Only Lebanon</span>
          </label>

          <div className="h-4 w-px bg-slate-300 mx-2 hidden sm:block"></div>

          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="placeType" 
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                checked={filters.type === 'all'}
                onChange={() => setFilters(prev => ({ ...prev, type: 'all' }))}
              />
              <span className="ml-2">All</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="placeType" 
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                checked={filters.type === 'restaurant'}
                onChange={() => setFilters(prev => ({ ...prev, type: 'restaurant' }))}
              />
              <span className="ml-2">Restaurants</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="placeType" 
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                checked={filters.type === 'hotel'}
                onChange={() => setFilters(prev => ({ ...prev, type: 'hotel' }))}
              />
              <span className="ml-2">Hotels</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};