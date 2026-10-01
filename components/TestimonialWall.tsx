/**
 * Testimonial wall, rendered at build time.
 *
 * Testimonials come from the testimonials.milanjovanovic.tech wall API. The request is
 * authenticated with TESTIMONIALS_WALL_KEY (an env var on Netlify and in the local .env),
 * and it runs only during `next build`, so the key never reaches the browser: the page
 * ships plain HTML. New testimonials show up after the next deploy.
 * If the key is missing or the API is down, the build keeps going and the section
 * renders nothing.
 */

const API = 'https://testimonials.milanjovanovic.tech/api/wall/default-vktx48';
// One value per build process. It goes into the URL so Next's persistent fetch cache
// (kept between builds, also on Netlify) can never serve testimonials from an older build,
// while requests within the same build are still de-duplicated.
const BUILD_STAMP = Date.now().toString(36);

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
    const res = await fetch(`${API}/${slug}?build=${BUILD_STAMP}`, {
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

/** Never publish contact details people typed into their review (e.g. an email under "Regards,"). */
const clean = (text: string) =>
  text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

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
      <blockquote className="tcm-tw__text">{clean(t.testimonial)}</blockquote>
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
 */
/** Rough rendered height of a card, used to balance the masonry columns on the server. */
const estimate = (t: Testimonial) => 150 + t.testimonial.length * 0.55 + (t.testimonial.match(/\n/g)?.length ?? 0) * 12;

/** Greedy masonry: each card goes to the currently shortest column (visible cards first, then the extras). */
function toColumns(visibleItems: Testimonial[], extraItems: Testimonial[], n = 3) {
  const cols: { t: Testimonial; extra: boolean }[][] = Array.from({ length: n }, () => []);
  const heights = new Array(n).fill(0);
  const place = (t: Testimonial, extra: boolean) => {
    const i = heights.indexOf(Math.min(...heights));
    cols[i].push({ t, extra });
    heights[i] += estimate(t);
  };
  visibleItems.forEach((t) => place(t, false));
  extraItems.forEach((t) => place(t, true));
  return cols.filter((c) => c.length > 0);
}

/** Compact rating line ("5 stars · 5.0 from 4 reviews") for hero sections. */
export async function TestimonialRating({ slug }: { slug: string }) {
  const wall = await getWall(slug);
  if (!wall || wall.testimonials.length === 0) return null;
  const avg = wall.summary?.averageRating ?? 5;
  const count = wall.summary?.count ?? wall.testimonials.length;
  return (
    <div className="tcm-tw__summary tcm-tw__summary--inline">
      <Stars value={avg} />
      <span><b>{avg.toFixed(1)}</b> from <b>{count}</b> {count === 1 ? 'review' : 'reviews'}</span>
    </div>
  );
}

export default async function TestimonialWall({ slug, visible = 6 }: { slug: string; visible?: number }) {
  const wall = await getWall(slug);
  if (!wall || wall.testimonials.length === 0) return null;

  // Prefer reviews with a photo and real substance near the top; keep the API order otherwise.
  const items = [...wall.testimonials].sort((a, b) => {
    const score = (t: Testimonial) => (t.photoUrl || t.photoDataUri ? 2 : 0) + (t.testimonial.length > 150 ? 1 : 0) + (t.rating ?? 0) / 10;
    return score(b) - score(a);
  });
  const [first, ...rest] = items;
  const shown = rest.slice(0, Math.max(0, visible - 1));
  const hidden = rest.slice(shown.length);
  const columns = toColumns(shown, hidden, Math.min(3, rest.length) || 1);
  const avg = wall.summary?.averageRating ?? 5;
  const count = wall.summary?.count ?? items.length;
  const toggleId = `tw-more-${slug}`;

  return (
    <div className="tcm-tw">
      <div className="tcm-tw__summary">
        <Stars value={avg} />
        <span><b>{avg.toFixed(1)}</b> average from <b>{count}</b> {count === 1 ? 'review' : 'reviews'}</span>
      </div>

      <Card t={first} featured />

      {hidden.length > 0 && <input type="checkbox" id={toggleId} className="tcm-tw__toggle" />}

      {columns.length > 0 && (
        <div className="tcm-tw__cols" style={{ ['--tw-cols' as string]: columns.length }}>
          {columns.map((col, i) => (
            <div className="tcm-tw__col" key={i}>
              {col.map(({ t, extra }) => (
                <div key={t.id} className={extra ? 'tcm-tw__item is-extra' : 'tcm-tw__item'}><Card t={t} /></div>
              ))}
            </div>
          ))}
        </div>
      )}

      {hidden.length > 0 && (
        <label htmlFor={toggleId} className="tcm-tw__more">
          <span className="tcm-btn tcm-btn--secondary">Show all {count} reviews</span>
        </label>
      )}
    </div>
  );
}
