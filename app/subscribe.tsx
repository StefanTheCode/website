import './globals.css'
import NewsletterForm from '@/components/NewsletterForm'

export default function Subscribe() {
  return (
    <section className="tcm-section tcm-section--last" id="newsletter-section">
      <div className="tcm-container">
        <div className="tcm-cta">
          <span className="tcm-eyebrow">Every Monday · Free</span>
          <h2 className="tcm-h2">One practical .NET &amp; architecture tip, every Monday.</h2>
          <p>Join 25,000+ engineers who improve their C# skills in a 5-minute read.</p>
          <NewsletterForm variant="inline" buttonText="Subscribe" className="tcm-form--center" />
          <span className="tcm-cta__note">No spam. Unsubscribe anytime.</span>
        </div>
      </div>
    </section>
  )
}
