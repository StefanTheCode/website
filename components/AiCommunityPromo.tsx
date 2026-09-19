import Link from 'next/link';
import { AI_COMMUNITY_PATH } from './aiCommunity';
import styles from './AiCommunityPromo.module.css';

export default function AiCommunityPromo({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`${styles.promo} ${compact ? styles.compact : ''}`} aria-label="AI for .NET Developers community">
      <div>
        <p className={styles.eyebrow}>Learn together. Build with C#.</p>
        <h2>AI for .NET Developers</h2>
        <p>Use AI on your codebase and learn to build AI into your apps. Join the community for .NET skills, agents, practical lessons and engineering workflows.</p>
      </div>
      <Link href={AI_COMMUNITY_PATH} className={styles.link} data-cta="ai-community">Explore the community <span aria-hidden="true">→</span></Link>
    </aside>
  );
}
