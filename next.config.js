const withMDX = require("@next/mdx")();
const withPlugins = require('next-compose-plugins')

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  experimental: {
    mdxRs: true
  },
  env: {
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    STOIC_API_PATH: process.env.STOIC_API_PATH,
    BASE_URL: process.env.BASE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    RAINDROP_ACCESS_TOKEN: process.env.RAINDROP_ACCESS_TOKEN,
  },
  poweredByHeader: false,
  headers() {
    return [
      {
        source: '/(.*)',
        locale: false,
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ],
  },
  webpack(config) {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  }
}

const thirdParty = [
  'www.youtube.com',
  'open.spotify.com',
  'utteranc.es',
]

const domains = [
  'cdn.vercel-insights.com',
  'vercel.live',
  'va.vercel-scripts.com',
  'vitals.vercel-insights.com',
  ...thirdParty
]
// https://nextjs.org/docs/advanced-features/security-headers
const ContentSecurityPolicy = `
  default-src 'self' vercel.live www.youtube.com;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' ${domains.join(' ')};
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
  frame-src 'self' ${thirdParty.join(' ')};
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Cache-Control',
    value: 'public, max-age=3600, must-revalidate',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
]

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd
});

module.exports = withPlugins([[withMDX],[withPWA]], nextConfig)
