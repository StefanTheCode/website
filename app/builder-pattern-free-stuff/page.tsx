import { Metadata } from 'next';
import Image from 'next/image'

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

const BuilderPatternFreeStuff = () => {

  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section mt-5">
              <h2 className=" text-white text-align-center">TheCodeMan's<br />
                <span className="text-yellow"><b>FREE Builder Pattern Chapter</b></span>
              </h2>
              <h4 className='text-align-center text-white'>from <span className='text-yellow'> Design Patterns that Deliver  </span> ebook</h4>
            </div>
          </div>
        </div>
        <hr className='background-yellow' />
        <div className="container">
          <div className='row text-center'>
            <div className='col-xs-4 col-sm-12 col-md-8 col-lg-6 col-xl-6 text-center mt-5'>
              <div className='row'>
                <div className='col-md-1'></div>
                <div className='col-md-10 text-left'>
                <h5>✅ Free Chapter: Trusted by 600+ engineers. </h5>
              <h5>✅ GitHub Access: Ready-to-use code.</h5>
              <h5>✅ Clear Example: Simple and practical.</h5>
              <div className='row text-center'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center' 
            dangerouslySetInnerHTML={{
              __html: `<script async src="https://eomail4.com/form/7ff08dac-bd74-11ef-b66e-1fbfad4a9056.js" data-form="7ff08dac-bd74-11ef-b66e-1fbfad4a9056"></script>`
            }}></div>
          </div>
                </div>
              </div>
            </div>
            <div className="col-xs-4 col-sm-12 col-md-8 col-lg-6 col-xl-6 text-center">
              <Image src={'/images/builder-pattern-free.png'} priority={true} alt={'Design Patterns Simplified ebook cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
         
        </div>
      </section >
    </>
  )
}

export default BuilderPatternFreeStuff;