import './globals.css'
import config from '@/config.json'

export default function Help() {
  return (
    <section className="ftco-section contact-section mb-3">
      <div className="container">
        <div className="row justify-content-center pb-3">
          <div className="col-md-12 text-center mb-5">
            <h3><b>There are 3 ways I can help you:</b></h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 mb-3'>
            <h4>1. Pragmatic .NET Code Rules Course</h4>
            <p>Stop arguing about code style. In this course you get a production-proven setup with analyzers, CI quality gates, and architecture tests — the exact system I use in real projects. <a href='/pragmatic-dotnet-code-rules?utm_source=website'><b>Join here.</b></a></p>
            <p>Not sure yet? Grab the <a href='/dotnet-code-rules-starter-kit?utm_source=website'><b>free Starter Kit</b></a> — a drop-in setup with the essentials from Module 01.</p>
          </div>

          <div className='col-md-12 mb-3'>
            <h4>2. Design Patterns Ebooks</h4>
            <p><a href='/design-patterns-that-deliver-ebook?utm_source=website'><b>Design Patterns that Deliver</b></a> — Solve real problems with 5 battle-tested patterns (Builder, Decorator, Strategy, Adapter, Mediator) using practical, real-world examples. Trusted by 650+ developers.</p>
            <p>Just getting started? <a href='/design-patterns-simplified?utm_source=website'><b>Design Patterns Simplified</b></a> covers 10 essential patterns in a beginner-friendly, 30-page guide for just $9.95.</p>
          </div>

          <div className='col-md-12 mb-3'>
            <h4>3. Join {config.NewsletterSubCount}</h4>
            <p>Every Monday morning, I share 1 actionable tip on C#, .NET & Architecture that you can use right away. <a href='/'><b>Join here.</b></a></p>
          </div>
        </div>

      </div>
    </section>
  )
}