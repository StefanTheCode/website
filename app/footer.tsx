export default function Footer() {
    return (
      <footer className="ftco-footer ftco-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-4">
            <h5 className="text-yellow mb-3">TheCodeMan.NET</h5>
            <p className="text-white" style={{fontSize: '14px'}}>Practical .NET tutorials, architecture patterns, and C# tips by Microsoft MVP Stefan Djokic. Helping 20,000+ developers become better engineers.</p>
          </div>
          <div className="col-md-4">
            <h5 className="text-yellow mb-3">Popular Articles</h5>
            <ul style={{listStyle: 'none', padding: 0, fontSize: '14px'}}>
              <li className="mb-1"><a href="/posts/how-to-implement-cqrs-without-mediatr" className="text-white">How to Implement CQRS Without MediatR</a></li>
              <li className="mb-1"><a href="/posts/solid-principles-in-dotnet" className="text-white">SOLID Principles in .NET</a></li>
              <li className="mb-1"><a href="/posts/clean-code-best-practices" className="text-white">Clean Code Best Practices</a></li>
              <li className="mb-1"><a href="/posts/background-tasks-in-dotnet8" className="text-white">Background Tasks in .NET 8</a></li>
              <li className="mb-1"><a href="/posts/mediatr-pipeline-behavior" className="text-white">MediatR Pipeline Behavior</a></li>
              <li className="mb-1"><a href="/blog" className="text-yellow">View All Articles →</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="text-yellow mb-3">Resources</h5>
            <ul style={{listStyle: 'none', padding: 0, fontSize: '14px'}}>
              <li className="mb-1"><a href="/design-patterns-that-deliver-ebook" className="text-white">Design Patterns That Deliver (Ebook)</a></li>
              <li className="mb-1"><a href="/design-patterns-simplified" className="text-white">Design Patterns Simplified (Ebook)</a></li>
              <li className="mb-1"><a href="/pragmatic-dotnet-code-rules" className="text-white">Pragmatic .NET Code Rules (Course)</a></li>
              <li className="mb-1"><a href="/pass-your-interview" className="text-white">Interview Prep Kit (Free)</a></li>
              <li className="mb-1"><a href="/about-me" className="text-white">About Stefan Djokic</a></li>
              <li className="mb-1"><a href="/sponsorship" className="text-white">Sponsor TheCodeMan</a></li>
            </ul>
          </div>
        </div>
        <hr style={{borderColor: 'rgba(255,255,255,0.15)'}} />
        <div className="row">
          <div className="col-md-12 text-center">
            <p> &copy; 2026 STEFAN ĐOKIĆ PR THE CODE MAN
            </p>
          </div>
        </div>
      </div>
    </footer>
    )
}