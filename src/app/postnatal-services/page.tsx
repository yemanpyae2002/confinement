import type { Metadata } from "next";
import CategoryPage from "@/components/site/CategoryPage";
import { buildMetadata } from "@/lib/seo";
import { listingsByCat, YEAR } from "@/lib/listings";

const n = listingsByCat("Postnatal Services").length;

export const metadata: Metadata = buildMetadata({
  title: `Postnatal Massage Singapore — Compare Providers ${YEAR}`,
  description: `Compare ${n} postnatal massage and recovery providers in Singapore. Home visits and clinic packages, from ~S$450 for 5 sessions.`,
  path: "/postnatal-services/",
});

export default function Page() {
  return <CategoryPage cat="Postnatal Services" nav="postnatal" />;
}
