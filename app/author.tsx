import './globals.css'
import Image from 'next/image'

export default function Author() {
  return (
    <section className="tcm-card tcm-author" aria-label="About the author">
      <Image src="/images/thecodeman-logo-96.webp" alt="Stefan Đokić" width={64} height={64} className="tcm-author__img" />
      <div className="tcm-author__body">
        <span className="tcm-eyebrow">About the author</span>
        <p className="tcm-author__name">Stefan Đokić</p>
        <p className="tcm-text">Microsoft MVP and senior .NET engineer with extensive experience designing enterprise-grade systems and teaching architectural best practices.</p>
        <div className="tcm-author__links">
          <a href="/about-me" className="tcm-link">More about me →</a>
          <a href="https://www.linkedin.com/in/djokic-stefan" target="_blank" rel="noopener noreferrer" className="tcm-link">Follow on LinkedIn →</a>
        </div>
      </div>
    </section>
  )
}
