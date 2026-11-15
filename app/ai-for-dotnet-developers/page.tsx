import { permanentRedirect } from 'next/navigation';
import { AI_COMMUNITY_PATH } from '@/components/aiCommunity';

// The community was renamed to "AI for Developers" (/ai-for-developers).
// Netlify performs the HTTP 301 (netlify.toml); this fallback also works in local Next.js.
export default function LegacyAiForDotnetDevelopersPage() {
  permanentRedirect(AI_COMMUNITY_PATH);
}
