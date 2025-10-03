import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Core settings
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,

  // Experimental features (Next.js 15)
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
    typedRoutes: true,
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'khan-academy.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.kastatic.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bndigital.org.br',
        port: '',
        pathname: '/**',
      },
    ],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Output configuration
  output: 'standalone',

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Environment variables validation
  env: {
    N8N_BASE_URL: process.env.N8N_BASE_URL,
  },

  // Redirects placeholder for future authentication flow
  async redirects() {
    return [
      // Example: redirect from root to login if not authenticated
      // Will be implemented in Phase 1 with authentication
    ];
  },

  // Rewrites placeholder for API proxy to N8N if needed
  async rewrites() {
    return [
      // Example: proxy to N8N API if needed
      // {
      //   source: '/api/n8n/:path*',
      //   destination: `${process.env.N8N_BASE_URL}/api/:path*`,
      // },
    ];
  },
};

export default nextConfig;