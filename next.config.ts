import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', // Roteia chamadas para /api/v1/* no frontend
        destination: 'http://localhost:8081/api/v1/:path*', // Redireciona para o backend
      },
    ];
  },
};

export default nextConfig;
