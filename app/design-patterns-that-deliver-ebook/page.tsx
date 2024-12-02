import config from '@/config.json'
import Subscribe from '../subscribe';
import Affiliate from '../affiliate';
import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import EbookNewsletter from '@/components/ebookTestimonials';
import EbookReviews from '@/components/ebookReviews';
import { Metadata } from 'next';
import Image from 'next/image'
import EbookTestimonials2 from '@/components/ebook2Testimonials';
// import ogImage from '/og-ebookimage.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/design-patterns-that-deliver-ebook'),
  title: "Design Patterns that Deliver - ebook",
  alternates: {
    canonical: 'https://thecodeman.net/design-patterns-that-deliver-ebook',
  },
  description: "Master design patterns easily with this beginner-level ebook. Simplify complex concepts affordably - your essential guide to design patterns.",
  openGraph: {
    title: "Design Patterns Simplified ebook",
    type: "website",
    url: "https://thecodeman.net/design-patterns-that-deliver-ebook",
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
    title: "Design Patterns Simplified ebook",
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

const Ebook = () => {
  return (
    <>
      <section id="home-section" className="hero container">
        <div className="row d-md-flex no-gutters">
          <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text text-center mt-10'>
            {/* <p className="mb-4 header-sub-text">Who still wants to read a 500+ page book that costs over $100?<br />Instead, dive into...</p> */}
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text pt-5 float-left">
            <div className="text" >
              <h1 className='display-none'>Design Patterns that Deliver</h1>
              <p className="header-text mt-4">Solve <span className='text-yellow'>Real Problems</span></p>
              <p className="header-text"> with<span className='text-yellow'> 5 Design Patterns</span> </p>
              <p className="mb-4 text-white mt-4"><b><span className='text-yellow'><b>This isn’t just another design patterns book.</b></span> <br />Dive into <span className='text-yellow'><b>real-world examples</b></span> and practical solutions to <span className='text-yellow'><b>real problems</b></span> in <span className='text-yellow'><b>real applications</b></span>. With advanced topics and hands-on guidance, this ebook equips you to implement these patterns effectively and tackle complex challenges with confidence.</b></p>
              <p className="mb-4 text-white"><b><span className='text-yellow'> 650+ developers</span> are already building better software - <span className='text-yellow'><b>join them NOW!</b></span></b></p>
              <EbookTestimonials2 />
              <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'><button className='btn btn-lg btn-primary border-radius-10px button-padding'>Start Reading Now</button></a>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 float-right">
            <Image src={'/images/ebook-thumb2.png'} priority={true} alt={'Design Patterns Simplified ebook cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </section>
      <hr className='background-yellow' />

      {/* <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">In Their  <span className='text-yellow'> Own Words</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <div className='row'>
              <EbookReviews />
              </div>
              <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Start reading now</button></a>
            </div>
          </div>
        </div>
      </section>
      <hr className='background-yellow'/> */}

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Look what's <span className='text-yellow'>Inside 👇</span></p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
              <div className="blog-entry text-left" style={{ width: '100%' }}>
                <details className="collapsible">
                  <summary className="text-white" style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>From Blueprint to Reality:
                    <span className="text-yellow"> Mastering the <b>Builder Pattern</b></span>
                  </summary>
                  <ul style={{ marginTop: '10px', listStyleType: 'none', padding: 0 }}>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Real World Problem
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Solution + Basic Builder Implementation
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Definition + UML Diagram
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Fluent Builder Pattern
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Director Class
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Nested Builder objects (Hierarchical)
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Builder Pattern + FluentValidation
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Step Builder Pattern
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Pros & Cons
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • When to & When NOT to use it?
                      </div>
                    </li>
                  </ul>
                </details>
                <hr className='background-yellow' />
                <details className="collapsible">
                  <summary className="text-white" style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Scalable Solutions: <span className="text-yellow"> Customizing with the <b>Decorator Pattern</b></span>
                  </summary>
                  <ul style={{ marginTop: '10px', listStyleType: 'none', padding: 0 }}>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Real World Problem
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Solution + Basic Decorator Implementation
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Definition + UML Diagram
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Composing Decorators
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Adding Scutor to Decorator Pattern
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Real Problem - Resilient API Service (Retry Policy)
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Pros & Cons
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • When to & When NOT to use it?
                      </div>
                    </li>
                  </ul>
                </details>
                <hr className='background-yellow' />
                <details className="collapsible">
                  <summary className="text-white" style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Effortless Adaptability: <span className='text-yellow'>Mastering the <b>Strategy Pattern</b></span>
                  </summary>
                  <ul style={{ marginTop: '10px', listStyleType: 'none', padding: 0 }}>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Real World Problem
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Solution + Basic Strategy Implementation
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Definition + UML Diagram
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Dependency Injection with Strategy Pattern
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Combining Strategy Pattern with Factory Pattern
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Using Configuration Settings for Strategy Selection
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Pros & Cons
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • When to & When NOT to use it?
                      </div>
                    </li>
                  </ul>
                </details>
                <hr className='background-yellow' />
                <details className="collapsible">
                  <summary className="text-white" style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Plug and Play: <span className='text-yellow'>Simplifying Integration with the <b>Adapter Pattern</b></span>

                  </summary>
                  <ul style={{ marginTop: '10px', listStyleType: 'none', padding: 0 }}>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Real World Problem
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Solution + Basic Adapter Implementation
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Definition + UML Diagram
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Object Adapter Pattern
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Class Adapter Pattern
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Example: Cloud Providers Integration
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Pros & Cons
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • When to & When NOT to use it?
                      </div>
                    </li>
                  </ul>
                </details>
                <hr className='background-yellow' />
                <details className="collapsible">
                  <summary className="text-white" style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    The Orchestrator’s Secret: <span className='text-yellow'>Master the <b>Mediator Pattern</b></span>

                  </summary>
                  <ul style={{ marginTop: '10px', listStyleType: 'none', padding: 0 }}>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Real World Problem
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Solution + Basic Mediator Implementation
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Definition + UML Diagram
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Cross-Cutting Concerns
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • MediatR Library for Request/Response Handling in Clean Architecture
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Event Aggregation
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • Pros & Cons
                      </div>
                    </li>
                    <li>
                      <div style={{ backgroundColor: 'rgba(128, 0, 128, 0.2)', padding: '10px', borderRadius: '5px', marginBottom: '5px', color: 'white' }}>
                        • When to & When NOT to use it?
                      </div>
                    </li>
                  </ul>
                </details>
                <hr className='background-yellow' />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'><button className='btn btn-lg btn-primary border-radius-10px button-padding'>Start Reading Now</button></a>
            </div>
          </div>
        </div>
      </section>
      <hr className='background-yellow' />

      <section className="ftco-section" id="blog-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 heading-section text-center">
              <p className="header-text">Why <span className='text-yellow'>this</span> Ebook</p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Practical and Actionable                </h3>
                <br />
                <h5 >Say goodbye to pages of fluff and endless theory. This book dives straight into the <b className='text-yellow'>core of what matters</b> - practical, real-world design patterns you can use right away.</h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Real-World Implementation
                </h3>
                <br />
                <h5 >Each design pattern is explained with <b className='text-yellow'>real-world examples</b>, so you’ll know not just what to do, but why and how it applies to real projects.</h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Advanced Yet Accessible</h3>
                <br />
                <h5 >The book balances advanced concepts with <b className='text-yellow'>easy-to-follow explanations</b>, making it perfect for intermediate and experienced developers looking to level up.</h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>All-in-One Learning Package</h3>
                <br />
                <h5 >From real-world scenarios to a complete <b className='text-yellow'>GitHub repository</b> with C# examples, plus bonus code in 4 other languages, this book gives you everything you need in one place.
                </h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Interview-Ready Knowledge</h3>
                <br />
                <h5>With a mini-ebook featuring <b className='text-yellow'>100 interview questions and answers</b>, you’ll not only master design patterns but also gain a competitive edge in job interviews.</h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Affordable and Value-Packed</h3>
                <br />
                <h5>For that price, you’ll get a <b className='text-yellow'>treasure trove of knowledge</b> and resources—making this book an investment in your future as a developer.</h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'><button className='btn btn-lg btn-primary border-radius-10px button-padding'>Start Reading Now</button></a>
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
              <h2 className='text-yellow text-center'><b>5 Practical Design Patterns</b></h2>
              <h5 className='pt-5'>Carefully selected from years of real-world experience, these are the 5 most impactful and commonly used design patterns in software development. Each pattern is explained in detail and paired with actionable examples:
              </h5>
              <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center'>
                  <br />
                  <h4>1. Builder</h4>
                  <h4>2. Decorator</h4>
                  <h4>3. Strategy</h4>
                  <h4>4. Adapter</h4>
                  <h4>5. Mediator</h4>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                  <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'>
                    <button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Start reading now</button></a>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/stefan-ebook.png'} alt={'Design Patterns Simplified ebook devices'} width={0} height={0} sizes="100vw" style={{ width: '80%', height: 'auto' }} />
            </div>
          </div>
          <hr className='background-yellow' />
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/real-world-examples.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Real world example'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h2 className='text-yellow text-center pb-5'><b>Real-World Examples</b></h2>
              <h5 className='text-left'>• Learn each design pattern through real-world scenarios to see exactly how they solve real challenges.</h5>
              <h5 className='text-left'>• Master how to apply patterns effectively to create clean, scalable, and maintainable code.</h5>
              <h5 className='text-left'>• Strengthen your ability to tackle complex coding problems confidently.</h5>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Start reading now</button></a>
              </div>
            </div>
          </div>
          <hr className='background-yellow' />
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 text-center">
              <h2 className='text-yellow text-center'><b>Advanced Insights</b></h2>
              <h5 className='pt-5'>Dive deeper into <b className='text-yellow'>advanced concepts</b> for each pattern, offering insights that go beyond the basics to elevate your coding skills.</h5>
              <div className='row'>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <Image src={'/images/advanced-insights.png'} alt={'Design Patterns Simplified ebook devices'} width={0} height={0} sizes="100vw" style={{ width: '80%', height: 'auto' }} />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 text-center">
              <h2 className='text-yellow text-center'><b>Free GitHub Repository</b></h2>
              <h5 className='pt-5'>The complete code from the book, with extras, is in the Solution of 20 mini-projects. You get full access to the GitHub repository.</h5>
              <div className='row'>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                <Image src={'/images/github.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Github repo'} width={0} height={0} sizes="100vw" style={{ width: '80%', height: 'auto' }} />
                </div>
              </div>
            </div>
          </div>
          <hr className='background-yellow' />
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h2 className='text-yellow text-center'><b>BONUS: Mini Ebook – Interview Prep</b></h2>
              <h5 className='pt-5'>Sharpen your skills with a mini ebook featuring 100 design pattern interview questions and answers to give you an edge in job interviews.</h5>
              <h2 className='pt-5 text-yellow text-center'><b>BONUS: Multilingual Code Samples (Soon!)</b></h2>
              <h5 className='pt-5'>Explore code examples in 4 additional programming languages, making this book a versatile resource regardless of your tech stack.

</h5>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Start reading now</button></a>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <Image src={'/images/interview-prep.png'} className='border-radius-20px' alt={'Design Patterns Simplified ebook - Github repo'} width={0} height={0} sizes="100vw" style={{ width: '80%', height: 'auto' }} />
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
                  <p className='text-black'>I am a <b>Senior Software Engineer</b> and <b>Microsoft MVP</b> with years of industry experience. I help a large number of developers to become better in their daily work through the content I share on social networks, blog and newsletter.</p>
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
          <div className="row">
            <div className="col-md-5">
            </div>
            <div className="col-md-2">
            <Image src={'/images/mvp.png'} className='mb-5 mt-5' alt={'Stefan Djokic - Microsoft MVP'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="col-md-5">
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
              <p className="header-text">Solve Real Problems now</p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/buy/5e943b0e-a3fd-4c3d-950e-3671762ebf85'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Start reading now</button></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Ebook;