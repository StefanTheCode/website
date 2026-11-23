import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BfGate, { BfCountdown } from '@/components/BfGate';
import { BF_CODE, BF_COMMUNITY, BF_DEALS, BF_ENDS_LABEL } from '@/components/blackFriday';
import styles from './page.module.css';

const PAGE_URL = 'https://thecodeman.net/black-friday';
const OG = 'https://thecodeman.net/images/bf/black-friday-2026-og.jpg';
const title = 'Black Friday 2026: 40% off .NET and AI courses | TheCodeMan';
const description = 'Everything 40% off until December 1: AI for Developers, Pragmatic .NET Code Rules, Design Patterns, and the AI for Developers community for $119/year.';

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: { absolute: title },
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: { title, description, url: PAGE_URL, type: 'website', images: [{ url: OG, width: 1200, height: 675, alt: 'Black Friday 2026: everything 40% off' }] },
  twitter: { card: 'summary_large_image', site: '@TheCodeMan__', creator: '@TheCodeMan__', title, description, images: [OG] },
};

const howItWorks = [
  ['Code already applied', `Click Buy and ${BF_CODE} is in the checkout. Nothing to copy.`],
  ['14-day money-back', 'On AI for Developers and Pragmatic .NET Code Rules.'],
  ['Access right away', 'Code Rules and the ebooks instantly. AI for Developers: the written course as a PDF now, videos from Nov 27.'],
];

function Ended() {
  return (
    <section className={styles.ended}>
      <h1>Black Friday 2026 <span>is over.</span></h1>
      <p>Thanks to everyone who joined. Everything is still available at the regular price:</p>
      <div className={styles.endedLinks}>
        <Link href={BF_COMMUNITY.detailsUrl}>{BF_COMMUNITY.name} →</Link>
        {BF_DEALS.map((d) => <Link key={d.id} href={d.detailsUrl}>{d.name} →</Link>)}
      </div>
    </section>
  );
}

export default function BlackFridayPage() {
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <BfGate fallback={<Ended />}>
          {/* HERO */}
          <section className={styles.hero}>
            <p className={styles.pill}><span>Black Friday 2026</span>until {BF_ENDS_LABEL}, 23:59 CET</p>
            <h1>Everything <span>40% off.</span></h1>
            <p className={styles.lead}>My courses, ebooks and the AI for Developers community. Code <b>{BF_CODE}</b> is already applied when you click Buy.</p>
            <BfCountdown className={styles.countdown} />
          </section>

          {/* BEST VALUE: COMMUNITY */}
          <section className={styles.best} aria-labelledby="bf-community">
            <div className={styles.bestCopy}>
              <span className={styles.bestBadge}>Best value</span>
              <h2 id="bf-community">{BF_COMMUNITY.name}</h2>
              <p className={styles.bestSub}>Both video courses and everything else, in one membership.</p>
              <ul className={styles.checks}>{BF_COMMUNITY.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
            <div className={styles.bestBuy}>
              <p className={styles.bestPlan}>{BF_COMMUNITY.plan}</p>
              <p className={styles.bestPrice}><s>{BF_COMMUNITY.was}</s><strong>{BF_COMMUNITY.now}</strong><span>{BF_COMMUNITY.per}</span></p>
              <p className={styles.bestVs}>vs $228/year paying monthly</p>
              <a href={BF_COMMUNITY.buyUrl} className={styles.buy} data-cta="bf-page-community">Join yearly for {BF_COMMUNITY.now} <span aria-hidden="true">→</span></a>
              <Link href={BF_COMMUNITY.detailsUrl} className={styles.details}>See what&apos;s inside</Link>
              <p className={styles.fine}>{BF_COMMUNITY.note}</p>
            </div>
          </section>

          {/* PRODUCTS */}
          <h2 className={styles.gridTitle}>Or pick just one</h2>
          <div className={styles.grid}>
            {BF_DEALS.map((d) => (
              <article key={d.id} className={styles.deal}>
                <Link href={d.detailsUrl} className={styles.media} aria-label={`${d.name} details`}>
                  <Image src={d.image} alt="" width={640} height={360} sizes="(max-width: 760px) 100vw, 540px" />
                  <span className={styles.off}>-40%</span>
                </Link>
                <div className={styles.body}>
                  <p className={styles.kind}>{d.tag && <span className={styles.tag}>{d.tag}</span>}{d.kind}</p>
                  <h3>{d.name}</h3>
                  <p className={styles.blurb}>{d.blurb}</p>
                  <p className={styles.prices}><s>{d.was}</s><strong>{d.now}</strong></p>
                  <div className={styles.actions}>
                    <a href={d.buyUrl} className={`${styles.buy} lemonsqueezy-button`} data-cta={`bf-page-${d.id}`}>Buy now · {d.now}</a>
                    <Link href={d.detailsUrl} className={styles.details}>Details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* HOW IT WORKS */}
          <div className={styles.how}>
            {howItWorks.map(([h, p]) => <div key={h}><strong>{h}</strong><span>{p}</span></div>)}
          </div>
          <p className={styles.endNote}>Prices go back up on December 2. Questions? <a href="mailto:stefan@thecodeman.net">stefan@thecodeman.net</a></p>
        </BfGate>
      </div>
    </div>
  );
}
