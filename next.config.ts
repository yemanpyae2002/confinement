import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The whole site (canonicals, JSON-LD, internal links) is built on
  // folder-style trailing-slash URLs — e.g. /confinement-centres/ not
  // /confinement-centres. Keep Next.js consistent with that.
  trailingSlash: true,

  async redirects() {
    return [
      // Both hostnames served an identical copy of the site, splitting crawl
      // budget across two origins. Canonicalise on the apex, which is what
      // SITE, the sitemap, JSON-LD and every canonical tag already declare.
      //
      // hPanel's redirect form only accepts the apex as a source, so this
      // cannot be done at the host level on this plan.

      // Files keep their exact path — appending a slash to /img/logo/x.png
      // would 404. Matched first so it wins over the page rule below.
      {
        source: "/:file*.:ext",
        has: [{ type: "host", value: "www.confinementfindersg.com" }],
        destination: "https://confinementfindersg.com/:file*.:ext",
        permanent: true,
      },
      // Note the trailing slash on the destination: without it the hop lands on
      // /costs and the trailingSlash rule immediately 308s again to /costs/,
      // costing every www visitor an extra round trip.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.confinementfindersg.com" }],
        destination: "https://confinementfindersg.com/:path*/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
