/* ------------------------------------------------------------------
   Black Friday 2026 - one place for the dates, prices and links.
   Everything that uses this (header bar, /black-friday, popup, AI page
   blocks) switches itself off after BF_END on the client, no redeploy needed.
   ------------------------------------------------------------------ */

export const BF_END_MS = Date.parse('2026-12-01T23:59:59+01:00');
export const BF_ENDS_LABEL = 'Dec 1';
export const BF_CODE = 'BF26';
export const BF_PATH = '/black-friday';
export const AI_COMMUNITY_SKOOL_URL = 'https://www.skool.com/ai-for-developers/about';

const LS = 'https://stefandjokic.lemonsqueezy.com/checkout/buy/';
const withCode = (id: string) => `${LS}${id}?checkout%5Bdiscount_code%5D=${BF_CODE}`;

export const BF_COMMUNITY = {
  name: 'AI for Developers community',
  plan: 'Yearly membership',
  was: '$149',
  now: '$119',
  per: '/year',
  monthly: '$19/month',
  points: [
    'Pragmatic .NET Code Rules, unlocked the day you join (yearly)',
    'AI for Developers video course, as the lessons come out',
    'AI Roadmap and Claude Code written courses',
    '50+ Claude Code skills and agents, with a lesson for each',
  ],
  note: 'Price locked while you stay. On monthly, Code Rules unlocks after 2 months.',
  buyUrl: AI_COMMUNITY_SKOOL_URL,
  detailsUrl: '/ai-for-developers',
};

export type BfDeal = {
  id: string;
  name: string;
  kind: string;
  tag?: string;
  was: string;
  now: string;
  blurb: string;
  image: string;
  buyUrl: string;
  detailsUrl: string;
};

export const BF_DEALS: BfDeal[] = [
  {
    id: 'ai-course',
    name: 'AI for Developers',
    kind: 'Video course',
    tag: 'New',
    was: '$149.99',
    now: '$89.99',
    blurb: 'Use AI on a real codebase, then build AI into a real app. 24 lessons, one real project.',
    image: '/ai-for-developers-course/og-image.jpg',
    buyUrl: withCode('2cf8a43b-9521-42a1-965c-07f711281a8b'),
    detailsUrl: '/ai-for-developers-course',
  },
  {
    id: 'code-rules',
    name: 'Pragmatic .NET Code Rules',
    kind: 'Video course',
    tag: 'AI edition',
    was: '$149.99',
    now: '$89.99',
    blurb: 'Rules your build enforces, whether a teammate or an AI agent wrote the code.',
    image: '/images/bf/code-rules-cover.webp',
    buyUrl: withCode('105be4cc-816d-4ccb-b588-858cf96e958e'),
    detailsUrl: '/pragmatic-dotnet-code-rules',
  },
  {
    id: 'dp-deliver',
    name: 'Design Patterns that Deliver',
    kind: 'Written course + ebook',
    was: '$32.99',
    now: '$19.79',
    blurb: '10 patterns, 20 mini-projects, 100 interview questions and an AI tutor.',
    image: '/images/dptd-course.webp',
    buyUrl: withCode('5e943b0e-a3fd-4c3d-950e-3671762ebf85'),
    detailsUrl: '/design-patterns-that-deliver-ebook',
  },
  {
    id: 'dp-simplified',
    name: 'Design Patterns Simplified',
    kind: 'Ebook',
    was: '$9.95',
    now: '$5.97',
    blurb: '10 essential patterns, the simple way. A short C# ebook with real-world examples and a GitHub repo.',
    image: '/images/ebook.webp',
    buyUrl: withCode('d71f1003-7b56-4b96-8136-1d769f53eb79'),
    detailsUrl: '/design-patterns-simplified',
  },
];

/* The popup stays away from the deals page and the product pages. */
export const BF_POPUP_SKIP = [
  BF_PATH,
  '/ai-for-developers',
  '/ai-for-developers-course',
  '/pragmatic-dotnet-code-rules',
  '/design-patterns-that-deliver-ebook',
  '/design-patterns-simplified',
  '/read',
];
