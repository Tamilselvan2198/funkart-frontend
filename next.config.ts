import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://spring-50046636716.development.catalystappsail.in/api/:path*",
      },
    ];
  },
};

export default nextConfig;
