import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import { Metadata } from "next";
import config from '@/config.json'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/black-friday'),
  title: "Black Friday Sponsorship Opportunities - TheCodeMan.NET",
  alternates: {
    canonical: 'https://thecodeman.net/black-friday',
  },
  description: "Promote your brand with exclusive Black Friday sponsorship deals, including LinkedIn posts, newsletter ads, and more. Reach an engaged audience with high visibility opportunities.",
  openGraph: {
    title: "Black Friday Sponsorship Opportunities",
    type: "website",
    url: "https://thecodeman.net/black-friday",
    description: "Take advantage of Black Friday with high-impact sponsorship options across LinkedIn, newsletters, and social media to reach TheCodeMan.NET's dedicated followers.",
    images: [
      {
        url: 'https://thecodeman.net/black-friday-og-image.png',
        width: "1000px",
        height: "700px"
      }
    ],
  },
  twitter: {
    title: "Black Friday Sponsorship Opportunities",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Promote your brand this Black Friday with sponsorships reaching thousands through LinkedIn, newsletter ads, and social media posts.",
    images: [
      {
        url: 'https://thecodeman.net/black-friday-og-image.png',
        width: "1000px",
        height: "700px"
      }
    ]
  }
};

const BlackFriday = () => {
  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className='row pb-5 pt-5'>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <h1 className='sponsorship-name text-center mt-5'><b className='text-yellow'>BLACK FRIDAY</b></h1>
              <h2 className='sponsorship-name text-center'>Sponsorship opportunities</h2>
              <h4 className='mt-5'>Take advantage of this exclusive offer available until <b>December 1, 2024!</b></h4>
              <div className="row">
                <div className="col-md-4 mt-5 mb-5 padding-right-45px position-relative">
                <img src="/images/discount_40.png" alt="Discount Tag" className="discount-image"/>
                  <ul className="price">
                    <li className="header"><b>LinkedIn Post</b></li>
                    <li className="grey padding-5 text-success"><span className='old-price'>$750.00</span>$450.00</li>
                    <li className='padding-5'><h5><b className='text-yellow'>What you'll get?</b></h5></li>
                    <li className='padding-5'>Complete post about your company, product or a service</li>
                    <li className='padding-5'>1+ URLs to your website</li>
                    <li className='padding-5'>Your image, carousel or video</li>
                    <li className="grey padding-5">
                      <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>
                    </li>
                    <li className='padding-5'><h5><b className='text-yellow'>Stats</b></h5></li>

                    <li className='padding-5'>Average post reach: ~50k people</li>
                    <li className='padding-5'>Number of followers: ~88k</li>
                    <li className='padding-5'>Growth: ~1000 - 1500 followers weekly</li>
                    <li className='padding-5'>Profile reach last month: ~ 2.5m views</li>
                    <li className='padding-5'>Average weekly profile reach: ~ 450k - 650k</li>
                    <li className="grey padding-5">
                    <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>
                    </li>
                   </ul>
                </div>
                <div className="col-md-4 mt-5 mb-5 padding-right-45px position-relative">
                <img src="/images/discount_25.png" alt="Discount Tag" className="discount-image"/>
                  <ul className="price">
                    <li className="header"><b>Newsletter Ad</b></li>
                    <li className="grey padding-5 text-success"><span className='old-price'>$400.00</span>$300.00</li>
                    <li className='padding-5'><h5><b className='text-yellow'>What you'll get?</b></h5></li>
                    <li className='padding-5'>1 of maximum 2 sponsors per issue</li>
                    <li className='padding-5'>Sponsorship remains live forever on website</li>
                    <li className='padding-5'>2 links per sponsorship</li>
                    <li className="grey padding-5">
                    <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>

                    </li>
                    <li className='padding-5'><h5><b className='text-yellow'>Stats</b></h5></li>
                    <li className='padding-5'>Reach: 14,000+ subscribers</li>
                    <li className='padding-5'>Growth: ~800+ subscribers monthly</li>
                    <li className='padding-5'>Average Open Rate: 53%</li>
                    <li className='padding-5'>Ad Clicks Average: 100 - 300</li>
                    <li className="grey padding-5">
                    <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>

                    </li>
                    </ul>
                </div>
                <div className="col-md-4 mt-5 mb-5 padding-right-45px position-relative">
                <img src="/images/discount_60.png" alt="Discount Tag" className="discount-image"/>
                  <ul className="price">
                    <li className="header"><b>X Post</b></li>
                    <li className="grey padding-5 text-success"><span className='old-price'>$250.00</span>$100.00</li>
                    <li className='padding-5'><h5><b className='text-yellow'>What you'll get?</b></h5></li>
                    <li className='padding-5'>Complete post about your company, product or a service</li>
                    <li className='padding-5'>1+ URLs to your website</li>
                    <li className='padding-5'>Your image, document or video</li>
                    <li className="grey padding-5">
                    <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>

                    </li>
                    <li className='padding-5'><h5><b className='text-yellow'>Stats</b></h5></li>
                    <li className='padding-5'>Average post reach: ~5k people</li>
                    <li className='padding-5'>Number of followers: ~5.2k</li>
                    <li className='padding-5'>Growth: 200 - 400 followers weekly</li>
                    <li className='padding-5'>Profile reach last month: ~ 320k views</li>
                    <li className="grey padding-5">
                    <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>

                    </li>
                    </ul>
                </div>
              </div>
            <h4 className='text-center'> Secure your spot for posts anytime, including bookings for next year. Don’t miss out—reserve now to lock in your future posts.</h4>
            </div>
          </div>
          <div className="d-flex">
            <div className="col-sm-12 col-md-12 col-lg-12 pb-5">
            <h2 className='text-center mt-5'>Examples</h2>
             <div className='row'>
              <div className='col-sm-4 col-md-4 col-lg-4'>
              <h3 className='pt-5'><b className='text-yellow'>LinkedIn</b></h3>
              <div className='row'>
                <div className='col-sm-12 col-md-12 col-lg-12 text-center'>
                  <a target='_blank' href='https://www.linkedin.com/posts/djokic-stefan_postman-visualstudiocode-activity-7224410047810854913-hNJ1/?utm_source=share&utm_medium=member_desktop'>Postman - 100k reach</a> <br/>
                  <a target='_blank' href='https://www.linkedin.com/posts/djokic-stefan_how-to-build-api-without-coding-visually-activity-7226532036063240192-vu7i/?utm_source=share&utm_medium=member_desktop'>Postman - 75k reach</a><br/>
                  <a target='_blank' href='https://www.linkedin.com/posts/djokic-stefan_you-need-skills-and-tools-to-build-a-house-activity-7232738958940528640-OrGZ/?utm_source=share&utm_medium=member_desktop'>Packt - 42k reach</a>
                </div>
              </div>
              </div>
              <div className='col-sm-4 col-md-4 col-lg-4'>
              <h3 className='pt-5'><b className='text-yellow'>Newsletter</b></h3>
              <div className='row'>
                <div className='col-sm-12 col-md-12 col-lg-12 text-center'>
                  <a target='_blank' href='https://eomail4.com/web-version?p=a57fbf8c-8545-11ef-ae7d-85df232e2a82&pt=campaign&t=1728379993&s=784b945bc08f7b01ba1243c91db3cc19b19e59426863f51d69a39e55bbd61185'>In newsletter</a> <br/>
                  <a target='_blank' href='https://thecodeman.net/posts/how-to-use-singleton-in-multithreading'>On website</a><br/>
                </div>
              </div>
              </div>
               <div className='col-sm-4 col-md-4 col-lg-4'>
              <h3 className='pt-5'><b className='text-yellow'>X (Twitter)</b></h3>
              <div className='row'>
                <div className='col-sm-12 col-md-12 col-lg-12 text-center'>
                  <a target='_blank' href='https://x.com/TheCodeMan__/status/1841461611803901957'>Packt - 4.8k</a> <br/>
                  <a target='_blank' href='https://x.com/TheCodeMan__/status/1839580695850611135'>Postman - 4.5k</a><br/>
                </div>
              </div>
              </div>
             </div>
              <br />
              <div className='row'>
              <div className='col-sm-12 col-md-12 col-lg-12 text-center pb-5 mt-5'>
              <a className="btn btn-lg btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>
            </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="col-sm-12 col-md-12 col-lg-12 pb-5">
              <div className="row pb-3">
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  <h2 className='text-center'>Previous Sponsors</h2>
                  <h2 className='pt-5'><b className='text-yellow'>{config.PreviousSponsors}</b></h2>
                  <br />
                  <div className='row'>
              <div className='col-sm-12 col-md-12 col-lg-12 text-center pb-5 mt-5'>
              <a className="btn btn-lg btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>
            </div>
              </div>
                </div>
                <SponsorsNewsletter />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
            <div className="row text-center">
            <div className="col-md-3"></div>
            <div className="col-md-8" id='reserveSpotForm'
              dangerouslySetInnerHTML={{
                __html: `
                         <script async src="https://eomail4.com/form/9ade17e6-9c87-11ef-86b3-890d9e639bbe.js" data-form="9ade17e6-9c87-11ef-86b3-890d9e639bbe"></script>

            `
              }}
            />
            <div className="col-md-2"></div>
          </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default BlackFriday;