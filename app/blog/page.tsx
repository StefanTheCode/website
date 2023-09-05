import getPostMetadata from "@/components/getPostMetadata";
import Subscribe from "../subscribe";
import PostPreview from "@/components/PostPreview";

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
      <section className="img ftco-section ">
        <div className="container">
          <div className="row justify-content-center pb-5">
            <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7 heading-section text-center ">
              <h5 className="text-yellow">The blog is under development. Other posts will be visible soon.</h5>
              <h2 className="mb-4 mt-10">Blog posts</h2>
            </div>
          </div>
          {postPreviews}
        </div>
      </section>
      <hr />
      <Subscribe />
    </>
  )
}

export default Blog;