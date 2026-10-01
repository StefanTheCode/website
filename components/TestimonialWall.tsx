/**
 * Testimonial wall, rendered at build time.
 *
 * Testimonials come from the testimonials.milanjovanovic.tech wall API. The request is
 * authenticated with TESTIMONIALS_WALL_KEY (an env var on Netlify and in the local .env),
 * and it runs only during `next build`, so the key never reaches the browser: the page
 * ships plain HTML. New testimonials show up after the next deploy.
 * If the key is missing or the API is down, the build keeps going and the section
 * renders nothing (the page's own quotes stay).
 */

const API = 'https://testimonials.milanjovanovic.tech/api/wall/default-vktx48';

type Testimonial = {
  id: string;
  name: string;
  title: string | null;
  testimonial: string;
  rating: number | null;
  photoUrl: string | null;
  photoDataUri: string | null;
  createdAt: string;
};

type Wall = {
  courseName: string;
  summary: { count: number; averageRating: number };
  testimonials: Testimonial[];
};

async function getWall(slug: string): Promise<Wall | null> {
  const key = process.env.TESTIMONIALS_WALL_KEY;
  if (!key) {
    console.warn(`[testimonials] TESTIMONIALS_WALL_KEY is not set - skipping "${slug}" wall`);
    return null;
  }
  try {
    const res = await fetch(`${API}/${slug}`, {
      headers: { 'X-Wall-Key': key },
      cache: 'force-cache',
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.warn(`[testimonials] "${slug}" wall returned ${res.status}`);
      return null;
    }
    const data = (await res.json()) as Wall;
    return Array.isArray(data?.testimonials) ? data : null;
  } catch (e) {
    console.warn(`[testimonials] "${slug}" wall failed:`, (e as Error).message);
    return null;
  }
}

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');

const Star = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={on ? 'is-on' : ''}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);

const Stars = ({ value }: { value: number }) => (
  <span className="tcm-tw__stars" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => <Star key={i} on={i <= Math.round(value)} />)}
  </span>
);

function Card({ t, featured = false }: { t: Testimonial; featured?: boolean }) {
  const photo = t.photoDataUri || t.photoUrl;
  return (
    <figure className={`tcm-card tcm-tw__card ${featured ? 'tcm-tw__card--featured' : ''}`}>
      {t.rating ? <Stars value={t.rating} /> : null}
      <blockquote className="tcm-tw__text">{t.testimonial.trim()}</blockquote>
      <figcaption className="tcm-tw__who">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={44} height={44} loading="lazy" decoding="async" />
        ) : (
          <span className="tcm-tw__avatar" aria-hidden="true">{initials(t.name)}</span>
        )}
        <span>
          <b>{t.name}</b>
          {t.title ? <span>{t.title}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * @param slug     wall slug in the testimonials app ("ebook2" | "ebook" | "course")
 * @param visible  how many cards show before "Show all"
 * @param fallback rendered when the wall is empty or unreachable (e.g. the old widget)
 */
export default async function TestimonialWall({ slug, visible = 6, fallback = null }: { slug: string; visible?: number; fallback?: React.ReactNode }) {
  const wall = await getWall(slug);
  if (!wall || wall.testimonials.length === 0) return <>{fallback}</>;

  // Prefer reviews with a photo and real substance near the top; keep the API order otherwise.
  const items = [...wall.testimonials].sort((a, b) => {
    const score = (t: Testimonial) => (t.photoUrl || t.photoDataUri ? 2 : 0) + (t.testimonial.length > 150 ? 1 : 0) + (t.rating ?? 0) / 10;
    return score(b) - score(a);
  });
  const [first, ...rest] = items;
  const shown = rest.slice(0, Math.max(0, visible - 1));
  const hidden = rest.slice(shown.length);
  const avg = wall.summary?.averageRating ?? 5;
  const count = wall.summary?.count ?? items.length;

  return (
    <div className="tcm-tw">
      <div className="tcm-tw__summary">
        <Stars value={avg} />
        <span><b>{avg.toFixed(1)}</b> average from <b>{count}</b> {count === 1 ? 'review' : 'reviews'}</span>
      </div>

      <Card t={first} featured />

      {shown.length > 0 && (
        <div className="tcm-tw__grid">
          {shown.map((t) => <Card key={t.id} t={t} />)}
        </div>
      )}

      {hidden.length > 0 && (
        <details className="tcm-tw__more">
          <summary>
            <span className="tcm-btn tcm-btn--secondary">Show all {count} reviews</span>
          </summary>
          <div className="tcm-tw__grid">
            {hidden.map((t) => <Card key={t.id} t={t} />)}
          </div>
        </details>
      )}
    </div>
  );
}
