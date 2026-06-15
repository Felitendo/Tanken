import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    // The four tabs live on a single client-rendered shell ("/"). These
    // rewrites let deep links / reloads on /map, /history, /stats and
    // /settings serve that same shell while keeping the visible URL — the
    // client then opens the matching tab. Only the exact tab paths are
    // listed, so /api/* and /admin are untouched.
    return [
      { source: '/map', destination: '/' },
      { source: '/history', destination: '/' },
      { source: '/stats', destination: '/' },
      { source: '/settings', destination: '/' },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
