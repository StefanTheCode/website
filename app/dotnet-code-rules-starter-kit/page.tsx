import { Metadata } from 'next';
import Image from 'next/image'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/dotnet-code-rules-starter-kit'),
  title: "Pragmatic .NET Code Rules Starter Kit”",
  description: "If you’re starting a new .NET project — or trying to clean up an existing one — this starter kit gives you production-ready defaults used in real-world teams.",
  openGraph: {
    title: "Pragmatic .NET Code Rules Starter Kit”",
    type: "website",
    url: "https://thecodeman.net/dotnet-code-rules-starter-kit",
    description: "Pragmatic .NET Code Rules Starter Kit”"
  },
  twitter: {
    title: "Pragmatic .NET Code Rules Starter Kit”",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Pragmatic .NET Code Rules Starter Kit”"
  }
}

const CodeRulesStarterKit = () => {

  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section pt-5   mt-5">
              <h2 className=" text-white text-align-center">Pragmatic .NET Code Rules<br />
                <span className="text-yellow"><b> Starter Kit (FREE)</b></span>
              </h2>
              <h3 className='text-white text-align-center'>Real course material. <br/> Free for a limited time.</h3>
            </div>
          </div>
        </div>
        <hr className='background-yellow' />
        <div className="container">
          <div className='row text-center'>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center'>
              <div className='row'>
                <div className='col-md-12 text-center'>
                  <h3>You'll get:</h3>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-md-1'></div>
                <div className='col-md-10 text-left'>
                  <h5>✅ a pragmatic <span className='text-overlay'>.editorconfig</span></h5>
                  <h5>✅ centralized build rules with  <span className='text-overlay'>Directory.Build.props</span> </h5>
                  <h5>✅ pinned .NET SDK</h5>
                  <h5>✅ a minimal CI quality gate - <span className='text-overlay'> GitHub </span></h5>
                  <h5>✅ a <span className='text-overlay'> Visual Studio </span> setup checklist</h5>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center pb-5">
              <div className='row'>
                <div className='col-md-12 text-center'>
                  <h3>What is this?</h3>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-md-1'></div>
                <div className='col-md-10 text-left'>
                  <h5>This starter kit contains actual material from my upcoming course <a href='/pragmatic-dotnet-code-rules' target='_blank'> Pragmatic .NET Code Rules</a> - released for free to newsletter subscribers.</h5>
                </div>
              </div>
            </div>
             <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center mt-5 pb-5">
              <div className='row'>
                <div className='col-md-12 text-center'>
                  <h3>Download the Starter Pack for FREE</h3>
                </div>
                <div className='col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3'></div>
                <div className='col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 text-center'
                      dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/4bf59088-e262-11f0-9f42-355d711e4cd9.js" data-form="4bf59088-e262-11f0-9f42-355d711e4cd9"></script>`
                      }}></div>
              </div>
              <div className='row'>
                <div className='col-md-1'></div>
                <div className='col-md-10 text-left'>
                  <div className='row text-center'>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section >
    </>
  )
}

export default CodeRulesStarterKit;