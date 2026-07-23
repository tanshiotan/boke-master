import type { NextConfig } from "next";

// FastAPIの接続先 サーバー側でのみ参照するためNEXT_PUBLIC_は付けない
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
