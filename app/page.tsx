import Image from 'next/image'
import styles from './page.module.css'
import config from '@/config.json'
import Subscribe from './subscribe'
import getPostMetadata from '@/components/getPostMetadata'
import MyComponent from '@/components/newsletterTestimonials'
import { Metadata } from 'next'

const postMetadata = getPostMetadata();


export const metadata:Metadata = {
  title: "Stefan Djokic | I'm Your Guide to Becoming a .NET Pro!",
  description: "Discover Stefan Djokic's journey as a Senior Software Engineer and .NET specialist. His personal website is a treasure trove of knowledge for .NET enthusiasts seeking to advance their skills with expert advice."
}

const sortedPostMetadata = postMetadata.sort((a, b) => {
  const dateA = new Date(a.date) as unknown as number;
  const dateB = new Date(b.date) as unknown as number;
  return dateB - dateA;
});

const postPreviews = sortedPostMetadata.slice(0, 3).map((post) => {
  const href = `/posts/${post.slug}`
  return (
    <div className="col-xl-4 col-lg-12 col-md-12 d-flex mb-5">
      <div className="blog-entry text-center">
        <h5><a href={href} className='newsletter-title'
        >{post.newsletterTitle}</a></h5>
        <h3><a href={href}
        >{post.title}
        </a></h3>
        <h6>{post.date}</h6>
        <br />
        <h5 >{post.subtitle}
        </h5>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <>
      <section id="home-section" className="hero container">
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
              <p className="header-sub-text-join">Join <span className='text-yellow'>{config.NewsletterSubCount}</span> to the
                Monday coffee.</p>
              <div className='row'>
                <div className='col-xs-4 col-sm-12 col-md-2 col-lg-2'></div>
                <div className="col-xs-4 col-sm-12 col-md-8 col-lg-8 col-xl-12 text-center octopus-input-margin-left"
                  dangerouslySetInnerHTML={{
                    __html: `
                <script async src="https://eocampaign1.com/form/33e483be-a0b1-11ed-b1bd-9b9d338510f2.js"
								data-form="33e483be-a0b1-11ed-b1bd-9b9d338510f2"></script>
            `
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12" id="profile-image">
            <img src="/images/test.png" alt="Profile image of Stefan Djokic" width="100%" height="100%" />
          </div>
        </div>
      </section>


      <section className="ftco-section background-yellow" id="newsletter-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <p className='text-black text-font-2rem margin-top-minus-10'>What did people say about it?</p>
            </div>
            <MyComponent />
          </div>
        </div>
      </section>

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">How can I <span className='text-yellow'> help you</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-5">
              <div className="blog-entry text-center">
                <h3><a href="blog/github-webhook.html">Become .NET Pro Weekly Newsletter
                </a></h3>
                <br />
                <h5 >Every Monday morning, I share 1 actionable tip on C#, .NET & Arcitecture topic, that you can use right away.
                </h5>
                <a href='/'><button className='btn btn-primary border-radius-5px mt-5 button-padding'>Join {config.NewsletterSubCount}</button>
                </a>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="blog-entry text-center">
                <h3><a href="blog/github-webhook.html">Promote your business to {config.NewsletterSubCount}
                </a></h3>
                <br />
                <h5 >Looking to expand your followers, subscribers, or clientele swiftly? <br /> Feature your brand in my newsletter!
                </h5>
                <a href='/sponsorship' className='text-black'><button className='btn btn-primary border-radius-5px mt-5 button-padding'> Reserve a spot</button></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5 pb-5">
            <div className="col-md-7 heading-section text-center">
            </div>
          </div>
          <div className="row justify-content-center mb-5 pb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Recent <span className='text-yellow'> .Net Weekly </span>Issues</p>
            </div>
          </div>
          <div className="row d-flex">
            {postPreviews}
          </div>
        </div>
      </section>

      <section className="ftco-section background-yellow" id="blog-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 ">
              <div className="row">
                <div className="col-md-12 text-center">
                  <img className='skill-csharp-img' src="/images/csharp.png" alt="C# Logo" width="110px" />
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="row">
                <div className="col-md-12 text-center">
                  <img className='skill-img' src="/images/dotnet.png" alt="Dotnet (.NET) Logo" width="128px" />
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="row">
                <div className="col-md-12 text-center">
                  <img className='skill-img' src="/images/sql-server.png" alt="SQL Server Logo" width="128px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section contact-section ftco-no-pb" id="contact-section">
        <div className="container">
          <div className="row justify-content-center mb-5 pb-3">
            <div className="col-md-7 heading-section text-center ">
              <p className="header-text">Socials</p>
              <p className='text-white'>Reach out to me and follow my content on one of the following networks:</p>
            </div>
          </div>

          <div className="row d-flex contact-info mb-5">
            <div className="col-md-6 col-lg-3 d-flex ">
              <div className="align-self-stretch box p-4 text-center">
                <div className="icon d-flex align-items-center justify-content-center">
                  <a href="https://www.linkedin.com/in/djokic-stefan/" target="_blank">
                    <img className='social-icon' src='/images/icons/linkedin-icon.png' alt='Linkedin logo' width='30%' height='auto' />
                  </a>
                </div>
                <h3 className="mb-4">Linkedin</h3>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 d-flex ">
              <div className="align-self-stretch box p-4 text-center">
                <div className="icon d-flex align-items-center justify-content-center">
                  <a href="https://twitter.com/TheCodeMan__" target="_blank">
                    <img className='social-icon' src='/images/icons/twitter-icon.png' alt='Twitter logo' width='30%' height='auto' />
                  </a>
                </div>
                <h3 className="mb-4">Twitter</h3>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 d-flex ">
              <div className="align-self-stretch box p-4 text-center">
                <div className="icon d-flex align-items-center justify-content-center">
                  <a href="https://github.com/StefanTheCode" target="_blank">
                    <img className='social-icon' src='/images/icons/github-icon.png' alt='Github logo' width='30%' height='auto' />
                  </a>
                </div>
                <h3 className="mb-4">Github</h3>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 d-flex ">
              <div className="align-self-stretch box p-4 text-center">
                <div className="icon d-flex align-items-center justify-content-center">
                  <a href="https://www.instagram.com/the.code.man/" target="_blank">
                    <img className='social-icon' src='/images/icons/instagram-icon.png' alt='Instagram logo' width='30%' height='auto' /></a>
                </div>
                <h3 className="mb-4">Instagram</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Subscribe />
    </>
  )
}
