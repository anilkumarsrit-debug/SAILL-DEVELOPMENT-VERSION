/**
 * SAILL - SRIT AI Language Laboratory
 * Global Search Component (Top Navigation)
 *
 * @version 1.0.0
 * @description Prepared reusable search input component for future global platform search.
 */

import React, { useState, useEffect } from 'react';
import { Search, Command, X } from 'lucide-react';

export interface GlobalSearchProps {
  onSearchSubmit?: (query: string) => void;
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const inputEl = document.getElementById('global-search-input');
        inputEl?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative flex items-center global-search ${className}`}>
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 bg-gray-50/80 hover:bg-white ${
          isFocused
            ? 'bg-white border-[#D35400] ring-2 ring-[#D35400]/20 shadow-sm w-64 sm:w-80'
            : 'border-gray-200 hover:border-gray-300 w-44 sm:w-60'
        }`}
      >
        <Search className={`w-4 h-4 shrink-0 transition-colors ${isFocused ? 'text-[#D35400]' : 'text-gray-400'}`} />
        
        <input
          id="global-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search modules, topics, resources..."
          className="w-full bg-transparent text-xs text-[#2C3E50] placeholder-gray-400 focus:outline-none font-medium truncate"
          aria-label="Global Search"
        />

        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-200/70 rounded text-[9px] font-mono text-gray-500 font-bold shrink-0">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
