import { SITE } from "@/lib/listings";
import type { Faq, Listing } from "@/lib/types";

type Json = Record<string, unknown>;

export function breadcrumbLd(items: { name: string; url?: string }[]): Json {
  const el: Json[] = [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }];
  items.forEach((it, i) => {
    const e: Json = { "@type": "ListItem", position: i + 2, name: it.name };
    if (it.url) e.item = `${SITE}${it.url}`;
    el.push(e);
  });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: el };
}

export function itemListLd(listings: Listing[], name: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.name,
      url: `${SITE}${l.url}`,
    })),
  };
}

export function faqLd(faqs: Faq[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function to24h(h: string): { opens: string; closes: string } | null {
  if (h === "Open 24 hours") return { opens: "00:00", closes: "23:59" };
  const m = h.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)[-–](\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return null;
  const t = (hh: string, mi: string | undefined, ap: string) => {
    let hour = parseInt(hh, 10) % 12;
    if (ap.toLowerCase() === "pm") hour += 12;
    return `${String(hour).padStart(2, "0")}:${String(mi ? parseInt(mi, 10) : 0).padStart(2, "0")}`;
  };
  return { opens: t(m[1], m[2], m[3]), closes: t(m[4], m[5], m[6]) };
}

// NOTE: deliberately no aggregateRating — ratings are Google's, not collected on this site.
export function localBusinessLd(l: Listing): Json {
  const type = l.cat_label === "Confinement Food" ? "FoodEstablishment" : "LocalBusiness";
  const o: Json = {
    "@context": "https://schema.org",
    "@type": type,
    name: l.name,
    url: `${SITE}${l.url}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: l.street || l.address,
      addressLocality: "Singapore",
      postalCode: l.postal_code,
      addressCountry: "SG",
    },
    geo: { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude },
    areaServed: { "@type": "AdministrativeArea", name: `${l.region} Region, Singapore` },
  };
  if (l.has_photo) o.image = `${SITE}/img/${l.slug}.jpg`;
  if (l.phone) o.telephone = l.phone;
  if (l.website) o.sameAs = [l.website];
  const spec = l.hours
    .filter(([, h]) => h && h !== "Closed" && h !== "Not published")
    .map(([day, h]) => {
      const t = to24h(h);
      return t ? { "@type": "OpeningHoursSpecification", dayOfWeek: day, ...t } : null;
    })
    .filter(Boolean);
  if (spec.length) o.openingHoursSpecification = spec;
  return o;
}

export function articleLd(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}${opts.url}` },
    author: { "@type": "Organization", name: "ConfinementFinderSG Editorial Team" },
    publisher: {
      "@type": "Organization",
      name: "ConfinementFinderSG",
      logo: { "@type": "ImageObject", url: `${SITE}/img/logo.png`, width: 512, height: 512 },
    },
  };
}

/** Renders one or more JSON-LD <script> tags. `<` is escaped so no payload can break out of the block. */
export function SchemaScripts({ blocks }: { blocks: Json[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
