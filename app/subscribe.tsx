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
            <script async src="https://eomail4.com/form/861505f8-b3f8-11ef-896f-474a313dbc14.js" data-form="861505f8-b3f8-11ef-896f-474a313dbc14"></script>
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