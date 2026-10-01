'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { PostMetadata } from "@/components/PostMetadata";
import PostCard from "@/components/PostCard";
import BlogSearch from "@/components/BlogSearch";
import { searchBlogPosts } from "@/components/searchBlogPosts";

const POSTS_PER_PAGE = 12;

interface Props {
  allPosts: PostMetadata[];
}

const BlogClient = ({ allPosts }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const selectedCategory = searchParams.get("category");
  const urlSearchQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const headingRef = useRef<HTMLDivElement | null>(null);
  const lastWrittenQueryRef = useRef<string | null>(null);
  const searchUpdateTimeoutRef = useRef<number | null>(null);

  // Keep typing instant while still storing the settled search in the URL.
  useEffect(() => {
    if (urlSearchQuery === lastWrittenQueryRef.current) {
      lastWrittenQueryRef.current = null;
      return;
    }

    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (normalizedQuery === urlSearchQuery || normalizedQuery === lastWrittenQueryRef.current) {
      return;
    }

    searchUpdateTimeoutRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (normalizedQuery) {
        params.set("q", normalizedQuery);
      } else {
        params.delete("q");
      }

      params.delete("page");
      const queryString = params.toString();
      lastWrittenQueryRef.current = normalizedQuery;
      router.replace(queryString ? `/blog?${queryString}` : "/blog", { scroll: false });
    }, 300);

    return () => {
      if (searchUpdateTimeoutRef.current !== null) {
        window.clearTimeout(searchUpdateTimeoutRef.current);
        searchUpdateTimeoutRef.current = null;
      }
    };
  }, [router, searchParams, searchQuery, urlSearchQuery]);

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (selectedCategory) {
      posts = posts.filter(post => post.category != null && post.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    const normalizedSearch = deferredSearchQuery.trim();

    if (normalizedSearch) {
      return searchBlogPosts(posts, normalizedSearch);
    }

    return posts;
  }, [allPosts, deferredSearchQuery, selectedCategory]);

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const safeRequestedPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const isEditingSearch = searchQuery.trim() !== urlSearchQuery;
  const page = isEditingSearch ? 1 : Math.min(safeRequestedPage, Math.max(totalPages, 1));

  const currentPosts = useMemo(() => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, page]);

  // Scroll to heading after filter/page change (not on a plain first visit to /blog -
  // that jumped the page down on load and caused a layout shift).
  const firstScrollRef = useRef(true);
  useEffect(() => {
    const isFirst = firstScrollRef.current;
    firstScrollRef.current = false;
    if (isFirst && page === 1 && !selectedCategory) return;
    if (headingRef.current) {
      headingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page, selectedCategory]);

  const changePage = (newPage: number) => {
    if (searchUpdateTimeoutRef.current !== null) {
      window.clearTimeout(searchUpdateTimeoutRef.current);
      searchUpdateTimeoutRef.current = null;
    }

    const params = new URLSearchParams(searchParams.toString());
    const normalizedQuery = searchQuery.trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    params.set("page", newPage.toString());
    lastWrittenQueryRef.current = normalizedQuery;
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const selectCategory = (category: string | null) => {
    if (searchUpdateTimeoutRef.current !== null) {
      window.clearTimeout(searchUpdateTimeoutRef.current);
      searchUpdateTimeoutRef.current = null;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    const normalizedQuery = searchQuery.trim();
    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }
    params.delete("page");
    const queryString = params.toString();
    lastWrittenQueryRef.current = normalizedQuery;
    router.push(queryString ? `/blog?${queryString}` : "/blog", { scroll: false });
  };

  const clearFilters = () => {
    if (searchUpdateTimeoutRef.current !== null) {
      window.clearTimeout(searchUpdateTimeoutRef.current);
      searchUpdateTimeoutRef.current = null;
    }

    lastWrittenQueryRef.current = "";
    setSearchQuery("");
    router.push("/blog", { scroll: false });
  };

  const uniqueCategories = Array.from(new Set(allPosts.map(post => post.category))).filter(Boolean);

  const getCategoryCount = (cat: string) =>
    allPosts.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

  return (
    <>
      <section className="tcm-section tcm-blog-list">
        <div className="tcm-container">
          <div className="tcm-head" ref={headingRef}>
            <div>
              <span className="tcm-eyebrow">TheCodeMan.NET</span>
              <h2 className="tcm-h2">Browse the tutorials</h2>
            </div>
            <BlogSearch query={searchQuery} onQueryChange={setSearchQuery} />
          </div>

          <div className="tcm-filters blog-categories" role="group" aria-label="Filter by category">
            <button
              type="button"
              className={`tcm-filter ${!selectedCategory ? 'is-active' : ''}`}
              aria-pressed={!selectedCategory}
              onClick={() => selectCategory(null)}
            >
              All <span>{allPosts.length}</span>
            </button>
            {uniqueCategories.map((cat) => {
              const isActive = selectedCategory?.toLowerCase() === cat?.toLowerCase();
              return (
                <button
                  type="button"
                  key={cat}
                  className={`tcm-filter ${isActive ? 'is-active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => selectCategory(cat)}
                >
                  {cat} <span>{getCategoryCount(cat)}</span>
                </button>
              );
            })}
          </div>

          <p className="tcm-meta tcm-results" role="status" aria-live="polite">
            {totalPosts === 0
              ? "No articles found"
              : `${totalPosts} ${totalPosts === 1 ? "article" : "articles"} found`}
            {deferredSearchQuery.trim() ? ` for “${deferredSearchQuery.trim()}”` : ""}
          </p>

          {totalPosts === 0 ? (
            <div className="tcm-card tcm-empty">
              <h3 className="tcm-h3">Nothing matched that search</h3>
              <p className="tcm-text">Try a shorter term, another topic, or clear the active filters.</p>
              <button type="button" className="tcm-btn tcm-btn--primary" onClick={clearFilters}>
                Clear search and filters
              </button>
            </div>
          ) : (
            <div className="tcm-posts tcm-posts--3">
              {currentPosts.map((post, i) => (
                <PostCard key={post.slug} post={post} priority={page === 1 && i < 3} />
              ))}
            </div>
          )}

          {totalPages > 1 && <nav className="tcm-pager" aria-label="Blog pagination">
            <button type="button" className="tcm-pager__btn" disabled={page <= 1} onClick={() => changePage(page - 1)} aria-label="Previous page">←</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                type="button"
                key={i + 1}
                onClick={() => changePage(i + 1)}
                className={`tcm-pager__btn ${page === i + 1 ? 'is-active' : ''}`}
                aria-current={page === i + 1 ? "page" : undefined}
                aria-label={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" className="tcm-pager__btn" disabled={page >= totalPages} onClick={() => changePage(page + 1)} aria-label="Next page">→</button>
          </nav>}
        </div>
      </section>
    </>
  );
};

export default BlogClient;
