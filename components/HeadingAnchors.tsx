'use client';

import { useEffect } from 'react';

export default function HeadingAnchors() {
  useEffect(() => {
    const article = document.querySelector('.heading-section.border-right');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    headings.forEach((heading) => {
      const text = heading.textContent || '';
      if (!text.trim()) return;

      if (!heading.id) {
        heading.id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    });
  }, []);

  return null;
}
