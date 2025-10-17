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
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Or specify your domains
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;