import { Metadata } from 'next';
import Image from 'next/image'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/pass-your-interview'),
  title: "Pass your interview - FREE Questions with Answers",
  description: "Prepare your .NET interview - use this TheCodeMan's FREE Builder Pattern Chapter from Design Patterns that Deliver ebook.",
  openGraph: {
    title: "Pass your interview - FREE Questions with Answers",
    type: "website",
    url: "https://thecodeman.net/pass-your-interview",
    description: "Pass your interview - FREE Questions with Answers."
    },
  twitter: {
    title: "Pass your interview - FREE Questions with Answers",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Pass your interview - FREE Questions with Answers."
  }
}

const PassYourInterview = () => {

  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section mt-5">
              <h2 className=" text-white text-align-center">Dominate Your
                <span className="text-yellow"><b> Interviews</b></span>
              </h2>
              <h3 className='text-align-center text-white'>with this <span className='text-yellow'>Free Preparation Kit </span></h3>
            </div>
          </div>
        </div>
        <hr className='background-yellow' />
        <div className="container">
          <div className='row text-center'>
            <div className='col-xs-4 col-sm-12 col-md-8 col-lg-6 col-xl-6 text-center mt-5'>
              <div className='row'>
                <div className='col-md-12 text-center'>
                  <h3>What you'll get?</h3>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-md-1'></div>
                <div className='col-md-10 text-left'>
                <h5>✅ Design Patterns Interview Questions Ebook: </h5>
                <h6 className='text-white'> 🟡 100+ questions with answers (20 pages)</h6>
                <h6 className='text-white'> 🟡 Code based questions </h6>
                <h6 className='text-white'> 🟡 Dark and Light mode pdf </h6>
                <br/>
              <h5>✅ .NET Interview Questions </h5>
              <h6 className='text-white'> 🟡 50+ questions with answers </h6>
              <h6 className='text-white'> 🟡 Basic, Intermediate and Advanced levels </h6>
              <h6 className='text-white'> 🟡 General, Framework-Specific, Testing & Best Practices </h6>
              <br/>
              <div className='bg-green'>
                <h6>NEW!</h6>
              </div>
              <h5>✅ The Job-Seeking .NET Developer’s LinkedIn Handbook </h5>
              <h6 className='text-white'> 🟡 Short ebook with ready-to-start actions </h6>
              <h6 className='text-white'> 🟡 Real examples, checklists & tools </h6>
              <h6 className='text-white'> 🟡 Casual, recruiter-friendly language </h6>
              <br/>
              <h5>✅ Monthly Updates</h5>
              <div className='row text-center'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center' 
            dangerouslySetInnerHTML={{
              __html: `<script async src="https://eomail4.com/form/ab931ff0-e1c4-11ef-907b-c3a9263edd62.js" data-form="ab931ff0-e1c4-11ef-907b-c3a9263edd62"></script>`
            }}></div>
          </div>
                </div>
              </div>
            </div>
            <div className="col-xs-4 col-sm-12 col-md-8 col-lg-6 col-xl-6 text-center">
              <Image className='mt-10' src={'/images/interview-questions-ebook-cover.png'} priority={true} alt={'Design Patterns Simplified ebook cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
         
        </div>
      </section >
    </>
  )
}

export default PassYourInterview;