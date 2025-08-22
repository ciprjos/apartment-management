import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "/": ["../../node_modules/argon2/prebuilds/linux-x64/*"],
  },
};

export default nextConfig;
