import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ query, onQueryChange, placeholder = 'Search...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Clear search on Escape
      if (e.key === 'Escape' && query) {
        onQueryChange('');
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [query, onQueryChange]);

  const handleClear = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className={`relative flex items-center border rounded-lg transition-colors ${
        isFocused ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-300'
      }`}>
        <span className="absolute left-3 text-gray-400" aria-hidden="true">
          🔍
        </span>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-transparent focus:outline-none text-sm"
          aria-label="Search features"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Clear search"
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!isFocused && !query && (
        <div className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">
          ⌘K
        </div>
      )}

      {/* Search suggestions/help */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="text-xs text-gray-600">
            <div className="font-medium mb-1">Search tips:</div>
            <ul className="space-y-1">
              <li>• Type feature names (e.g., "debug", "analytics")</li>
              <li>• Search by category (e.g., "development", "learning")</li>
              <li>• Use ⌘K to quickly focus search</li>
              <li>• Press Escape to clear search</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}