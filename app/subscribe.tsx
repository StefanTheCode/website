import './globals.css'
import config from '@/config.json'

export default function Subscribe() {
    return (
        <section className="ftco-section contact-section mb-3 mt-5 text-center" id="newsletter-section">
        <div className="container">
          <div className="row justify-content-center ">
            <div className="col-md-12 heading-section text-center " id="footer-news-web">
              <p className="header-text">Master .NET Technologies</p>
            </div>
            <div className='col-md-12'>
              <p>Join <span className='text-yellow'> {config.NewsletterSubCount}</span> to improve your .NET Knowledge.</p>
            </div>
          </div>
          <div className='container'>

          <div className="row text-center">
            <div className="col-md-2"></div>
            <div className="col-md-8"
              dangerouslySetInnerHTML={{
                __html: `
              <script async src="https://eocampaign1.com/form/e85a08a0-d239-11ed-bf00-69996e57973d.js"
                data-form="e85a08a0-d239-11ed-bf00-69996e57973d">
              </script>
            `
              }}
            />
            <div className="col-md-2"></div>
          </div>
          </div>
        </div>
      </section>
    )
}