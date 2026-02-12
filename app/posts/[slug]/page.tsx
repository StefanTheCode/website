import fs from "fs";
import path from "path";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../components/getPostMetadata";
import "../[slug]/page.module.css";
import Subscribe from "@/app/subscribe";
import Help from "@/app/help";
import config from "@/config.json";
import { notFound } from "next/navigation";
import MetadataHead from "./MetadataHead";
import CodeBlock from "@/components/CodeBlock";
import CodeFrame from "@/components/CodeFrame";
import ShikiCode from "@/components/ShikiCode";
import { highlightFencedCode } from "@/components/highlightMarkdown";

const postsDir = path.join(process.cwd(), "posts");

function getPostContent(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`Post file not found for slug "${slug}" at path: ${filePath}`);
    notFound();
  }

  const content = fs.readFileSync(filePath, "utf8");
  const matterResult = matter(content);

  if (!matterResult.data?.title) {
    console.error(`Missing title in frontmatter for slug: ${slug}`);
    notFound();
  }

  return matterResult;
}

export async function generateStaticParams() {
  const posts = getPostMetadata();

  console.log("generateStaticParams slugs:", posts.map(p => p.slug));

  return posts
    .filter((p) => !!p.slug)
    .map((post) => ({
      slug: post.slug,
    }));
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    console.error("Missing slug in route params:", params);
    notFound();
  }

  const post = getPostContent(slug);
  const highlightedContent = await highlightFencedCode(post.content);

  const meta = {
    title: post.data.title,
    description: post.data.meta_description || "",
    image: `https://thecodeman.net/images/blog/${slug}.png`,
    url: `https://thecodeman.net/posts/${slug}`,
    date: post.data.date,
  };

  return (
    <>
      <MetadataHead slug={slug} folder="posts" />

      <section className="img ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5 pt-10">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 heading-section border-right">
              <div className="row justify-content-center pb-5">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section text-center">
                  <h2 className="blog-header2">{meta.title}</h2>
                  <p className="text-slate-400 mt-2">{meta.date}</p>
                </div>
              </div>

              {post.content ? (
                <Markdown
                  options={{
                    overrides: {
                      pre: {
                        component: (props: any) => {
                          const child = Array.isArray(props.children) ? props.children[0] : props.children;

                          const className = child?.props?.className ?? "";
                          const code = child?.props?.children ?? "";

                          return <ShikiCode className={className} code={code} />;
                        },
                      },
                    },
                  }}
                >
                  {post.content}
                </Markdown>
              ) : (
                <p>Post content missing.</p>
              )}

              <Help />
              <Subscribe />
            </div>

            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12">
              <div className="row justify-content-center pb-5 fixed-position">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h4>
                    Subscribe to <br />
                    TheCodeMan.net
                  </h4>
                  <p className="text-slate-400 mt-2">
                    Subscribe to the TheCodeMan.net and be among the{" "}
                    <span className="text-yellow">{config.NewsletterSubCount}</span> gaining
                    practical tips and resources to enhance your .NET expertise.
                  </p>
                  <div className="row">
                    <div
                      className="col-md-12 padding-left0 padding-right0"
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/03cc8224-cde8-11ef-b5d5-4bdfe653a4b5.js" data-form="03cc8224-cde8-11ef-b5d5-4bdfe653a4b5"></script>`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
