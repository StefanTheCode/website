import styles from './FreeCommunityPromo.module.css';

export const FREE_COMMUNITY_URL = 'https://www.skool.com/thecodeman-community-2911';

/* Free Skool group (TheCodeMan.NET Hub). Lives under every blog post since it left the header. */
export default function FreeCommunityPromo() {
  return (
    <aside className={styles.card} aria-label="Free .NET community">
      <div>
        <p className={styles.eyebrow}>Free .NET community</p>
        <p className={styles.title}>Join TheCodeMan.NET Hub</p>
        <p className={styles.text}>A free Skool group for .NET developers. Ask questions about what you just read, share what you&apos;re building and learn with other devs.</p>
      </div>
      <a href={FREE_COMMUNITY_URL} className={styles.link} target="_blank" rel="noopener noreferrer" data-cta="free-community-post">
        Join for free <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
