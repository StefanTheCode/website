import { Metadata } from "next";
import getPostMetadata from "@/components/getPostMetadata";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter Archive - All Issues",
  description:
    "Browse all past issues of TheCodeMan.NET newsletter. Practical .NET tips, C# tutorials, and architecture best practices delivered every Monday.",
  alternates: {
    canonical: "https://thecodeman.net/newsletter-archive",
  },
  openGraph: {
    title: "Newsletter Archive - All Issues",
    type: "website",
    url: "https://thecodeman.net/newsletter-archive",
    description:
      "Browse all past issues of TheCodeMan.NET newsletter. Practical .NET tips, C# tutorials, and architecture best practices delivered every Monday.",
  },
};

export default function NewsletterArchivePage() {
  const posts = getPostMetadata()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group posts by year and month
  const grouped: Record<string, Record<string, typeof posts>> = {};
  posts.forEach((post) => {
    const d = new Date(post.date);
    const year = d.getFullYear().toString();
    const month = d.toLocaleString("en-US", { month: "long" });
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(post);
  });

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <section className="img ftco-section">
      <div className="container">
        <div className="row justify-content-center pb-3">
          <div className="col-md-12 text-center">
            <h1 className="blog-header2">Newsletter Archive</h1>
            <p className="text-slate-400 mt-2">
              {posts.length} issues published — browse all past content by date.
            </p>
          </div>
        </div>

        {years.map((year) => (
          <div key={year} className="mb-5">
            <h2 className="text-yellow mb-4">{year}</h2>
            {Object.entries(grouped[year])
              .sort((a, b) => {
                const months = [
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
                ];
                return months.indexOf(b[0]) - months.indexOf(a[0]);
              })
              .map(([month, monthPosts]) => (
                <div key={month} className="mb-4">
                  <h4 className="mb-3" style={{ opacity: 0.7 }}>{month}</h4>
                  <div className="row">
                    {monthPosts.map((post) => (
                      <div key={post.slug} className="col-md-6 col-lg-4 mb-3">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="related-post-card"
                          style={{ display: "block", height: "100%" }}
                        >
                          <div className="related-post-info">
                            {post.category && (
                              <span className="related-post-category">{post.category}</span>
                            )}
                            <h4 className="related-post-title" style={{ fontSize: "0.9rem" }}>
                              {post.title}
                            </h4>
                            <span className="related-post-date">{post.date}</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
