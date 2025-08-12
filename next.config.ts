
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "outjackets.com", "d1.fineyst.com", "jacket.us.com", "192.168.100.8", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1.fineyst.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.100.8',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
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
    ]
  },
}

export default nextConfig