import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../components/getPostMetadata";
import '../[slug]/page.module.css'
import Subscribe from "@/app/subscribe";
import Affiliate from "@/app/affiliate";


const getPostContent = (slug: string) => {
  const folder = "posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

const PostPage = (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);
  return (
    <>
      <section className="img ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section text-center">
              <h2 className="blog-header">{post.data.newsletterTitle}</h2>
              <h2 className="blog-header2">{post.data.title}</h2>
              <p className="text-slate-400 mt-2">{post.data.date}</p>
            </div>
          </div>
          <div className="row justify-content-center pb-5">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-10 heading-section text-justify">
              <Markdown>{post.content}</Markdown>
            </div>
          </div>
        </div>
      </section >
      <Affiliate />
      <Subscribe />
    </>
  );
};

export default PostPage;
