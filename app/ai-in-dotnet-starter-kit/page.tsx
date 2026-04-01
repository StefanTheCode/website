import { Metadata } from 'next';
import Image from 'next/image'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net/ai-in-dotnet-starter-kit'),
  title: "AI in .NET Starter Kit - Semantic Search & RAG System",
  description: "Get started with AI in .NET 10. Download free source code for Semantic Search and RAG System using Microsoft.Extensions.AI, Ollama, and Neon Serverless Db.",
  openGraph: {
    title: "AI in .NET Starter Kit - Semantic Search & RAG System",
    type: "website",
    url: "https://thecodeman.net/ai-in-dotnet-starter-kit",
    description: "Get started with AI in .NET 10. Download free source code for Semantic Search and RAG System using Microsoft.Extensions.AI, Ollama, and Neon Serverless Db."
    },
  twitter: {
    title: "AI in .NET Starter Kit - Semantic Search & RAG System",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Get started with AI in .NET 10. Download free source code for Semantic Search and RAG System using Microsoft.Extensions.AI, Ollama, and Neon Serverless Db."
  }
}

const RagSystem = () => {

  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section mt-5">
              <h2 className=" text-white text-align-center">Get Started with <br/>
                <span className="text-yellow"><b> AI in .NET Starter Kit</b></span>
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
                <h5>✅ .NET 10 </h5>
              <h5>✅ Semantic Search in .NET </h5>
              <h5>✅ RAG System in .NET </h5>
              <h5>✅ Microsoft.Extensions.AI </h5>
              <h5>✅ Ollama LLMs </h5>
              <h5>✅ pgvector </h5>
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
                      <Image src={'/images/rag-system-cover.png'} priority={true} alt={'AI in .NET Starter Kit cover'} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                    </div>
                  </div>
                 
                </div>
      </section >
    </>
  )
}

export default RagSystem;