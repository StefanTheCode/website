'use client';

import { ChangeEvent, KeyboardEvent } from 'react';

interface BlogSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function BlogSearch({ query, onQueryChange }: BlogSearchProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      onQueryChange('');
    }
  };

  return (
    <search className="blog-search-wrapper" aria-label="Search blog articles">
      <div className="blog-search-input-wrapper">
        <svg className="blog-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <label className="sr-only" htmlFor="blog-search">Search blog articles</label>
        <input
          id="blog-search"
          type="search"
          className="blog-search-input"
          placeholder="Search by topic, title or category..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            className="blog-search-clear"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </search>
  );
}
