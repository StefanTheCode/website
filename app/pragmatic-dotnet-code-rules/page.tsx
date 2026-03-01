import config from '@/config.json'
import Subscribe from '../subscribe';
import Affiliate from '../affiliate';
import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import EbookNewsletter from '@/components/ebookTestimonials';
import EbookReviews from '@/components/ebookReviews';
import { Metadata } from 'next';
import Image from 'next/image'
import Video from 'next/image'
// import ogImage from '/og-ebookimage.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/pragmatic-dotnet-code-rules'),
  title: "Pragmatic .NET Code Rules",
  alternates: {
    canonical: 'https://thecodeman.net/pragmatic-dotnet-code-rules',
  },
  description: "Learn how to build a predictable, consistent, self-cleaning codebase using .editorconfig, analyzers, Visual Studio Cleanup, and CI enforcement.",
  openGraph: {
    title: "Pragmatic .NET Code Rules",
    type: "website",
    url: "https://thecodeman.net/pragmatic-dotnet-code-rules",
    description: "Learn how to build a predictable, consistent, self-cleaning codebase using .editorconfig, analyzers, Visual Studio Cleanup, and CI enforcement.",
    images: [
      {
        url: 'https://thecodeman.net/og-course.png',
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
    description: "Learn how to build a predictable, consistent, self-cleaning codebase using .editorconfig, analyzers, Visual Studio Cleanup, and CI enforcement.",
    images: [
      {
        url: 'https://thecodeman.net/og-course.png',
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
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 slider-text pt-5 float-left">
            <div className="text" >
              <h1 className='display-none'>Pragmatic .NET Code Rules</h1>
              <p className="header-text mt-4">Pragmatic .NET</p>
              <p className="header-text mtopminus10"><span className='text-yellow'>Code Rules</span> </p>
              <h2 className="mb-4 text-white">Stop Arguing About Code Style in .NET Projects!</h2>
              <p className="mb-4 text-white">Enforce clean code, analyzers, and CI quality gates automatically - using the exact setup I run in production.</p>
              <p className="text-white">• No more “tabs vs spaces” debates</p>
              <p className="text-white">• No more broken builds because of formatting</p>
              <p className="mb-4 text-white">• No more relying on code reviews to enforce rules</p>
              <h2 className="text-white">Get the exact setup I use in production:</h2>
              <a
  href="https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e"
  className="lemonsqueezy-button"
>
  <button className="btn btn-lg btn-primary border-radius-10px button-padding">
    🛒 Preorder for <span className="text-green"> $74.89</span>
  </button>
</a>

              <p className='mb-4'>⚠️ 20 spots left at this price.</p>
              <EbookNewsletter />
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 float-right">
            <Image src={'/images/course.png'} priority={true} alt={'Design Patterns Simplified ebook cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
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
                <h2 className='text-yellow'>Imagine if your .NET codebase:</h2>
              </div>
              <hr></hr>
              <div className="blog-entry text-center pt-5">
                <h3 className='text-success'>✔ <span className='text-white'> Auto-formats itself before every commit</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Rejects unformatted PRs</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Uses the same conventions across every project and team</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Eliminates all low-value PR comments</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Looks professional, predictable, and stable</span></h3>
                <h3 className='text-white pt-5'>This is how modern .NET teams operate.</h3>
                <h2 className='text-yellow pt-5'>And this is exactly what <span className='text-overlay'> Pragmatic .NET Code Rules</span> teaches you </h2>
                <h1 className='text-yellow'> step-by-step.</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center">
          <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
        </div>
      </section >

      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <h2>Messy code doesn’t just look bad - <span className='text-yellow'><b> it slows down reviews, breaks CI, and creates friction between developers.</b></span></h2>
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
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 pt-5 mb-5 text-center">
                  <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/course2.png'} alt={'Design Patterns Simplified ebook devices'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
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
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12'>
              <div className="row justify-content-center mb-5">
                <div className="col-md-12 heading-section text-center">
                  <p className="header-text">What <span className='text-yellow'>You Will Learn</span></p>
                </div>
              </div>
              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>The Code Consistency Mindset</b></h2>
                  <h5 className='pt-5'>Understand why <span className='text-yellow'> clean, unified code isn’t just “nice to have”</span> - it’s a force multiplier for productivity, team velocity, and long-term maintainability.</h5>
                  <h5 className='pt-3'>• See how inconsistent code silently kills delivery speed</h5>
                  <h5>• Learn the mindset top engineering teams use to stay aligned</h5>
                  <div className='row'>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 pt-5  mb-5 text-center">
                      <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/mindset.png'} alt={'Design Patterns Simplified ebook devices'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>

              </div>
              <hr className='background-yellow' />
              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/editorconfig.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Real world example'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center pb-5'><b>.editorconfig Deep Dive</b></h2>
                  <h5 className='text-center'>Master the most underrated tool in the .NET ecosystem and make every IDE follow the same rules—automatically.</h5>
                  <h5 className='text-center pt-3'>• Build rock-solid formatting, naming, and analyzer rules</h5>
                  <h5 className='text-center'>• Structure .editorconfig for both small projects and massive solutions</h5>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 pt-5  text-center">
                    <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
                  </div>
                </div>
              </div>
              <hr className='background-yellow' />
              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>Visual Studio Cleanup Automation</b></h2>
                  <h5 className='pt-5'>Turn Visual Studio into a self-cleaning machine that formats code before you even think about it.</h5>
                  <h5 className='text-center pt-3'>• Create Cleanup Profiles that instantly fix styling issues</h5>
                  <h5 className='text-center'>• Remove 90% of manual cleanup from your workflow</h5>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 pt-5  text-center">
                    <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/cleanup.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Github repo'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
              <hr className='background-yellow' />
              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/errors.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Real world example'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center pb-5'><b>Analyzers & Warnings-As-Errors</b></h2>
                  <h5 className='text-center'>Catch quality issues at the source instead of wasting reviewer time on low-value comments.</h5>
                  <h5 className='text-center pt-3'>• Configure analyzers that actually matter</h5>
                  <h5 className='text-center'>• Enforce rules without overwhelming developers with noise</h5>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 pt-5 text-center">
                    <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
                  </div>
                </div>
              </div>
              <hr className='background-yellow' />
              <div className="row text-center">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center'><b>dotnet format + CI Enforcement</b></h2>
                  <h5 className='pt-5'>Build a CI pipeline that refuses messy code and guarantees consistency across your entire organization.</h5>
                  <h5 className='text-center pt-3'>• Add dotnet format to your local and CI workflows</h5>
                  <h5 className='text-center'>• Fail PRs automatically when formatting rules are violated</h5>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 pt-5 text-center">
                    <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
                  <Image src={'/images/ci.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Github repo'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
              <hr className='background-yellow' />
              <div className="row text-center">
                <div className='col-xl-1 col-lg-1 col-md-1 col-sm-1'></div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 mb-5 text-center vertical-center">
                  <Image src={'/images/slack.png'} className='border-radius-20px text-center' alt={'Design Patterns Simplified ebook - Real world example'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
                  <h2 className='text-yellow text-center pb-5'><b>Team-Wide Adoption Strategies</b></h2>
                  <h5 className='text-center'>Roll out code rules across your team smoothly, confidently, and without the usual resistance.</h5>
                  <h5 className='text-center pt-3'>• Introduce new rules gradually and strategically</h5>
                  <h5 className='text-center'>• Build a culture where clean, consistent code is the default</h5>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 pt-5 text-center">
                    <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">What You'll Get</p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5">
              <div className="blog-entry text-center pt-3">
                <h3 className='text-success'>✔ <span className='text-white'> Lifetime access</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> My production-ready .editorconfig</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Copy-paste ready files used in real-world .NET projects </span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> CI pipelines that fail PRs before humans do</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Clean Commit Checklist (PDF)</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Bonus video: Automating PR cleanup</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> Private comment section for Q&A</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'> All future updates included</span></h3>
                <h3 className='text-success'>✔ <span className='text-yellow'> Community Access</span></h3>
                <h3 className='text-white pt-5'>This is how modern .NET teams operate.</h3>
                <h2 className='text-yellow pt-5'>And this is exactly what <span className='text-overlay'> Pragmatic .NET Code Rules</span> teaches you </h2>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
            </div>
          </div>
        </div>
      </section >
      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Is This Course <span className='text-yellow'> Right for You?</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
              <div className="blog-entry text-center pt-3">
                <h2 className='text-danger'>Not for developers who:</h2>
                <h3 className='text-danger pt-3'>X <span className='text-white'> Prefer manual cleanup</span></h3>
                <h3 className='text-danger'>X <span className='text-white'> Believe “style doesn’t matter”</span></h3>
                <h3 className='text-danger'>X <span className='text-white'> Don’t want automation in their workflow</span></h3>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
              <div className="blog-entry text-center pt-3">
                <h2 className='text-success'>For developers who:</h2>
                <h3 className='text-success pt-3'>✔ <span className='text-white'>Work in .NET teams</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Want predictable, standardized code</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Are tired of PRs full of style corrections</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Want CI/CD to enforce consistency</span></h3>
                <h3 className='text-success'>✔ <span className='text-white'>Care about maintainability and professionalism</span></h3>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center">
              <h2 className='text-yellow mb-4'>If you want an enforceable, automated setup - this is for you!</h2>

              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
            </div>
          </div>
        </div>
      </section >

      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">The Full <span className='text-yellow'> Curriculum</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5">
              <div className="blog-entry text-left pt-3">

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🧱 00. Course Introduction
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">00.01 – Welcome</h5>
                    <h5 className="text-white text-left">00.02 – What You Will Learn</h5>
                    <h5 className="text-white text-left">00.03 – Who This Course Is For</h5>
                    <h5 className="text-white text-left">00.04 – Tools & Requirements</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🗂️ 01. The Foundation: EditorConfig
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">01.01 – Why Code Style Consistency Matters</h5>
                    <h5 className="text-white text-left">01.02 – Creating the CleanStart Solution Structure</h5>
                    <h5 className="text-white text-left">01.03 – What EditorConfig Is & How It Works</h5>
                    <h5 className="text-white text-left">01.04 – Adding the <code>.editorconfig</code> File</h5>
                    <h5 className="text-white text-left">01.05 – Running Code Cleanup to Apply Rules</h5>
                    <h5 className="text-white text-left">01.06 – EditorConfig Tips, Tricks & Best Practices</h5>
                    <h5 className="text-white text-left">01.07 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🧹 02. Automating Code Cleanup
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">02.01 – Visual Studio Code Cleanup Profiles</h5>
                    <h5 className="text-white text-left">02.02 – Running Cleanup Automatically on Save</h5>
                    <h5 className="text-white text-left">02.03 – One-Click Full Solution Cleanup</h5>
                    <h5 className="text-white text-left">02.04 – Git Pre-Commit Hooks for Formatting</h5>
                    <h5 className="text-white text-left">02.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🚨 03. Diagnostics & Treating Warnings as Errors
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">03.01 – Understanding Diagnostic Severities</h5>
                    <h5 className="text-white text-left">03.02 – Organizing Rules: Suggestion, Warning, Error</h5>
                    <h5 className="text-white text-left">03.03 – Enforcing Warnings as Errors in .NET Projects</h5>
                    <h5 className="text-white text-left">03.04 – How This Prevents Future Bugs</h5>
                    <h5 className="text-white text-left">03.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🔍 04. Static Analysis in .NET
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">04.01 – Introduction to .NET Analyzers</h5>
                    <h5 className="text-white text-left">04.02 – Adding StyleCop to the Project</h5>
                    <h5 className="text-white text-left">04.03 – Adding SonarAnalyzer for Deeper Analysis</h5>
                    <h5 className="text-white text-left">04.04 – Configuring Analyzer Rules in EditorConfig</h5>
                    <h5 className="text-white text-left">04.05 – Identifying Real-World Issues with Static Analysis</h5>
                    <h5 className="text-white text-left">04.06 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🏗️ 05. Centralized Settings with Directory.Build.props
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">05.01 – Why Centralized Build Settings Matter</h5>
                    <h5 className="text-white text-left">05.02 – Creating Directory.Build.props</h5>
                    <h5 className="text-white text-left">05.03 – Adding Global Usings, LangVersion &amp; Nullable Settings</h5>
                    <h5 className="text-white text-left">05.04 – Unifying All Projects with Shared Rules</h5>
                    <h5 className="text-white text-left">05.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    ⚙️ 06. Visual Studio Productivity &amp; Clean Code Features
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">06.01 – Essential VS Formatting Features</h5>
                    <h5 className="text-white text-left">06.02 – File Header Templates</h5>
                    <h5 className="text-white text-left">06.03 – Custom Snippets for Faster Development</h5>
                    <h5 className="text-white text-left">06.04 – Format on Save, Run Cleanup on Build</h5>
                    <h5 className="text-white text-left">06.05 – Chapter Recap</h5>
                  </div>
                </details>


                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🧹 07. Project Cleanup &amp; Consistency Maintenance
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">07.01 – Standard Project Folder Structure</h5>
                    <h5 className="text-white text-left">07.02 – Enabling nullable &amp; analyzing warnings</h5>
                    <h5 className="text-white text-left">07.03 – Removing unused files, refs &amp; dependencies</h5>
                    <h5 className="text-white text-left">07.04 – Normalizing namespaces &amp; usings</h5>
                    <h5 className="text-white text-left">07.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🧱 08. Architecture Tests (Enforcing Boundaries)
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">08.01 – Why Architecture Tests Matter</h5>
                    <h5 className="text-white text-left">08.02 – Adding NetArchTest</h5>
                    <h5 className="text-white text-left">08.03 – Testing Domain → Application → Infrastructure Relationships</h5>
                    <h5 className="text-white text-left">08.04 – Preventing Cycles &amp; Wrong References</h5>
                    <h5 className="text-white text-left">08.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🔄 09. Integrating Code Quality into CI/CD
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">09.01 – dotnet format in CI</h5>
                    <h5 className="text-white text-left">09.02 – Running Analyzers in CI</h5>
                    <h5 className="text-white text-left">09.03 – Enforcing Warnings as Errors in the Pipeline</h5>
                    <h5 className="text-white text-left">09.04 – Preventing "Dirty Code" from Entering the Main Branch</h5>
                    <h5 className="text-white text-left">09.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🧭 10. Logging &amp; Observability
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">10.01 – Adding Serilog to the Project</h5>
                    <h5 className="text-white text-left">10.02 – Structured Logging Best Practices</h5>
                    <h5 className="text-white text-left">10.03 – Adding OpenTelemetry (OTEL) Basics</h5>
                    <h5 className="text-white text-left">10.04 – Tracing Requests in an API</h5>
                    <h5 className="text-white text-left">10.05 – Chapter Recap</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🎁 11. Bonus: Create Your Own Clean .NET Project Template
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">11.01 – Turning the CleanStart Solution Into a Template</h5>
                    <h5 className="text-white text-left">11.02 – Exporting as a Visual Studio Template</h5>
                    <h5 className="text-white text-left">11.03 – Exporting as a dotnet new Template</h5>
                    <h5 className="text-white text-left">11.04 – Sharing the Template with Your Team</h5>
                    <h5 className="text-white text-left">11.05 – Course Wrap-Up</h5>
                  </div>
                </details>

                <details className="curriculum-details">
                  <summary className="text-yellow">
                    🤖 12. AI-Assisted Dependency &amp; PR Review
                  </summary>

                  <div className="pt-3">
                    <h5 className="text-white text-left">12.01 – Why Use AI for Dependency Updates</h5>
                    <h5 className="text-white text-left">12.02 – Setting Up Dependabot for NuGet in .NET</h5>
                    <h5 className="text-white text-left">12.03 – Creating a GitHub Action for AI PR Review</h5>
                    <h5 className="text-white text-left">12.04 – Designing Effective Prompts for Safe Updates</h5>
                    <h5 className="text-white text-left">12.05 – Optional: Labels, Changelog &amp; Notifications</h5>
                    <h5 className="text-white text-left">12.06 – Chapter Recap</h5>
                  </div>
                </details>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
            </div>
          </div>
        </div>
      </section >


      <section className="ftco-section background-yellow " id="newsletter-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <h2 className="text-black"><b>Meet Your Instructor</b></h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2">
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12 text-center">
                  <Image src={'/images/ebook-stefan.png'} className='border-radius-20px course-profile-img' alt={'Profile image of the author, Stefan Djokic'} width={0} height={0} sizes="20vw" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'><b>Hi friend, I'm Stefan Đokić</b></p>
                  <p className='text-black text-font-2rem'>Microsoft MVP, Senior Software Engineer, consultant, and creator of TheCodeMan.net.</p>
                  <h5 className='text-black pt-3'>For more than 10 years, I've been building large-scale .NET solutions where consistency, clarity, and automation aren’t optional - they're the only way teams can ship fast and reliably.</h5>
                  <h5 className='text-black pt-3'>Everything in this course comes from real production experience, not theory, not academic examples, and not "ideal world" scenarios.</h5>
                </div>
                <div className="col-md-12  text-center pt-3">
                  <p className='text-black'><i><b>"Keep it simple and focus on what matters. Don't let yourself be overwhelmed."</b></i> - Confucius</p>
                  <p className='text-black text-center'>My goal is to convey knowledge to people in such a way - <b>simple.</b></p>
                </div>
                <div className="col-md-12 pt-3 text-center">
                  <Image src={'/images/mvp.png'} className='course-profile-img' alt={'Profile image of the author, Stefan Djokic'} width={0} height={0} sizes="20vw" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
            </div>
            <div className="col-md-2">
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

      <section className="ftco-section" id="faq-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">
                Frequently Asked <span className="text-yellow"> Questions</span>
              </p>
            </div>
          </div>

          <div className="row text-left">
            {/* Left column */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-5">
              <div className="blog-entry text-left pt-3">
                <h3 className="text-yellow text-left pt-3">
                  ❓01. What platform is the course hosted on?
                </h3>
                <h5 className="text-white text-left">
                  💡 The course is hosted on <span className="text-yellow">Skool</span>, a modern platform that combines
                  video lessons, community, and discussions in one place.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓02. Is there a community included and is it free?
                </h3>
                <h5 className="text-white text-left">
                  💡 Yes. You get access to a private <span className="text-yellow">Skool community</span> where we discuss
                  code rules, share setups, and ask questions. Community access is{' '}
                  <span className="text-yellow">completely free</span> and included with the course.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓03. Who is this course for?
                </h3>
                <h5 className="text-white text-left">
                  💡 .NET developers who want clean, consistent, automated code. It’s great for people working in teams,
                  maintaining long-lived projects, or leading code quality initiatives.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓04. What knowledge level do I need?
                </h3>
                <h5 className="text-white text-left">
                  💡 You should be comfortable with C# and basic .NET projects. The content is practical and accessible for
                  <span className="text-yellow"> beginner+</span> and <span className="text-yellow">intermediate</span>{' '}
                  developers, and still very useful for seniors and team leads who want a system they can roll out to
                  their teams.
                </h5>
              </div>
            </div>

            {/* Right column */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-5">
              <div className="blog-entry text-left pt-3">
                <h3 className="text-yellow text-left pt-3">
                  ❓ 05. When does the course release?
                </h3>
                <h5 className="text-white text-left">
                  💡 Early access to the first module is planned for <span className="text-yellow">February 2026</span>, and the
                  full course is scheduled for <span className="text-yellow">March 2026</span>.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓ 06. Do I get lifetime access and updates?
                </h3>
                <h5 className="text-white text-left">
                  💡 Yes. Your purchase includes <span className="text-yellow">lifetime access</span> to all lessons and any
                  future updates or improvements to the course.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓ 07. Will the price increase later?
                </h3>
                <h5 className="text-white text-left">
                  💡 Yes. The pre-order is <span className="text-yellow">heavily discounted</span>.
                  When the course officially launches, the price will increase.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓  08. Is there a refund policy?
                </h3>
                <h5 className="text-white text-left">
                  💡 Pre-orders are <span className="text-yellow">refundable up until the official course release</span>.
                  If you feel it’s not for you, just reach out before launch.
                </h5>

                <h3 className="text-yellow text-left pt-3">
                  ❓ 09. What should I do next if I want to enroll?
                </h3>
                <h5 className="text-white text-left">
                  💡 Click the <span className="text-yellow">Pre-Order</span> button below and secure your spot in the
                  limited pre-release. You’ll get early access to content and free community access.
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Lock in early access & save before launch!</p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/105be4cc-816d-4ccb-b588-858cf96e958e'><button className='btn btn-lg btn-primary border-radius-10px button-padding'> 🛒 Preorder for <span className='text-green'> $74.89</span></button></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CodeRules;