/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

// Static landing pages live in public/<slug>/index.html. `next dev` does not serve a
// folder's index.html for /<slug>, so map the clean URL in dev only. In production
// Netlify does the same via public/_redirects (rewrites don't work with output: 'export').
if (process.env.NODE_ENV === 'development') {
  nextConfig.rewrites = async () => [
    { source: '/ai-video-editing', destination: '/ai-video-editing/index.html' },
  ];
}

module.exports = nextConfig;