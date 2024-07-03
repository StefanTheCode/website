import './globals.css'
import config from '@/config.json'

export default function Help() {
  return (
    <section className="ftco-section contact-section mb-3">
      <div className="container">
        <div className="row justify-content-center pb-3">
          <div className="col-md-12 text-center mb-5">
            <h3><b>There are 3 ways I can help you:</b></h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <h4><a href='/design-patterns-simplified'>Design Patterns Simplified ebook</a></h4>
             <p>Go-to resource for understanding the core concepts of design patterns without the overwhelming complexity. In this concise and affordable ebook, I've distilled the essence of design patterns into an easy-to-digest format. It is a Beginner level. <span><a href='/design-patterns-simplified'>Check out it here.</a></span></p>
             <br/>
          </div>
          <div className='col-md-12'>
          <h4><a href='/sponsorship'>Sponsorship</a></h4>
            <p>Promote yourself to {config.NewsletterSubCount} by sponsoring this newsletter.</p>
            <br/>
        </div>
        <div className='col-md-12'>
          <h4 ><a href='/'>Join .NET Pro Weekly Newsletter</a></h4>
            
            <p>Every Monday morning, I share 1 actionable tip on C#, .NET & Arcitecture topic, that you can use right away.</p>
        </div>
        </div>
        <br />

      </div>
    </section>
    //    <section className="ftco-section contact-section text-center" id="newsletter-section">
    //    <div className="container">
    //      <div className="row justify-content-center">
    //        <div className='col-md-2'></div>
    //        <div className="col-md-8 heading-section text-center " id="footer-news-web">
    //          <hr className="hr" />

    //          <p className="header-text">Design Patterns Simplified</p>
    //        </div>
    //        <div className='col-md-2'></div>
    //      </div>
    //      <div className="row text-center">
    //        <div className="col-md-2"></div>
    //        <div className="col-md-8">
    //          <h2 className='subheading'>In this concise and affordable ebook, I've distilled the essence of design patterns into an easy-to-digest format. <br />
    //            <a href="https://thecodeman.net/design-patterns-simplified"><b> Join {config.EbookCopiesNumber}+ readers here.</b></a></h2>
    //        </div>
    //        <div className="col-md-2"></div>
    //      </div>
    //    </div>
    //  </section>
  )
}