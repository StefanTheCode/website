import './globals.css'

export default function Subscribe() {
    return (
        <section className="ftco-section contact-section mb-3 text-center" id="newsletter-section">
        <div className="container">
          <div className="row justify-content-center mb-5 pb-3">
            <div className="col-md-12 heading-section text-center " id="footer-news-web">
              <p className="header-text">Become a <span>.NET Pro</span></p>
              <p className="header-big">Newsletter</p>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-md-4"></div>
            <div className="col-md-4"
              dangerouslySetInnerHTML={{
                __html: `
              <script async src="https://eocampaign1.com/form/e85a08a0-d239-11ed-bf00-69996e57973d.js"
                data-form="e85a08a0-d239-11ed-bf00-69996e57973d">
              </script>
            `
              }}
            />
            <div className="col-md-4"></div>
          </div>
        </div>
      </section>
    )
}