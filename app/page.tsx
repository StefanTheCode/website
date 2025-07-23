import Image from 'next/image'
import styles from './page.module.css'
import config from '@/config.json'
import Subscribe from './subscribe'
import getPostMetadata from '@/components/getPostMetadata'
import MyComponent from '@/components/newsletterTestimonials'
import { Metadata } from 'next'
import EbookNewsletter from '@/components/ebookTestimonials'
import Script from 'next/script'

const postMetadata = getPostMetadata();


const sortedPostMetadata = postMetadata.sort((a, b) => {
  const dateA = new Date(a.date) as unknown as number;
  const dateB = new Date(b.date) as unknown as number;
  return dateB - dateA;
});

const postPreviews = sortedPostMetadata.slice(0, 4).map((post) => {
  const href = `/posts/${post.slug}`
  return (
    <div className="col-xl-3 col-lg-12 col-md-12 d-flex mb-5">
      <a href={href}>
        <div className="blog-entry text-center">
          <div>
            <Image src={post.photo} className="blog-post-img" alt={post.title} width={0} height={0} sizes="100vw" style={{ width: '80%', height: '20%' }} />
          </div>
          <h5 className='text-yellow mt-3'>{post.title}
          </h5>
          <br />
        </div>
      </a>
    </div>
  )
});

