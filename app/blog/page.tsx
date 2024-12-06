import getPostMetadata from "@/components/getPostMetadata";
import Subscribe from "../subscribe";
import PostPreview from "@/components/PostPreview";
import { Metadata } from "next";
import config from '@/config.json'
import Image from 'next/image'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/blog'),
  title: "Blog",
  description: "Explore TheCodeMan.NET blog for expert articles on .NET development, C# tutorials, and software engineering trends. Stay ahead in the tech world with in-depth insights.",
  openGraph: {
    title: "Blog",
    type: "website",
    url: "https://thecodeman.net/blog",
    description: "Explore TheCodeMan.NET blog for expert articles on .NET development, C# tutorials, and software engineering trends. Stay ahead in the tech world with in-depth insights."
  },
  twitter: {
    title: "Blog",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Explore TheCodeMan.NET blog for expert articles on .NET development, C# tutorials, and software engineering trends. Stay ahead in the tech world with in-depth insights."
  }
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
      <section id="home-section" className="hero container background-black padding-bottom-5per">
        <div className="row d-md-flex no-gutters">
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text padding-top-10per" >
            <div className="text" >
              <p className="header-text">Become a </p>
              <p className="header-text mtopminus10"><span className='text-yellow'>.NET Pro</span> </p>
              <p className="header-text mtbottom20 ">while drinking coffee</p>
              <p className="mb-4 header-sub-text">Every <span className='text-yellow'>Monday
                morning</span>, start
                the week with a
                cup of coffee and <span className='text-yellow'>1 actionable .NET tip</span> that you can use
                right away.</p>
              <p className="header-sub-text-join">Join <span className='text-yellow'>{config.NewsletterSubCount}</span> to improve your .NET Knowledge.</p>
              <div className='row'>
                <div className='col-xs-4 col-sm-12 col-md-2 col-lg-2'></div>
                <div className="col-xs-4 col-sm-12 col-md-8 col-lg-8 col-xl-12 text-center octopus-input-margin-left"
                  dangerouslySetInnerHTML={{
                    __html: `
               <script async src="https://eomail4.com/form/861505f8-b3f8-11ef-896f-474a313dbc14.js" data-form="861505f8-b3f8-11ef-896f-474a313dbc14"></script>
            `
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-top-10per" id="profile-image">
            <Image src={'/images/blog-header.png'} priority={true} alt={'Blog header image'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </section>

      <section className="img ftco-section">
        <div className="container">
          <div className="col-md-12 text-center">
            <h2><b className='text-yellow'>TheCodeMan.NET</b></h2>
            <h2>previous issues </h2>
          </div>
          <div className="row pt-5 mt-5">

            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 border-right">
              {postPreviews}
            </div>
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 ">
            <div className="row justify-content-center pb-5">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h4 >Subscribe to <br />TheCodeMan.net</h4>
                  <p className="text-slate-400 mt-2">Subscribe to the TheCodeMan.net and be among the <span className="text-yellow"> {config.NewsletterSubCount}</span> gaining practical tips and resources to enhance your .NET expertise.</p>
                  <div className="row">
                    <div className="col-md-12 padding-left0 padding-right0"
                      dangerouslySetInnerHTML={{
                        __html: `
            <script async src="https://eomail4.com/form/861505f8-b3f8-11ef-896f-474a313dbc14.js" data-form="861505f8-b3f8-11ef-896f-474a313dbc14"></script>
            `
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
  )
}

export default Blog;