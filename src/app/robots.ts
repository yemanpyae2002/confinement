import type { MetadataRoute } from "next";
import { SITE } from "@/lib/listings";
import { SITE_IS_PRIVATE } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  if (SITE_IS_PRIVATE) {
    // Site isn't ready to be discovered yet — disallow all crawling and
    // omit the sitemap so nothing points crawlers at it.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Every canonical URL on this site is a clean path. The only query
      // string the app ever produces is /compare/?ids=… , a user's transient
      // shortlist — infinite permutations, no unique content, and the same
      // page as /compare/. Filters and sorting are client-side state and
      // never reach the URL, so no other parameter needs blocking.
      disallow: ["/*?"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
