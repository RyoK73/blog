import type { NextConfig } from "next";

// ローカルビルド時はNEXT_PUBLIC_SITE_URL="http://localhost:3000"を.envに追加する
if (
  !process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NODE_ENV === "production"
) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required in production");
}

const nextConfig: NextConfig = {/* config options here */};

export default nextConfig;
