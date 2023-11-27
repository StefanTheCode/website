import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../components/getPostMetadata";
import '../[slug]/page.module.css'
import Subscribe from "@/app/subscribe";
import Affiliate from "@/app/affiliate";
import config from '@/config.json'
import { Props } from "@mdx-js/react/lib";
import { Metadata } from "next";


const getPostContent = (slug: string) => {
  const folder = "posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

export async function generateMetadata(props: any): Promise<Metadata> {
  const slug = props.params.slug;
  const post = getPostContent(slug);

  if(!post) return {
    title: "Stefan Djokic | Not Found",
    description: "The page is not found"
  }

  return {
    title: "Stefan Djokic Blog | " + post.data.title,
    description: post.data.subtitle
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
      <Subscribe />
      <section className="ftco-section contact-section text-center" id="newsletter-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className='col-md-2'></div>
          <div className="col-md-8 heading-section text-center " id="footer-news-web">
            <hr className="hr" />

            <p className="header-text">Design Patterns Simplified</p>
          </div>
          <div className='col-md-2'></div>
        </div>
        <div className="row text-center">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <h2 className='subheading'>In this concise and affordable ebook, I've distilled the essence of design patterns into an easy-to-digest format. <br/>
            <a href="https://stefandjokic.tech/design-patterns-simplified"><b> Join {config.EbookCopiesNumber}+ readers here.</b></a></h2>
          </div>
          <div className="col-md-2"></div>
        </div>

      </div>
    </section>
      <Affiliate />
    </>
  );
};

export default PostPage;
