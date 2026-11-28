import type { NextConfig } from "next";

const supabaseImageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/inventory", destination: "/shop", permanent: true },
      { source: "/rentals", destination: "/rent", permanent: true },
      { source: "/collections/golf-carts-for-sale-south-africa", destination: "/shop", permanent: true },
      { source: "/collections/electric-golf-carts-south-africa", destination: "/shop/electric-golf-carts", permanent: true },
      { source: "/collections/4-seater-golf-carts", destination: "/shop/4-seater-golf-carts", permanent: true },
      { source: "/collections/6-seater-golf-carts", destination: "/shop/6-seater-golf-carts", permanent: true },
      { source: "/collections/club-car-golf-carts", destination: "/shop/club-car", permanent: true },
      { source: "/collections/e-z-go-golf-carts", destination: "/shop/e-z-go", permanent: true },
      { source: "/collections/yamaha-golf-carts", destination: "/shop/yamaha", permanent: true },
      { source: "/collections/:collection", destination: "/shop", permanent: true },
      { source: "/inventory/:slug", destination: "/:slug", permanent: true },
    ];
  },
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
