import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pdf2json for server-side only
      config.externals = config.externals || [];
      config.externals.push({
        'pdf2json': 'commonjs pdf2json',
      });
    }
    return config;
  },
};

export default nextConfig;
