/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  staticPageGenerationTimeout: process.env.NEXT_BUILD_TIMEOUT ? parseInt(process.env.NEXT_BUILD_TIMEOUT) : 1200, // Default: 20 minutes (1200 seconds)
  
  async redirects() {
    return [
      // Root redirect
      {
        source: '/',
        destination: '/us',
        permanent: true,
      },
      // Policy pages
      {
        source: '/shipping-and-delivery-policy',
        destination: '/us/shipping-and-delivery-policy',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/us/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms-conditions',
        destination: '/us/terms-conditions',
        permanent: true,
      },
      // Content pages
      {
        source: '/blogs',
        destination: '/us/blogs',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/us/shop',
        permanent: true,
      },
      // Shop with query parameters
      {
        source: '/shop/:path*',
        destination: '/us/shop/:path*',
        permanent: true,
      },
      // Collections
      {
        source: '/collections/:path*',
        destination: '/us/collections/:path*',
        permanent: true,
      },
      // Product pages
      {
        source: '/product/:path*',
        destination: '/us/product/:path*',
        permanent: true,
      },
      // Other common pages
      {
        source: '/about-us',
        destination: '/us/about-us',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/us/contact-us',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/us/faqs',
        permanent: true,
      },
      {
        source: '/reviews',
        destination: '/us/reviews',
        permanent: true,
      },
      {
        source: '/size-guide',
        destination: '/us/size-guide',
        permanent: true,
      },
      {
        source: '/track-order',
        destination: '/us/track-order',
        permanent: true,
      },
      {
        source: '/refund-and-returns-policy',
        destination: '/us/refund-and-returns-policy',
        permanent: true,
      },
      // Auth pages
      {
        source: '/auth/:path*',
        destination: '/us/auth/:path*',
        permanent: true,
      },
      // Account pages
      {
        source: '/account/:path*',
        destination: '/us/account/:path*',
        permanent: true,
      },
      // Cart and checkout
      {
        source: '/cart',
        destination: '/us/cart',
        permanent: true,
      },
      {
        source: '/checkout/:path*',
        destination: '/us/checkout/:path*',
        permanent: true,
      },
      {
        source: '/wishlist',
        destination: '/us/wishlist',
        permanent: true,
      },
    ];
  },
  
  experimental: {
    appDir: true,
    
    staticWorkerRequestDeduping: true,
    cpus: 1, 
    
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001",
        "192.168.100.8:3000",
      ],
    },
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "outjackets.com",
      "d1.fineyst.com",
      "www.fineystjackets.com",
      "fineystjackets.com",
      "jacket.us.com",
      "192.168.100.8",
      "images.unsplash.com",
      "localhost",
      "jacket.us.com"
    ],
    remotePatterns: [
<<<<<<< HEAD
      {
        protocol: "https",
        hostname: "d1.fineyst.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jacket.us.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.fineystjackets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fineystjackets.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.100.8",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost:3001",
        pathname: "/**",
      },
=======
      { protocol: "https", hostname: "d1.fineyst.com", pathname: "/**" },
      { protocol: "https", hostname: "www.fineystjackets.com", pathname: "/**" },
      { protocol: "https", hostname: "fineystjackets.com", pathname: "/**" },
      { protocol: "http", hostname: "192.168.100.8", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "localhost:3001", pathname: "/**" },
>>>>>>> 6fbea19 (refactor: streamline remote patterns and enhance security headers in next.config.ts)
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*", // Apply to all routes
        headers: [
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { 
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
          },

          // Existing CORS headers
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
