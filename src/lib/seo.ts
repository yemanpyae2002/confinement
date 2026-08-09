import type { Metadata } from "next";
import { SITE } from "@/lib/listings";

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
}): Metadata {
  const url = `${SITE}${opts.path}`;
  const image = opts.ogImage ? `${SITE}${opts.ogImage}` : `${SITE}/img/og-default.png`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "ConfinementFinderSG",
      type: opts.ogType || "website",
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      locale: "en_SG",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
