import config from '@/config.json'
import Subscribe from '../subscribe';
import Affiliate from '../affiliate';
import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import EbookNewsletter from '@/components/ebookTestimonials';
import EbookReviews from '@/components/ebookReviews';
import { Metadata } from 'next';
import Image from 'next/image'
// import ogImage from '/og-ebookimage.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/design-patterns-simplified'),
  title: "Pragmatic .NET Code Rules",
  alternates: {
    canonical: 'https://thecodeman.net/design-patterns-simplified',
  },
  description: "Master design patterns easily with this beginner-level ebook. Simplify complex concepts affordably - your essential guide to design patterns.",
  openGraph: {
    title: "Pragmatic .NET Code Rules",
    type: "website",
    url: "https://thecodeman.net/design-patterns-simplified",
    description: "Master design patterns easily with this beginner-level ebook. Simplify complex concepts affordably - your essential guide to design patterns.",
    images: [
      {
        url: 'https://thecodeman.net/og-ebookimage.png',
        width: "1000px",
        height: "700px"
      }
    ],
  },
  twitter: {
    title: "Pragmatic .NET Code Rules",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Master design patterns easily with this beginner-level ebook. Simplify complex concepts affordably - your essential guide to design patterns.",
    images: [
      {
        url: 'https://thecodeman.net/og-ebookimage.png',
        width: "1000px",
        height: "700px"
      }
    ]
  }
}

