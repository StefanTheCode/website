import './globals.css'
import config from '@/config.json'
import NewsletterForm from '@/components/NewsletterForm'

export default function Subscribe() {
    return (
        <section className="ftco-section contact-section mb-3 mt-5 text-center" id="newsletter-section">
        <div className="container">
          <div className="row justify-content-center ">
            <div className="col-md-12 heading-section text-center " id="footer-news-web">
              <p className="header-text">1 Practical .NET & Architecture Tip Every Monday</p>
            </div>
            <div className='col-md-12'>
              <p>Join <span className='text-yellow'> {config.NewsletterSubCount}</span> who mass-improve their .NET skills with actionable tips on C#, Software Architecture & Best Practices.</p>
            </div>
          </div>
          <div className='container'>

          <div className="row text-center">
            <div className="col-md-2"></div>
            <NewsletterForm className="col-md-8" />
            <div className="col-md-2"></div>
          </div>
          </div>
        </div>
      </section>
    )
}