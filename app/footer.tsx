export default function Footer() {
    return (
      <footer className="ftco-footer ftco-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-4 mb-4">
            <h5 className="footer-heading">TheCodeMan.NET</h5>
            <p className="footer-text">Practical .NET tutorials, architecture patterns, and C# tips by Microsoft MVP Stefan Djokic. Helping 20,000+ developers become better engineers.</p>
            <div className="footer-social-row mt-3">
              <a href="https://www.linkedin.com/in/djokic-stefan" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">LinkedIn</a>
              <a href="https://x.com/TheCodeMan__" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X / Twitter">X</a>
              <a href="https://www.youtube.com/@thecodeman_" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">YouTube</a>
              <a href="https://github.com/StefanTheCode" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">GitHub</a>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="footer-heading">Popular Articles</h5>
            <ul className="footer-link-list">
              <li><a href="/posts/how-to-implement-cqrs-without-mediatr">How to Implement CQRS Without MediatR</a></li>
              <li><a href="/posts/solid-principles-in-dotnet">SOLID Principles in .NET</a></li>
              <li><a href="/posts/clean-code-best-practices">Clean Code Best Practices</a></li>
              <li><a href="/posts/background-tasks-in-dotnet8">Background Tasks in .NET 8</a></li>
              <li><a href="/posts/mediatr-pipeline-behavior">MediatR Pipeline Behavior</a></li>
              <li><a href="/blog" className="footer-view-all">View All Articles →</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="footer-heading">Resources</h5>
            <ul className="footer-link-list">
              <li><a href="/design-patterns-that-deliver-ebook">Design Patterns That Deliver (Ebook)</a></li>
              <li><a href="/design-patterns-simplified">Design Patterns Simplified (Ebook)</a></li>
              <li><a href="/pragmatic-dotnet-code-rules">Pragmatic .NET Code Rules (Course)</a></li>
              <li><a href="/pass-your-interview">Interview Prep Kit (Free)</a></li>
              <li><a href="/about-me">About Stefan Djokic</a></li>
              <li><a href="/sponsorship">Sponsor TheCodeMan</a></li>
              <li><a href="/feed.xml" className="footer-rss">RSS Feed</a></li>
            </ul>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="row">
          <div className="col-md-12 text-center">
            <p className="footer-copyright"> &copy; 2026 STEFAN ĐOKIĆ PR THE CODE MAN
            </p>
          </div>
        </div>
      </div>
    </footer>
    )
}