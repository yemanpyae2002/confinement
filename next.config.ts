import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The whole site (canonicals, JSON-LD, internal links) is built on
  // folder-style trailing-slash URLs — e.g. /confinement-centres/ not
  // /confinement-centres. Keep Next.js consistent with that.
  trailingSlash: true,
};

export default nextConfig;
