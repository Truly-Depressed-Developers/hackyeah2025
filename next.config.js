/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ii7d1qgb00.ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/images/*",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "oh1cjz7kar.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};

export default config;
