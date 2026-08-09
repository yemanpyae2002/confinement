import data from "@/data/listings.json";
import type { CatLabel, Listing, ListingsData } from "@/lib/types";

const DATA = data as unknown as ListingsData;

export const REGIONS = DATA.regions;
export const CATS = DATA.cats;
export const CAT_URL = DATA.catUrl;

export const SITE = "https://confinementfindersg.com";
export const BUILD_DATE = new Date().toISOString().slice(0, 10);
export const BUILD_MONTH = new Date().toLocaleString("en-SG", { month: "long", year: "numeric" });
export const YEAR = new Date().getFullYear();

export function allListings(): Listing[] {
  return DATA.listings;
}

export function byReviews(): Listing[] {
  return [...DATA.listings].sort((a, b) => b.reviews - a.reviews);
}

export function getListing(slug: string): Listing | undefined {
  return DATA.listings.find((l) => l.slug === slug);
}

export function listingsByRegion(region: string): Listing[] {
  return byReviews().filter((l) => l.region === region);
}

export function listingsByCat(cat: CatLabel): Listing[] {
  return byReviews().filter((l) => l.cat_label === cat);
}

export function regionCounts(): Record<string, number> {
  const c: Record<string, number> = {};
  for (const r of REGIONS) c[r] = DATA.listings.filter((l) => l.region === r).length;
  return c;
}

export function catCounts(): Record<string, number> {
  const c: Record<string, number> = {};
  for (const cat of CATS) c[cat] = DATA.listings.filter((l) => l.cat_label === cat).length;
  return c;
}

export function allTags(): string[] {
  const s = new Set<string>();
  DATA.listings.forEach((l) => l.tags.forEach((t) => s.add(t)));
  return [...s].sort();
}

export function slugifyRegion(r: string): string {
  return r
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TAG_NAMES: Record<string, string> = {
  "korean-style": "Korean-style",
  "halal-friendly": "Halal-friendly",
  "24-hour": "24-hour",
  "home-visit": "Home visit",
  "wheelchair-accessible": "Wheelchair access",
  "online-booking": "Online booking",
};
export function tagName(t: string): string {
  return TAG_NAMES[t] ?? t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function relatedListings(l: Listing, n = 3): Listing[] {
  const rest = byReviews().filter((x) => x.slug !== l.slug);
  const sameRegion = rest.filter((x) => x.region === l.region);
  const sameCat = rest.filter((x) => x.cat_label === l.cat_label);
  const seen = new Set<string>();
  const out: Listing[] = [];
  for (const x of [...sameRegion, ...sameCat]) {
    if (!seen.has(x.slug)) {
      seen.add(x.slug);
      out.push(x);
    }
    if (out.length === n) break;
  }
  return out;
}

export function featuredListings(n = 6): Listing[] {
  const sorted = byReviews();
  const featured: Listing[] = [];
  const seenRegions = new Set<string>();
  for (const l of sorted) {
    if (featured.length >= n) break;
    if (seenRegions.has(l.region) && seenRegions.size < REGIONS.length) continue;
    featured.push(l);
    seenRegions.add(l.region);
  }
  for (const l of sorted) {
    if (featured.length >= n) break;
    if (!featured.includes(l)) featured.push(l);
  }
  return featured;
}

/** Human-friendly listing title, truncated to ~60 chars for SEO. */
export function listingTitle(l: Listing): string {
  let t = `${l.display_name} — ${l.cat_label}, ${l.region} Singapore`;
  if (t.length > 60) t = `${l.display_name} — ${l.cat_label}, ${l.region}`;
  if (t.length > 60) {
    const suffix = ` — ${l.cat_label}, ${l.region}`;
    const room = Math.max(12, 60 - suffix.length - 1);
    t = `${l.display_name.slice(0, room).replace(/[ ,&-]+$/, "")}…${suffix}`;
  }
  return t;
}

export function listingDescription(l: Listing): string {
  const desc = `${l.display_name} is a ${l.cat_label.toLowerCase()} in ${
    l.area || l.region
  }, Singapore. Google rating ${l.rating.toFixed(1)} from ${l.reviews.toLocaleString()} reviews. Check availability and pricing free.`;
  return desc.slice(0, 158);
}
