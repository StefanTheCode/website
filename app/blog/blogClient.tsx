'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { PostMetadata } from "@/components/PostMetadata";
import PostPreview from "@/components/PostPreview";
import BlogSearch from "@/components/BlogSearch";
import Subscribe from "../subscribe";
import config from "@/config.json";
import Image from 'next/image';
import Fuse from "fuse.js";

const POSTS_PER_PAGE = 10;

interface Props {
  allPosts: PostMetadata[];
}

const BlogClient = ({ allPosts }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") ?? "1");
  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("q") ?? "";

  const headingRef = useRef<HTMLDivElement | null>(null);

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts];

    if (selectedCategory) {
      posts = posts.filter(post => post.category != null && post.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    const normalizedSearch = searchQuery.trim();

    if (normalizedSearch) {
      const fuse = new Fuse(posts, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'subtitle', weight: 0.3 },
          { name: 'category', weight: 0.2 },
          { name: 'newsletterTitle', weight: 0.1 },
        ],
        threshold: 0.4,
      });

      return fuse.search(normalizedSearch).map((result) => result.item);
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allPosts, selectedCategory, searchQuery]);

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

  const totalPosts = filteredPosts.length;

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const selectCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`/blog?${params.toString()}`, {  scroll: false });
  };

  const setSearchQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const hasMeaningfulQuery = value.trim().length > 0;

    if (hasMeaningfulQuery) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    params.set("page", "1");
    router.replace(`/blog?${params.toString()}`, { scroll: false });
  };

  const uniqueCategories = Array.from(new Set(allPosts.map(post => post.category))).filter(Boolean);

  const getCategoryCount = (cat: string) =>
    allPosts.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

  return (
    <>
      {/* Hero Header */}
      <section id="home-section" className="hero container background-black padding-bottom-5per">
        <div className="row d-md-flex no-gutters">
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text padding-top-10per">
            <div className="text">
              <p className="header-text">Become a </p>
              <p className="header-text mtopminus10"><span className='text-yellow'>.NET Pro</span></p>
              <p className="header-text mtbottom20 ">while drinking coffee</p>
              <p className="mb-4 header-sub-text">Every <span className='text-yellow'>Monday morning</span>, start the week with a cup of coffee and <span className='text-yellow'>1 actionable .NET tip</span>.</p>
              <p className="header-sub-text-join">Join <span className='text-yellow'>{config.NewsletterSubCount}</span> to improve your .NET Knowledge.</p>
              <div className='row'>
                <div className='col-xs-4 col-sm-12 col-md-2 col-lg-2'></div>
                <div className="col-xs-4 col-sm-12 col-md-8 col-lg-8 col-xl-12 text-center octopus-input-margin-left"
                  dangerouslySetInnerHTML={{
                    __html: `<script async src="https://eomail4.com/form/03cc8224-cde8-11ef-b5d5-4bdfe653a4b5.js" data-form="03cc8224-cde8-11ef-b5d5-4bdfe653a4b5"></script>`
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-top-10per" id="profile-image">
            <Image src={'/images/blog-header.png'} priority alt={'Blog header image'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="img ftco-section">
        <div className="container">
          <div className="col-md-12 text-center" ref={headingRef}>
            <h2><b className='text-yellow'>TheCodeMan.NET</b></h2>
            <h2>previous issues </h2>
          </div>

          {/* Search */}
          <BlogSearch query={searchQuery} onQueryChange={setSearchQuery} />

          {/* Category Filter */}
          <div className="row justify-content-center mt-4">
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

          <div className="row pt-5 mt-5">
            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 border-right">
              {currentPosts.map((post) => (
                <PostPreview key={post.slug} {...post} />
              ))}

              {/* Pagination */}
              <div className="mt-4 text-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => changePage(i + 1)}
                    className={`btn btn-sm m-1 ${page === i + 1 ? 'btn-warning' : 'btn-outline-secondary'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
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
