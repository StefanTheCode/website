import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import Image from 'next/image'
import config from '@/config.json'
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/sponsorship'), 
  title: "Sponsorship",
  description: "Partner with Stefan Djokic for impactful sponsorship opportunities in our widely-read newsletter and popular blog. A unique platform for companies to showcase their products to a dedicated audience of tech enthusiasts and professionals in the software engineering and .NET community.",
  openGraph: {
    title: "Sponsorship",
    type: "website",
    url: "https://thecodeman.net/sponsorship",
    description: "Partner with Stefan Djokic for impactful sponsorship opportunities in our widely-read newsletter and popular blog. A unique platform for companies to showcase their products to a dedicated audience of tech enthusiasts and professionals in the software engineering and .NET community."
  },
  twitter: {
    title: "Sponsorship",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Partner with Stefan Djokic for impactful sponsorship opportunities in our widely-read newsletter and popular blog. A unique platform for companies to showcase their products to a dedicated audience of tech enthusiasts and professionals in the software engineering and .NET community."
  }
}

const Sponsorship = () => {
  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className="pb-5">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section mt-5">
              <h2 className="mb-4 text-align-center">TheCodeMan .NET Newsletter <br />
                <span className="text-yellow"><b>Sponsorship</b></span>
              </h2>
            </div>
          </div>
          <div className="d-flex">
            <div className="col-sm-12 col-md-12 col-lg-12 pb-5">
              <div className="row pb-3">
                <div className="col-12 col-md-6">
                  <h1>Audience</h1>
                  <br />
                  <h5>• Reach: <span className="text-yellow">{config.NewsletterSubCount}</span></h5>
                  {/* <h5>• Growth: <span  className="text-yellow">{config.Growth}</span></h5> */}
                  {/* <h5>• Number of issues so far: <span  className="text-yellow">{config.IssuesCount}</span></h5> */}
                  <h5>• Average Open Rate: <span className="text-yellow">{config.OpenRate}</span></h5>
                  <h5>• Audience: <span className="text-yellow">{config.Audience} </span></h5>
                  <br />
                  {/* <h5 className='mb-5'>Reserve your sponsorship: <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a></h5> */}
                  {/* <h5><b>Currently booked out 2 weeks</b></h5> */}
                </div>
                <div className="col-12 col-md-6" id='reserveSpotForm'
                  dangerouslySetInnerHTML={{
                    __html: `
                            <script async src="https://eomail4.com/form/9ade17e6-9c87-11ef-86b3-890d9e639bbe.js" data-form="9ade17e6-9c87-11ef-86b3-890d9e639bbe"></script>

                `
                  }}
                />
              </div>
              <div className="row pb-3">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 pb-2">
                  <h1>Previous Sponsors</h1>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 text-left pb-5'>
                <Image src={'/images/sponsors/postman.png'} className='sponsors-img m-2' alt={'Dotnet (.NET) Logo'} width={1000} height={128} />
                <Image src={'/images/sponsors/jetbrains.png'} className='sponsors-img m-3' alt={'Dotnet (.NET) Logo'} width={1000} height={128} />
                <Image src={'/images/sponsors/neon.png'} className='sponsors-img m-3' alt={'Dotnet (.NET) Logo'} width={1000} height={128} />
                <Image src={'/images/sponsors/abp.png'} className='sponsors-img m-3' alt={'Dotnet (.NET) Logo'} width={1000} height={128} />
                </div>
                </div>
              <div className="row pb-3">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h1>Others Said About Me</h1>
                  <br />
                </div>
                <SponsorsNewsletter />
              </div>
              <div className="row pb-3 mt-5">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h1 className='sponsorship-name'>Sponsorship opportunities</h1>
                  <div className="row">
                    <div className="col-md-4 mt-5 mb-5">
                      <ul className="price">
                        <li className="header"><b>Sponsorship</b></li>
                        <li className="grey" >{config.SharedPrice}</li>
                        <li>1 of maximum 2 sponsors per issue</li>
                        <li>Sponsorship will remain live forever on website</li>
                        <li>2 links per sponsorship</li>
                        <li>2 sentences maximum</li>
                        <li className="grey" >
                          <a className="btn btn-primary border-radius-5px coming-soon" href='#reserveSpotForm'> Reserve here</a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-8 mt-5 mb-5">
                      <div className="row pb-3 mt-5">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <h1 className='sponsorship-name'>Example</h1>
                          <div className="row">
                            <div className="col-md-12 mb-5">
                              <p><a href='https://eomail4.com/web-version?p=a57fbf8c-8545-11ef-ae7d-85df232e2a82&pt=campaign&t=1728379993&s=784b945bc08f7b01ba1243c91db3cc19b19e59426863f51d69a39e55bbd61185' target='_blank'> In newsletter</a></p>
                              <p><a href='https://thecodeman.net/posts/how-to-use-singleton-in-multithreading?utm_source=sponsorship' target='_blank'> On website</a></p>
                              <p className='mt-5'>I also offer sponsorships on LinkedIn (90k+ followers) and X (6.5k+) platforms.</p>
                              <p>For more information contact me here.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Sponsorship;