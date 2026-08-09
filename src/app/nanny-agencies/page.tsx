import type { Metadata } from "next";
import CategoryPage from "@/components/site/CategoryPage";
import { buildMetadata } from "@/lib/seo";
import { listingsByCat, YEAR } from "@/lib/listings";

const n = listingsByCat("Nanny Agency").length;

export const metadata: Metadata = buildMetadata({
  title: `Confinement Nanny Agencies Singapore — Compare ${YEAR}`,
  description: `Compare ${n} confinement nanny agencies in Singapore. Typical cost S$3,000–S$4,500 for 28 days. Check availability and get quotes free.`,
  path: "/nanny-agencies/",
});

export default function Page() {
  return <CategoryPage cat="Nanny Agency" nav="nanny" />;
}
