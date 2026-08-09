export type CatLabel =
  | "Confinement Centre"
  | "Nanny Agency"
  | "Postnatal Services"
  | "Confinement Food";

export interface Listing {
  slug: string;
  name: string;
  display_name: string;
  initials: string;
  url: string;
  cat_label: CatLabel;
  cat_url: string;
  region: string;
  tags: string[];
  hours: [string, string][];
  hours_summary: string;
  phone: string;
  website: string;
  address: string;
  street: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  highlights: string[];
  has_photo: boolean;
  /** Business's own logo, mirrored locally. Absent when none was available. */
  logo?: string;
  area: string;
  map_src: string;
  teaser: string;
  about_html: string;
}

export interface ListingsData {
  listings: Listing[];
  regions: string[];
  cats: CatLabel[];
  catUrl: Record<CatLabel, string>;
}

export interface Faq {
  q: string;
  a: string;
}

export interface PostMeta {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  description: string;
  title_tag: string;
  cta_heading: string;
  cta_text: string;
  cta_url: string;
  cta_label: string;
  faqs?: Faq[];
}

export interface Post extends PostMeta {
  html: string;
  url: string;
  toc: { id: string; text: string }[];
  reading_time: number;
  words: number;
}