export default function Home() {
  return (
    <>
      <section id="home-section " className="hero container">
        <div className="row d-md-flex no-gutters">
          <div className="col-xl-12 mt-5 col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center slider-text padding-top-10per" >
            <div className="text" >
              <p className="header-text-feature-b  mtbottom20"><span className='text-yellow'>Level Up Your .NET Skills</span></p>
              <p className="header-text-feature-b mtbottom20">One Tip Weekly</p>
              <div className='container mt-5'>
                <div className='row text-center'>
                  <div className='col-xs-4 col-sm-12 col-md-3 col-lg-3'></div>
                  <div className="col-xs-4 col-sm-12 col-md-8 col-lg-6 col-xl-6 text-center"
                    dangerouslySetInnerHTML={{
                      __html: `<script async src="https://eomail4.com/form/861505f8-b3f8-11ef-896f-474a313dbc14.js" data-form="861505f8-b3f8-11ef-896f-474a313dbc14"></script>`
                    }}
                  ></div>
                  <div className='col-xs-4 col-sm-12 col-md-3 col-lg-3'></div>
                </div>
              </div>
              <p className="mb-4 mt-5 header-sub-text"><span className='text-yellow'>
                Every Monday</span>, learn a <span className='text-yellow'>New .NET Trick</span> you can apply instantly!</p>
              <div className='container'>
                <div className='row text-center'>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-2 mb-5">
                    <div className="senja-embed" data-id="ea80a7ca-913b-44b0-be8f-ff917bc894e0" data-lazyload="false"></div>
                    <Script
                      src="https://static.senja.io/dist/platform.js"
                      async
                      type="text/javascript">
                    </Script>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12" id="profile-image">
            <Image src={'/images/stefan-djokic.png'} priority={true} quality={100} alt={'Profile image of Stefan Djokic'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: '100%' }} />
          </div> */}
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
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5">
              <div className="blog-entry text-center">
                <h3><a href="https://www.skool.com/thecodeman">TheCodeMan Community
                </a></h3>
                <br />
                <h5 > <span className='text-yellow'><b>1# .NET Community on Skool</b></span>. <br/>  Your hub for .NET content, mini-courses, and expert advice for FREE! </h5>
                <a href='https://www.skool.com/thecodeman'><button className='btn btn-primary border-radius-5px mt-5 button-padding'>Join Community</button>
                </a>
              </div>
            </div>
            </div>
            <div className="row text-center">

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <div className="blog-entry text-center">
                <h3><a href="/sponsorship">Promote your business to {config.NewsletterSubCount}
                </a></h3>
                <br />
                <h5 >Looking to expand your followers, subscribers, or clientele swiftly? <br /> Feature your brand in my newsletter!
                </h5>
                <a href='/sponsorship' className='text-black'><button className='btn btn-primary border-radius-5px mt-5 button-padding'> Reserve a spot</button></a>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <div className="blog-entry text-center">
                <h3><a href="https://youtu.be/Y9qJSIF0ZFs?si=YVhb64EeZRKDZ2x-">YouTube Channel
                </a></h3>
                <br />
                <h5> Check out the last video:</h5>
                <a href='https://youtu.be/Y9qJSIF0ZFs?si=YVhb64EeZRKDZ2x-' target='_blank'  className='text-black'>
                <h4>How to implement CQRS without MediatR in .NET?</h4>
                <Image src={'/images/last-youtube.png'} className='social-icon' alt={'Last YouTube video'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
                </a>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <div className="blog-entry text-center">
                <h3><a href="/design-patterns-that-deliver-ebook">Design Patterns ebooks
                </a></h3>
                <br />
                <h5> I specialize in content on design patterns, focusing on practical application over theory. I've authored two ebooks featuring real-world examples of applying design patterns effectively.</h5>
                <a href='/design-patterns-that-deliver-ebook' className='text-black'><button className='btn btn-primary border-radius-5px mt-5 button-padding'>Check out the last ebook</button></a>
              </div>
            </div>

          </div>
        </div>
      </section>
      <hr className='background-yellow'></hr>
      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 heading-section text-center">
            </div>
          </div>
          <div className="row justify-content-center mb-5 pb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Recent <span className='text-yellow'> TheCodeMan.NET </span>Issues</p>
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
                  <Image src={'/images/csharp.png'} className='skill-csharp-img' alt={'C# Logo'} width={110} height={120} />
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="row">
                <div className="col-md-12 text-center">
                  <Image src={'/images/dotnet.png'} className='skill-img' alt={'Dotnet (.NET) Logo'} width={128} height={128} />

                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="row">
                <div className="col-md-12 text-center">
                  <Image src={'/images/sql-server.png'} className='skill-img' alt={'SQL Server Logo'} width={128} height={128} />
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
          <div className="row d-flex text-center contact-info mb-5">
          <div className='col-md-2'></div>
            <div className='col-md-8'>
              <div className='row'>
              <div className="col-md-2 d-flex">
              <a href="https://www.skool.com/thecodeman" target="_blank" rel="noopener">
                <Image src={'/images/icons/skool-icon.webp'} className='social-icon' alt={'Skool Community'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
              </a>
            </div>
            <div className="col-md-2 d-flex">
              <a href="https://www.youtube.com/@thecodeman_" target="_blank" rel="noopener">
                <Image src={'/images/icons/youtube-icon.png'} className='social-icon' alt={'YouTube Channel'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
              </a>
            </div>
            <div className="col-md-2 d-flex">
              <a href="https://www.linkedin.com/in/djokic-stefan/" target="_blank" rel="noopener">
                <Image src={'/images/icons/linkedin-icon.png'} className='social-icon' alt={'Linkedin'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
              </a>
            </div>
            <div className="col-md-2 d-flex ">
              <a href="https://twitter.com/TheCodeMan__" target="_blank" rel="noopener">
                <Image src={'/images/icons/twitter-icon.png'} className='social-icon' alt={'Twitter (X)'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
              </a>
            </div>
            <div className="col-md-2 d-flex ">
              <a href="https://github.com/StefanTheCode" target="_blank" rel="noopener">
                <Image src={'/images/icons/github-icon.png'} className='social-icon' alt={'Github'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
              </a>
            </div>
            <div className="col-md-2 d-flex">
              <a href="https://medium.com/@thecodeman" target="_blank" rel="noopener">
                <Image src={'/images/icons/medium-icon.png'} className='social-icon' alt={'Medium'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
              </a>
            </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      <hr className='background-yellow'></hr>

      <section className="ftco-section contact-section ftco-no-pb" id="contact-section">
        <div className="container">
          <div className='row'>
            <div className='col-md-12'>
              <Subscribe />
            </div>
          </div></div>
      </section>
    </>
  )
}
