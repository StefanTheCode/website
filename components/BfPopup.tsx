'use client';

import { useEffect, useRef, useState } from 'react';
import { BF_CODE, BF_COMMUNITY, BF_DEALS, BF_END_MS, BF_ENDS_LABEL, BF_PATH, BF_POPUP_SKIP } from './blackFriday';
import { BfCountdown } from './BfGate';
import styles from './BfPopup.module.css';

const KEY = 'bf26_popup_dismissed';
const DELAY_MS = 6000;

/* Black Friday offer: a modal on desktop, a small bar at the bottom on mobile.
   Shows once a day, never on the deals page or product pages, and not after Black Friday. */
export default function BfPopup() {
  const [eligible, setEligible] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (Date.now() > BF_END_MS) return;
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    if (BF_POPUP_SKIP.some((p) => path === p || path.startsWith(p + '/'))) return;
    let seen = '';
    try { seen = localStorage.getItem(KEY) || ''; } catch (e) {}
    if (seen === new Date().toDateString()) return;
    setEligible(true);
    setMobile(window.matchMedia('(max-width: 767px)').matches);
    /* Wait while the cookie consent bar is on screen, so the two never overlap. */
    let t = 0;
    const tryOpen = () => {
      if (document.getElementById('tcm-consent')) { t = window.setTimeout(tryOpen, 3000); return; }
      setOpen(true);
    };
    t = window.setTimeout(tryOpen, DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!mobile) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, mobile]);

  function dismiss() {
    setOpen(false);
    try { localStorage.setItem(KEY, new Date().toDateString()); } catch (e) {}
  }

  /* While the Black Friday popup can show, the newsletter popup stays off (see components/thirdParty.ts). */
  const marker = eligible ? <span data-no-eo-popup hidden /> : null;
  if (!open) return marker;

  if (mobile) {
    return (
      <>
        {marker}
        <div className={styles.bar} role="region" aria-label="Black Friday deals">
          <a href={BF_PATH} className={styles.barLink} data-cta="bf-popup-mobile" onClick={dismiss}>
            <span className={styles.barTag}>Black Friday</span>
            <span className={styles.barText}><b>Everything 40% off</b> · until {BF_ENDS_LABEL}</span>
            <span className={styles.barGo}>See deals →</span>
          </a>
          <button type="button" className={styles.barClose} onClick={dismiss} aria-label="Close">×</button>
        </div>
      </>
    );
  }

  return (
    <>
      {marker}
      <div className={styles.overlay} onClick={dismiss}>
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="bf-popup-title" onClick={(e) => e.stopPropagation()}>
          <button type="button" ref={closeRef} className={styles.close} onClick={dismiss} aria-label="Close">×</button>
          <div className={styles.head}>
            <p className={styles.kicker}><span>Black Friday</span><BfCountdown className={styles.countdown} /></p>
            <h2 id="bf-popup-title" className={styles.title}>Everything <em>40% off</em></h2>
            <p className={styles.sub}>Code <b>{BF_CODE}</b> is already applied when you click Buy.</p>
          </div>
          <a href={BF_PATH} className={styles.best} data-cta="bf-popup-community" onClick={dismiss}>
            <span className={styles.bestBadge}>Best value</span>
            <span className={styles.bestName}>{BF_COMMUNITY.name}<small>2 video courses + 50+ skills and agents</small></span>
            <span className={styles.bestPrice}><s>{BF_COMMUNITY.was}</s>{BF_COMMUNITY.now}<small>/year</small></span>
          </a>
          <ul className={styles.list}>
            {BF_DEALS.map((d) => (
              <li key={d.id}><span>{d.name}</span><span className={styles.prices}><s>{d.was}</s><b>{d.now}</b></span></li>
            ))}
          </ul>
          <a href={BF_PATH} className={styles.cta} data-cta="bf-popup" onClick={dismiss}>See all deals <span aria-hidden="true">→</span></a>
          <button type="button" className={styles.later} onClick={dismiss}>Not now</button>
        </div>
      </div>
    </>
  );
}