const CodeRules = () => {
  return (
    <>
      <section id="home-section" className="hero container">
        <div className="row d-md-flex no-gutters">
          <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text text-center mt-10'>
            {/* <p className="mb-4 header-sub-text">Who still wants to read a 500+ page book that costs over $100?<br />Instead, dive into...</p> */}
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text pt-5 float-left">
            <div className="text" >
              <h1 className='display-none'>Pragmatic .NET Code Rules</h1>
              <p className="header-text mt-4">Pragmatic .NET</p>
              <p className="header-text mtopminus10"><span className='text-yellow'>Code Rules</span> </p>
              <p className="mb-4 text-white"><b>A practical system for <span className='text-yellow'>automating clean, consistent, professional code</span> - in every .NET project you touch.</b></p>
              <p className="mb-4 text-white"><b>Learn how to build a predictable, consistent, self-cleaning codebase using .editorconfig, analyzers, Visual Studio Cleanup, and CI enforcement.</b></p>
              <h3 className="mb-4 text-white"><b><span className='text-yellow'>🎉 Black Friday Pre-Order - 50% OFF</span></b></h3>
              <EbookNewsletter />
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px button-padding'>Preorder</button></a>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 float-right">
            <Image src={'/images/ebook.png'} priority={true} alt={'Design Patterns Simplified ebook cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </section>
      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Are you tired of  <span className='text-yellow'> messy, inconsistent code?</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h3 className='text-yellow text-center'><b>Same team.</b></h3>
              <h3 className='text-yellow text-center'><b>Same IDE.</b></h3>
              <h3 className='text-yellow text-center'><b>Same language.</b></h3>
              <h5 className='pt-3'>And yet… every file looks different.</h5>
              <h5 className='pt-3'>You know the <span className='text-yellow'>pain:</span></h5>
              <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center'>
                  <h5>• “Please format this.”</h5>
                  <h5>• Endless PR nitpicking</h5>
                  <h5>• Styling conflicts instead of real conflicts</h5>
                  <h5>• Warnings everywhere in one project but not in another</h5>
                  <h5>• No one knows which style rules are correct anymore</h5>
                  <h5 className='pt-3'>This slows you down.</h5>
                  <h5>It drains mental energy.</h5>
                  <h5>It destroys PR velocity.</h5>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                  <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/ebook-devices.png'} alt={'Design Patterns Simplified ebook devices'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
          <div className="row text-center">
            <div className='col-cl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center'>
              <h4>You don’t need more discipline.</h4>
              <h3>You need a system.</h3>
            </div>
        </div>
        </div>
      </section>
      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">A clean codebase shouldn’t depend on humans </p>
              <p className="header-text"><span className='text-yellow'>It should enforce itself</span></p>
            </div>
          </div>
          <div className="row text-center">
             <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5">
              <div className="blog-entry text-center">
                <h3 className='text-white'>Imagine if your .NET codebase:</h3>
              </div>
            </div>
              </div>

          <div className="row text-center">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>✔ Auto-formats itself before every commit</h3>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>✔ Rejects unformatted PRs
                </h3>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>✔ Uses the same conventions across every project and team</h3>
             
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>✔ Eliminates all low-value PR comments</h3>
                
              </div>
            </div>
             <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>✔ Looks professional, predictable, and stable</h3>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">What <span className='text-yellow'>You'll Get</span></p>
            </div>
          </div>
          <div className="row text-center">

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h2 className='text-yellow text-center'><b>10 Practical Design Patterns</b></h2>
              <h5 className='pt-5'>I've carefully curated the design patterns that I've personally worked with in real-world projects, selecting those that have proven to be genuinely practical and valuable. The list contains:</h5>
              <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 text-center'>
                  <h5>1. Adapter</h5>
                  <h5>2. Bridge</h5>
                  <h5>3. Builder</h5>
                  <h5>4. Command</h5>
                  <h5>5. Composite</h5>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 text-center'>
                  <h5>6. Decorator</h5>
                  <h5>7. Factory Method</h5>
                  <h5>8. Observer</h5>
                  <h5>9. Singleton</h5>
                  <h5>10. Strategy</h5>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                  <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/ebook-devices.png'} alt={'Design Patterns Simplified ebook devices'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>

          </div>
          <hr className='background-yellow' />
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/real-world-example.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Real world example'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h2 className='text-yellow text-center pb-5'><b>Real-World Examples</b></h2>
              <h5 className='text-left'>• Explore real-world design pattern examples.</h5>
              <h5 className='text-left'>• Gain practical insights and hands-on experience.</h5>
              <h5 className='text-left'>• Apply patterns effectively in your projects.</h5>
              <h5 className='text-left'>• Solve real-world challenges.</h5>
              <h5 className='text-left'>• Enhance coding skills for robust applications.</h5>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
              </div>
            </div>
          </div>
          <hr className='background-yellow' />
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h2 className='text-yellow text-center'><b>Free GitHub Repository</b></h2>
              <h5 className='pt-5'>In addition to the code found in the book itself, as accompanying material comes a free GitHub repository with implementations of all 10 patterns in the C# programming language.</h5>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/github-repo.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Github repo'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>


      <section className="ftco-section background-yellow " id="newsletter-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <h2 className="text-black"><b>Who am I?</b></h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 ebook-profile-div">
                  <Image src={'/images/ebook-stefan.png'} className='mb-5 border-radius-20px ebook-profile-img' alt={'Design Patterns Simplified ebook - Profile image of the author, Stefan Djokic'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-md-6 ebook-about-div">
                  <p className='text-black text-font-2rem'><b>Hi friend, I'm Stefan</b></p>
                  <p className='text-black'>I am a senior software engineer with years of industry experience. I help a large number of developers to become better in their daily work through the content I share on social networks, blog and newsletter.</p>
                </div>
                <div className="col-md-12">
                  <p className='text-black'><i><b>"Keep it simple and focus on what matters. Don't let yourself be overwhelmed."</b></i> - Confucius</p>
                  <p className='text-black text-center'>My goal is to convey knowledge to people in such a way - <b>simple.</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><a className='text-black' href='https://thecodeman.net/blog'>Newsletter</a></p>
                  <p className='text-black text-font-2rem'><b>{config.NewsletterSubCount}</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><a className='text-black' href='https://www.linkedin.com/in/djokic-stefan/'>Linkedin</a></p>
                  <p className='text-black text-font-2rem'><b>{config.LinkedinFollowers}</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><a className='text-black' href='https://twitter.com/TheCodeMan__'>Twitter</a></p>
                  <p className='text-black text-font-2rem'><b>{config.TwitterFollowers}</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text"><span className='text-yellow'>Keep It Simple </span> with Design Patterns</p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CodeRules;