import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../components/getPostMetadata";
import '../[slug]/page.module.css'
import Subscribe from "@/app/subscribe";
import Affiliate from "@/app/affiliate";
import config from '@/config.json'
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Help from "@/app/help";


const getPostContent = (slug: string) => {

  if (!slug || slug == null) {
    notFound();
  }

  try {
    const folder = "posts/";
    const file = `${folder}${slug}.md`;
    const content = fs.readFileSync(file, "utf8");
    const matterResult = matter(content);
    return matterResult;
  }
  catch {
    notFound();
  }
};

export async function generateMetadata(props: any): Promise<Metadata> {

  const slug = props.params.slug;
  const post = getPostContent(slug);

  console.log(post.data);

  if (!post) notFound();


  return {
    title: post.data.title,
    description: post.data.meta_description,
    openGraph: {
      title: post.data.title,
      type: "article",
      publishedTime: post.data.date,
      authors: "Stefan Djokic",
      description: post.data.meta_description,
      images: [
        {
          url: "https://stefandjokic.tech/images/blog/" + slug + ".png",
          width: "1000px",
          height: "700px"
        }
      ],
    },
    twitter: {
      title: post.data.title,
      card: "summary_large_image",
      site: "@TheCodeMan__",
      creator: "@TheCodeMan__",
      description: post.data.meta_description,
      images: [
        {
          url: "https://stefandjokic.tech/images/blog/" + slug + ".png",
          width: "1000px",
          height: "700px"
        }
      ]
    }
  }
}

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

const PostPage = (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);

  if (!post || post == null) {
    notFound();
  }

  return (
    <>
      <section className="img ftco-section">
        {/* <div className="container"> */}
          <div className="row justify-content-center pb-5 pt-10">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 heading-section text-justify border-right">
              <div className="row justify-content-center pb-5">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section text-center">
                  {/* <h2 className="blog-header">{post.data.newsletterTitle}</h2> */}
                  <h2 className="blog-header2">{post.data.title}</h2>
                  <p className="text-slate-400 mt-2">{post.data.date}</p>
                </div>
              </div>
              <Markdown>{post.content}</Markdown>
              <Subscribe />
          <Help />
            </div>
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12">
              <div className="row justify-content-center pb-5 fixed-position">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h4 >Subscribe to <br />.NET Pro Weekly</h4>
                  <p className="text-slate-400 mt-2">Subscribe to the .NET Pro Weekly and be among the <span className="text-yellow"> {config.NewsletterSubCount}</span> gaining practical tips and resources to enhance your .NET expertise.</p>
                  <div className="row">
                    <div className="col-md-12 padding-left0 padding-right0"
                      dangerouslySetInnerHTML={{
                        __html: `
              <script async src="https://eocampaign1.com/form/e85a08a0-d239-11ed-bf00-69996e57973d.js"
                data-form="e85a08a0-d239-11ed-bf00-69996e57973d">
              </script>
            `
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div>   */}
      </section >
    
    </>
  );
};

export default PostPage;
