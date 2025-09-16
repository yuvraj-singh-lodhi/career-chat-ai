// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push('@prisma/client');
    return config;
  },
};

export default nextConfig;
