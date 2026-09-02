import type { NextConfig } from "next";
import path from "path";

const URL = process.env.BACKEND_API_BASE_URL;
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  skipTrailingSlashRedirect: true,
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
  images: {
    qualities: [75, 85, 100],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${URL}/:path*`,
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
