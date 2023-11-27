import config from '@/config.json'
import Subscribe from '../subscribe';
import Affiliate from '../affiliate';
import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import EbookNewsletter from '@/components/ebookTestimonials';
import EbookReviews from '@/components/ebookReviews';
import { Metadata } from 'next';

export const metadata:Metadata = {
  title: "Stefan Djokic | Design Patterns Simplified ebook",
  description: "Go-to resource for understanding the core concepts of design patterns without the overwhelming complexity. In this concise and affordable ebook, I've distilled the essence of design patterns into an easy-to-digest format. It is a Beginner level."
}

const Ebook = () => {
  return (
    <>
      <section id="home-section" className="hero container">
        <div className="row d-md-flex no-gutters">
        <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center'>
        <h2>Get <b className='text-yellow'>37%</b> <span>discount for Black Friday!</span> <br/> Go and use code <b className='text-yellow'>“BLACKFRIDAY”</b> at checkout.</h2>
          </div>
          <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text text-center'>
            <p className="mb-4 header-sub-text">Who still wants to read a 500+ page book that costs over $100?<br />Instead, dive into...</p>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text pt-5 float-left">
            <div className="text" >
              <h1 className='display-none'>Design Patterns SIMPLIFIED</h1>
              <p className="header-text mt-4">Design Patterns</p>
              <p className="header-text mtopminus10"><span className='text-yellow'>SIMPLIFIED</span> </p>
              <p className="mb-4 text-white"><b>Go-to resource for understanding the <span className='text-yellow'>core concepts of design patterns</span> without the overwhelming complexity. In this concise and affordable ebook, I've distilled the essence of design patterns into an easy-to-digest format. It is a Beginner level.</b></p>
              <p className="mb-4 text-white"><b>Join <span className='text-yellow'>{config.EbookCopiesNumber} engineers</span>  to master design patterns the simplified way!</b></p>
              <EbookNewsletter/>
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12 float-right">
            <img src="/images/ebook.png" alt="Profile image of Stefan Djokic" width="100%" height="100%" />
          </div>
        </div>
      </section>
      <hr className='background-yellow'/>

      <section className="ftco-section" id="blog-section">
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
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
            </div>
          </div>
        </div>
      </section>
      <hr className='background-yellow'/>

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
                <h3>Short and Focused</h3>
                <br />
                <h5 >No more wading through hundreds of pages of theory. I've trimmed the fat to deliver only what you need in a brief <b> 30-page guide</b>.
                </h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Real-World Examples
                </h3>
                <br />
                <h5 >Learn each design pattern through real-world examples, making it <b> easier to apply</b> them to your own projects.
                </h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Affordable</h3>
                <br />
                <h5 >Get access to valuable knowledge without breaking the bank. <b>Affordable pricing</b> for every developer.
                </h5>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 mb-5">
              <div className="blog-entry text-center">
                <h3>Code Access</h3>
                <br />
                <h5 >Access code samples and <b>practical implementations</b> to reinforce your understanding.
                </h5>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
              <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
            </div>
          </div>
        </div>
      </section>

      <hr className='background-yellow'/>

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
              <img src="/images/ebook-devices.png"  alt="Profile image of Stefan Djokic" width="100%"  />
            </div>

          </div>
          <hr className='background-yellow'/>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <img className='border-radius-20px' src="/images/real-world-example.png" alt="Profile image of Stefan Djokic" width="100%" />
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
          <hr className='background-yellow'/>
          <div className="row text-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center">
              <h2 className='text-yellow text-center'><b>Free GitHub Repository</b></h2>
              <h5 className='pt-5'>In addition to the code found in the book itself, as accompanying material comes a free GitHub repository with implementations of all 10 patterns in the C# programming language.</h5>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5 text-center">
                <a href='https://stefandjokic.lemonsqueezy.com/checkout/buy/d71f1003-7b56-4b96-8136-1d769f53eb79'><button className='btn btn-lg btn-primary border-radius-10px mt-5 button-padding'>Download for <span className='text-green'><b> $9.95</b></span></button></a>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5 text-center vertical-center">
              <img src="/images/github-repo.png" className='border-radius-20px' alt="Profile image of Stefan Djokic" width="100%"/>
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
                <img src="/images/ebook-stefan.png" className='mb-5 border-radius-20px ebook-profile-img' alt="Profile image of Stefan Djokic" />
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
                  <p className='text-black text-font-2rem'>Newsletter</p>
                  <p className='text-black text-font-2rem'><b>{config.NewsletterSubCount}</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'>Linkedin</p>
                  <p className='text-black text-font-2rem'><b>{config.LinkedinFollowers}</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12 text-center">
                  <p className='text-black text-font-2rem'>Twitter</p>
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

export default Ebook;