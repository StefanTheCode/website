import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../components/getPostMetadata";
import '../[slug]/page.module.css'
import Subscribe from "@/app/subscribe";
import Affiliate from "@/app/affiliate";
import config from '@/config.json';
import { notFound } from "next/navigation";
import Head from "next/head";
import Help from "@/app/help";
import MetadataHead from "./MetadataHead";

const getPostContent = (slug: string) => {
  if (!slug) {
    console.error("Missing slug");
    notFound();
  }

  try {
    const folder = "posts/";
    const file = `${folder}${slug}.md`;
    const content = fs.readFileSync(file, "utf8");
    const matterResult = matter(content);

    // Ensure required fields are present
    if (!matterResult.data.title) {
      throw new Error(`Missing title in frontmatter for slug: ${slug}`);
    }

    return matterResult;
  } catch (err) {
    console.error(`Error reading post "${slug}":`, err);
    notFound();
  }
};


export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts
    .filter(p => !!p.slug) // Ensure slug is present
    .map((post) => ({
      slug: post.slug,
    }));
};


const PostPage = (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);

  if (!post) notFound();

  const meta = {
    title: post.data.title,
    description: post.data.meta_description || "",
    image: `https://thecodeman.net/images/blog/${slug}.png`,
    url: `https://thecodeman.net/posts/${slug}`,
    date: post.data.date
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
              {post?.content ? <Markdown>{post.content}</Markdown> : <p>Post content missing.</p>}

              <Help />
              <Subscribe />
            </div>

            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12">
              <div className="row justify-content-center pb-5 fixed-position">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h4>Subscribe to <br />TheCodeMan.net</h4>
                  <p className="text-slate-400 mt-2">
                    Subscribe to the TheCodeMan.net and be among the{" "}
                    <span className="text-yellow">{config.NewsletterSubCount}</span> gaining practical tips and resources to enhance your .NET expertise.
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
};

export default PostPage;
