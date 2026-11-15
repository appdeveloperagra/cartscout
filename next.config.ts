import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mullensgolfcarts.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
