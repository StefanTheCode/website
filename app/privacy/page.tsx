import { Metadata } from 'next'

// Site-wide privacy notice. Linked from the EU/UK consent bar (components/thirdParty.ts).
// TODO(Stefan): review the text before deploying - it describes what the site loads today.

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Privacy | TheCodeMan',
  description: 'What thecodeman.net collects, why, and how to reach me about your data.',
  alternates: { canonical: 'https://thecodeman.net/privacy' },
}

const sections: [string, string[]][] = [
  ['Who runs this site', ['thecodeman.net is run by Stefan Đokić (TheCodeMan.NET). Questions about your data: stefan@thecodeman.net.']],
  ['Newsletter and free courses', ['When you subscribe, your email address is stored with EmailOctopus so I can send you the newsletter and any free course you signed up for. Every email has an unsubscribe link.']],
  ['Analytics', ['Google Analytics and Google Tag Manager measure visits to this site (pages viewed, device type, approximate location).']],
  ['Advertising measurement', [
    'I use the Meta Pixel to measure which ads lead to visits, free trial clicks and sign-ups.',
    'Visitors from the EU/EEA and the UK are asked first, and the pixel loads only if they accept. Your choice is stored in your browser; clear this site’s storage to change it.',
    'Meta may combine this data with information it holds about you under its own policies. You can opt out of ad personalisation in your Facebook/Instagram ad settings.',
  ]],
  ['Purchases', ['Checkout is handled by Lemon Squeezy, the merchant of record. They process your payment and billing details under their own privacy policy. I receive your name, email, country and order details to deliver the product and support you.']],
  ['The AI for Developers community', ['The community runs on Skool. When you join, Skool processes your account and payment details under its own privacy policy.']],
  ['Hosting', ['The site is hosted on Netlify.']],
  ['Your rights', ['You can ask for access, correction, deletion or a copy of your data, object to processing, and complain to your data protection authority. Email stefan@thecodeman.net.']],
]

const Privacy = () => (
  <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mt-5 mb-5">
          <h1 className="text-white mb-2">Privacy</h1>
          <p className="text-white mb-5" style={{ opacity: 0.7 }}>Last updated: 17 November 2026</p>
          {sections.map(([h, ps]) => (
            <div key={h} className="mb-4">
              <h4 className="text-white mb-2">{h}</h4>
              {ps.map(p => <p key={p} className="text-white" style={{ opacity: 0.85, lineHeight: 1.7 }}>{p}</p>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default Privacy
