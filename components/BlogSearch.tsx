'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { PostMetadata } from './PostMetadata';
import Link from 'next/link';

interface BlogSearchProps {
  posts: PostMetadata[];
}

export default function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'subtitle', weight: 0.3 },
          { name: 'category', weight: 0.2 },
          { name: 'newsletterTitle', weight: 0.1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [posts]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 8);
  }, [query, fuse]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="blog-search-wrapper" ref={wrapperRef}>
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
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            className="blog-search-clear"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className="blog-search-results">
          {results.map(({ item }) => (
            <Link
              key={item.slug}
              href={`/posts/${item.slug}`}
              className="blog-search-result-item"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <span className="blog-search-result-title">{item.title}</span>
              <span className="blog-search-result-meta">
                {item.category && <span className="blog-search-result-cat">{item.category}</span>}
                <span className="blog-search-result-date">{item.date}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="blog-search-results">
          <div className="blog-search-no-results">No articles found for &ldquo;{query}&rdquo;</div>
        </div>
      )}
    </div>
  );
}
