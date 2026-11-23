'use client';

import { useEffect, useState } from 'react';
import { BF_END_MS } from './blackFriday';

/* true until Black Friday ends. Starts true so the static HTML (built before the end) matches. */
export function useBfActive() {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const check = () => setActive(Date.now() <= BF_END_MS);
    check();
    const t = window.setInterval(check, 60_000);
    return () => window.clearInterval(t);
  }, []);
  return active;
}

/* Shows children during Black Friday, and `fallback` (or nothing) after it ends. */
export default function BfGate({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <>{useBfActive() ? children : fallback}</>;
}

/* "7d 04h 12m" until the end. Renders nothing on the server to avoid a hydration mismatch. */
export function BfCountdown({ className }: { className?: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, BF_END_MS - Date.now()));
    tick();
    const t = window.setInterval(tick, 30_000);
    return () => window.clearInterval(t);
  }, []);
  if (left === null || left <= 0) return null;
  const d = Math.floor(left / 86_400_000);
  const h = Math.floor((left % 86_400_000) / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return <span className={className}>Ends in {d > 0 ? `${d}d ` : ''}{pad(h)}h {pad(m)}m</span>;
}
