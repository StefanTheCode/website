'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { PostMetadata } from "@/components/PostMetadata";
import PostPreview from "@/components/PostPreview";
import BlogSearch from "@/components/BlogSearch";
import { searchBlogPosts } from "@/components/searchBlogPosts";
import Subscribe from "../subscribe";
import config from "@/config.json";

const POSTS_PER_PAGE = 10;

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

  // Scroll to heading after filter/page change
  useEffect(() => {
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
      {/* Blog Posts */}
      <section className="img ftco-section">
        <div className="container">
          <div className="col-md-12 text-center" ref={headingRef}>
            <h2><b className='text-yellow'>TheCodeMan.NET</b></h2>
            <h2>Browse the tutorials</h2>
          </div>

          {/* Search */}
          <BlogSearch query={searchQuery} onQueryChange={setSearchQuery} />

          {/* Category Filter */}
          <div className="row justify-content-center mt-4 blog-categories">
          <button
  className={`btn btn-sm m-2 border-radius-5px ${!selectedCategory ? 'btn-warning' : 'btn-outline-yellow'}`}
  onClick={() => selectCategory(null)}
>
  All <span className="category-count">({allPosts.length})</span>
</button>
            {uniqueCategories.map((cat) => {
              const isActive = selectedCategory?.toLowerCase() === cat?.toLowerCase();
              return (
                <button
                  key={cat}
                  className={`btn btn-sm m-2 border-radius-5px ${isActive ? 'btn-warning' : 'btn-outline-yellow'}`}
                  onClick={() => selectCategory(cat)}
                >
                  {cat} <span className="category-count">({getCategoryCount(cat)})</span>
                </button>
              );
            })}
          </div>

          <p className="blog-results-summary" role="status" aria-live="polite">
            {totalPosts === 0
              ? "No articles found"
              : `${totalPosts} ${totalPosts === 1 ? "article" : "articles"} found`}
            {deferredSearchQuery.trim() ? ` for “${deferredSearchQuery.trim()}”` : ""}
          </p>

          <div className="row pt-5 mt-5">
            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 border-right">
              {currentPosts.map((post) => (
                <PostPreview key={post.slug} {...post} />
              ))}

              {totalPosts === 0 && (
                <div className="blog-empty-state">
                  <h3>Nothing matched that search</h3>
                  <p>Try a shorter term, another topic, or clear the active filters.</p>
                  <button type="button" className="btn btn-warning" onClick={clearFilters}>
                    Clear search and filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && <nav className="mt-4 text-center" aria-label="Blog pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => changePage(i + 1)}
                    className={`btn btn-sm m-1 ${page === i + 1 ? 'btn-warning' : 'btn-outline-secondary'}`}
                    aria-current={page === i + 1 ? "page" : undefined}
                    aria-label={`Page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>}
            </div>

            {/* Sidebar */}
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 ">
              <div className="row justify-content-center pb-5">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h4>Subscribe to <br />TheCodeMan.net</h4>
                  <p className="text-slate-400 mt-2">Subscribe and be among the <span className="text-yellow">{config.NewsletterSubCount}</span> gaining .NET tips and resources.</p>
                  <div className="row">
                    <div className="col-md-12 padding-left0 padding-right0"
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/861505f8-b3f8-11ef-896f-474a313dbc14.js" data-form="861505f8-b3f8-11ef-896f-474a313dbc14"></script>`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />
      <Subscribe />
    </>
  );
};

export default BlogClient;
