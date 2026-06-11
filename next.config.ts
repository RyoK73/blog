import type { NextConfig } from "next";

if (
  !process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NODE_ENV === "production"
) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required in production");
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
