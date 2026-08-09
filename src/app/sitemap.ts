import type { MetadataRoute } from "next";
import { SITE, allListings, REGIONS, slugifyRegion } from "@/lib/listings";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const add = (path: string, priority = 0.7) =>
    entries.push({ url: `${SITE}${path}`, lastModified: now, priority });

  add("/", 1.0);
  add("/confinement-centres/", 0.9);
  add("/costs/", 0.9);
  REGIONS.forEach((r) => add(`/confinement-centres/${slugifyRegion(r)}/`));
  add("/nanny-agencies/");
  add("/postnatal-services/");
  add("/confinement-food/");
  add("/compare/");
  add("/blog/");
  getAllPosts().forEach((p) => add(p.url));
  allListings().forEach((l) => add(l.url));
  add("/about/");
  add("/contact/");
  add("/list-your-business/");
  add("/privacy/");

  return entries;
}
