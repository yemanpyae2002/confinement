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
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
