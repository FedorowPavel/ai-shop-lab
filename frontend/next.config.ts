import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.94.0.1'],
  async rewrites() {
    const api = process.env.API_URL ?? 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${api}/:path*`,
      },
    ];
  },
};

export default nextConfig;
