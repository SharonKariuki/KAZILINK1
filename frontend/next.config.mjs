/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",          // Any request starting with /api/
        destination: "http://localhost:5000/api/:path*", // Forward to backend
      },
    ];
  },
};

export default nextConfig;
