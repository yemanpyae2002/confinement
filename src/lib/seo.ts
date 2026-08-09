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
  const image = opts.ogImage ? `${SITE}${opts.ogImage}` : `${SITE}/img/og-default.svg`;
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
      images: [{ url: image }],
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
