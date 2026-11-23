import Link from 'next/link';
import { AI_COMMUNITY_PATH } from './aiCommunity';
import BfAiStrip from './BfAiStrip';
import BfGate from './BfGate';
import styles from './AiCommunityPromo.module.css';

export default function AiCommunityPromo({ compact = false }: { compact?: boolean }) {
  const regular = (
    <aside className={`${styles.promo} ${compact ? styles.compact : ''}`} aria-label="AI for Developers community">
      <div>
        <p className={styles.eyebrow}>Practical AI for developers who ship real systems</p>
        <h2>AI for Developers</h2>
        <p>Use AI on your codebase and learn to build AI into your apps. 50+ skills and agents, a core toolkit for any stack plus a deep .NET Pack, and weekly lessons.</p>
      </div>
      <Link href={AI_COMMUNITY_PATH} className={styles.link} data-cta="ai-community">Explore the community <span aria-hidden="true">→</span></Link>
    </aside>
  );
  /* During Black Friday the card becomes the Black Friday offer; after Dec 1 it is back to normal. */
  return <BfGate fallback={regular}><BfAiStrip compact={compact} /></BfGate>;
}
