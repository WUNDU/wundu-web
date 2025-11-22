import type { NextConfig } from "next";

const URL = process.env.BACKEND_API_BASE_URL;
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
