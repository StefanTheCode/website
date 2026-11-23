import Link from 'next/link';
import BfGate from './BfGate';
import { BF_COMMUNITY, BF_ENDS_LABEL, BF_PATH } from './blackFriday';
import styles from './BfAiStrip.module.css';

/* Black Friday block for free AI pages: sends readers to the AI for Developers community.
   Renders nothing after Black Friday ends. */
export default function BfAiStrip({ compact = false }: { compact?: boolean }) {
  return (
    <BfGate>
      <aside className={`${styles.strip} ${compact ? styles.compact : ''}`} aria-label="Black Friday: AI for Developers community">
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span className={styles.pill}>Black Friday</span> until {BF_ENDS_LABEL}</p>
          <h2 className={styles.title}>Liked this? Get everything I use with AI, for <span>{BF_COMMUNITY.now}/year</span>.</h2>
          <ul className={styles.points}>
            <li><b>2 video courses</b> inside: AI for Developers + Pragmatic .NET Code Rules</li>
            <li><b>50+ Claude Code skills and agents</b>, with a lesson for each</li>
            <li><b>Written courses</b>: AI Roadmap, Claude Code &amp; Agent Workflow</li>
          </ul>
          <div className={styles.actions}>
            <Link href={BF_COMMUNITY.detailsUrl} className={styles.btn} data-cta="bf-ai-strip">Join yearly for {BF_COMMUNITY.now} <span aria-hidden="true">→</span></Link>
            <Link href={BF_PATH} className={styles.more} data-cta="bf-ai-strip-deals">All Black Friday deals</Link>
          </div>
        </div>
        <div className={styles.tag} aria-hidden="true">
          <span className={styles.tagHole} />
          <span className={styles.tagLabel}>AI for Developers</span>
          <s>{BF_COMMUNITY.was}</s>
          <strong>{BF_COMMUNITY.now}</strong>
          <em>per year · price locked</em>
        </div>
      </aside>
    </BfGate>
  );
}
