'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const clientSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * `initialHeadings` is computed on the server from the post markdown so the TOC is part
 * of the static HTML (no layout shift when it appears). On mount the list is re-read from
 * the rendered article headings, so ids/text always match the DOM.
 */
export default function TableOfContents({ initialHeadings = [] }: { initialHeadings?: TocItem[] }) {
  const [headings, setHeadings] = useState<TocItem[]>(initialHeadings);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const article = document.querySelector('.heading-section.border-right');
    if (!article) return;

    // Only the article body (incl. FAQ) - not author / related-posts / help blocks.
    const elements = article.querySelectorAll('.post-body h2, .post-body h3');
    const items: TocItem[] = [];

    elements.forEach((el) => {
      const text = el.textContent || '';
      if (!text.trim()) return;
      // Use existing id or generate one
      if (!el.id) {
        el.id = clientSlug(text);
      }
      items.push({
        id: el.id,
        text: text,
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="toc" aria-label="Table of Contents">
      <div className="toc-title">Table of Contents</div>
      <ul className="toc-list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`toc-item ${h.level === 3 ? 'toc-item-sub' : ''} ${activeId === h.id ? 'toc-active' : ''}`}
          >
            <a href={`#${h.id}`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
