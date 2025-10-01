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
