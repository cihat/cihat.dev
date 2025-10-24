const withMDX = require("@next/mdx")();
const withPlugins = require('next-compose-plugins')

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  
  // Performance optimizations
  compress: true,
  
  // Disable sourcemaps in production for faster builds
  productionBrowserSourceMaps: false,
  
  // Disable CSS optimization completely
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  experimental: {
    mdxRs: true,
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'react-icons',
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-tabs',
      'react-syntax-highlighter', // Optimize syntax highlighter
    ],
    // Reduce client-side router cache to prevent stale content
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
    // Memory optimizations
    memoryBasedWorkersCount: true,
    // Disable CSS optimization to prevent critters issues
    optimizeCss: false,
  },
  
  // Remove serverExternalPackages to avoid conflict with transpilePackages
  // serverExternalPackages: ['react-syntax-highlighter'],
  
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
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
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
    formats: ['image/webp', 'image/avif'],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  webpack(config, { dev, isServer }) {
    // Disable sourcemaps in production
    if (!dev) {
      config.devtool = false;
    }
    
    config.resolve.fallback = {
      fs: false,
    };

    // Optimize production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
        // Disable CSS optimization to prevent critters dependency issues
        minimizer: config.optimization.minimizer?.filter(
          (plugin) => plugin.constructor.name !== 'CssMinimizerPlugin'
        ),
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
    }

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
    value: 'public, max-age=60, must-revalidate',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
]

// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: !isProd
// });

module.exports = withPlugins([[withMDX]], nextConfig)
