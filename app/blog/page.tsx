import getPostMetadata from "@/components/getPostMetadata";
import Subscribe from "../subscribe";
import PostPreview from "@/components/PostPreview";
import { Metadata } from "next";
import config from '@/config.json'

export const metadata:Metadata = {
  title: "Stefan Djokic | Blog",
  description: "Delve into Stefan Djokic's Blog for insightful articles on .NET development, software engineering trends, and expert tips. Whether you're a beginner or an advanced coder, Stefan's blog provides valuable knowledge and updates to enrich your understanding of the evolving tech world."
}

const Blog = () => {

  const postMetadata = getPostMetadata();

  const sortedPostMetadata = postMetadata.sort((a, b) => {
    const dateA = new Date(a.date) as unknown as number;
    const dateB = new Date(b.date) as unknown as number;
    return dateB - dateA;
  });

  const postPreviews = sortedPostMetadata.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <>
      <section className="img ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5">
            <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7 heading-section text-center ">
              <h5 className="text-yellow">The blog is under development. Other posts will be visible soon.</h5>
              <h2 className="mb-4 mt-10">Blog posts</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
            {postPreviews}
            </div>
            {/* <div className="col-md-3">
            <div className="row justify-content-center pb-5">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 sticky-top">
              <h3 className="newsletter-post-title">Subscribe to <br/>.NET Pro Weekly</h3>
              <p className="text-slate-400 mt-2">Subscribe to the .NET Pro Weekly and be among the <span className="text-yellow"> {config.NewsletterSubCount}</span> gaining practical tips and resources to enhance your .NET expertise.</p>
              <div className="row">
              <div className="col-md-12"
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
            </div> */}
          </div>
        </div>
      </section>
      <hr />
      <Subscribe />
    </>
  )
}

export default Blog;