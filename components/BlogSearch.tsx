'use client';

import { ChangeEvent } from 'react';

interface BlogSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function BlogSearch({ query, onQueryChange }: BlogSearchProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  return (
    <div className="blog-search-wrapper">
      <div className="blog-search-input-wrapper">
        <svg className="blog-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          className="blog-search-input"
          placeholder="Search articles..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button
            className="blog-search-clear"
            onClick={() => {
              onQueryChange('');
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
