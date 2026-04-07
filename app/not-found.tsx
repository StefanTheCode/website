import Link from 'next/link'
import Subscribe from './subscribe'

export default function NotFound() {
  return (
    <>
      <section className="ftco-section">
        <div className="not-found-container">
          <div className="not-found-code">404</div>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-text">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            But don&apos;t worry — there&apos;s plenty of .NET content waiting for you.
          </p>
          <div className="not-found-links">
            <Link href="/" className="not-found-link-primary">Go Home</Link>
            <Link href="/blog" className="not-found-link-secondary">Browse Blog</Link>
          </div>
        </div>
      </section>
      <Subscribe />
    </>
  )
}
