import { permanentRedirect } from 'next/navigation';
import { AI_COMMUNITY_PATH } from '@/components/aiCommunity';

// Netlify performs the HTTP 301; this fallback also works in local Next.js.
export default function LegacyAiToolkitPage() {
  permanentRedirect(AI_COMMUNITY_PATH);
}
