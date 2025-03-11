import { Metadata } from 'next';
import Image from 'next/image'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/rag-system-dotnet'),
  title: "Learn how to implement RAG System in .NET",
  description: "Prepare your .NET interview - use this TheCodeMan's FREE Builder Pattern Chapter from Design Patterns that Deliver ebook.",
  openGraph: {
    title: "Learn how to implement RAG System in .NET",
    type: "website",
    url: "https://thecodeman.net/rag-system-dotnet",
    description: "Learn how to implement RAG System in .NET"
    },
  twitter: {
    title: "Learn how to implement RAG System in .NET",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Learn how to implement RAG System in .NET"
  }
}

const RagSystem = () => {

  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section mt-5">
              <h2 className=" text-white text-align-center">Learn how to implement <br/>
                <span className="text-yellow"><b> RAG System in .NET</b></span>
              </h2>
            </div>
          </div>
        </div>
        <hr className='background-yellow' />
          <div className="container">
                  <div className='row text-center'>
                  <div className='col-xs-4 col-sm-12 col-md-8 col-lg-6 col-xl-6 text-center mt-5'>
              <div className='row'>
                <div className='col-md-12 text-center'>
                  <h3>Download the Source Code</h3>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-md-1'></div>
                <div className='col-md-10 text-left'>
                <h5>✅ .Net 9 </h5>
              <h5>✅ Ollama Mistral </h5>
              <h5>✅ Neon Serverless Db</h5>
              <div className='row text-center'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center' 
            dangerouslySetInnerHTML={{
              __html: `<script async src="https://eomail4.com/form/64f8b448-fe65-11ef-9a18-ad167120d785.js" data-form="64f8b448-fe65-11ef-9a18-ad167120d785"></script>`
            }}></div>
          </div>
                </div>
              </div>
            </div>
                    <div className="col-xs-4 col-sm-12 col-md-8 col-lg-6 col-xl-6 text-center pb-5">
                      <Image className='mt-10' src={'/images/rag-system-cover.png'} priority={true} alt={'Design Patterns Simplified ebook cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                    </div>
                  </div>
                 
                </div>
      </section >
    </>
  )
}

export default RagSystem;