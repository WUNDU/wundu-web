import type { NextConfig } from "next";
import path from "path";

const URL = process.env.BACKEND_API_BASE_URL;
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
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
