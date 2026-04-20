/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/posts/semantic-search-ai-in-dotnet9',
        destination: '/posts/semantic-search-ai-in-dotnet',
        permanent: true,
      },
      {
        source: '/patterns/fluent-builder-pattern-how-to-simplify-complex-object-creation',
        destination: '/posts/builder-pattern-in-dotnet',
        permanent: true,
      },
      {
        source: '/patterns/decorator-pattern-in-dotnet-explained',
        destination: '/posts/decorator-pattern-in-dotnet',
        permanent: true,
      },
      {
        source: '/posts/use-architecture-tests-in-your-projects',
        destination: '/posts/architecture-tests-dotnet-clean-architecture',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;