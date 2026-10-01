const SOCIALS = [
  { href: "https://www.linkedin.com/in/djokic-stefan", label: "LinkedIn" },
  { href: "https://www.youtube.com/@thecodeman_", label: "YouTube" },
  { href: "https://x.com/TheCodeMan__", label: "X" },
  { href: "https://github.com/StefanTheCode", label: "GitHub" },
  { href: "https://www.skool.com/thecodeman-community-2911", label: "Skool" },
];

const COLUMNS = [
  {
    title: "Popular articles",
    links: [
      { href: "/posts/how-to-implement-cqrs-without-mediatr", label: "CQRS without MediatR" },
      { href: "/posts/solid-principles-in-dotnet", label: "SOLID principles in .NET" },
      { href: "/posts/clean-code-best-practices", label: "Clean code best practices" },
      { href: "/posts/background-tasks-in-dotnet8", label: "Background tasks in .NET 8" },
      { href: "/posts/mediatr-pipeline-behavior", label: "MediatR pipeline behavior" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/newsletter-archive", label: "Newsletter archive" },
      { href: "/dotnet-roadmap-2026", label: ".NET Roadmap 2026" },
      { href: "/ai-roadmap-2026", label: "AI Roadmap for .NET" },
      { href: "/pass-your-interview", label: "Interview prep kit" },
    ],
  },
  {
    title: "Products",
    links: [
      { href: "/ai-for-dotnet-developers", label: "AI for .NET Developers" },
      { href: "/pragmatic-dotnet-code-rules", label: "Pragmatic .NET Code Rules" },
      { href: "/design-patterns-that-deliver-ebook", label: "Design Patterns That Deliver (course)" },
      { href: "/design-patterns-simplified", label: "Design Patterns Simplified" },
    ],
  },
  {
    title: "More",
    links: [
      { href: "/about-me", label: "About Stefan" },
      { href: "/sponsorship", label: "Sponsor the newsletter" },
      { href: "/media-kit", label: "Media kit" },
      { href: "/tools", label: "Free AI tools" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="tcm-footer">
      <div className="tcm-container tcm-footer__grid">
        <div className="tcm-footer__brand">
          <a href="/" className="tcm-footer__logo">TheCodeMan<span>.NET</span></a>
          <p>Practical .NET, C# and AI content by Stefan Đokić, Microsoft MVP. Helping 25,000+ developers become better engineers.</p>
          <div className="tcm-footer__social">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ))}
          </div>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title} className="tcm-footer__col">
            <h2>{c.title}</h2>
            {c.links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="tcm-container tcm-footer__bottom">
        <span>&copy; 2026 Stefan Đokić PR The Code Man</span>
        <a href="mailto:stefan@thecodeman.net">stefan@thecodeman.net</a>
      </div>
    </footer>
  );
}
