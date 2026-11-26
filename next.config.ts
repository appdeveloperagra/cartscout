import type { NextConfig } from "next";

const supabaseImageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseImageHost
        ? [{
            protocol: "https" as const,
            hostname: supabaseImageHost,
            pathname: "/storage/v1/object/public/**",
          }]
        : []),
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
