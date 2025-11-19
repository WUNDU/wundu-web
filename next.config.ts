import type { NextConfig } from "next";

const BACKEND_API_BASE_URL = "https://wundu-api-production.up.railway.app/api/v1";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${BACKEND_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
