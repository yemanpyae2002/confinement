import type { Metadata } from "next";
import CategoryPage from "@/components/site/CategoryPage";
import { buildMetadata } from "@/lib/seo";
import { listingsByCat, YEAR } from "@/lib/listings";

const n = listingsByCat("Confinement Food").length;

export const metadata: Metadata = buildMetadata({
  title: `Confinement Food Delivery Singapore — Compare ${YEAR}`,
  description: `Compare ${n} confinement food delivery providers across Singapore, with Google ratings and delivery areas. Typically S$800–S$1,500 for 28 days of meals.`,
  path: "/confinement-food/",
});

export default function Page() {
  return <CategoryPage cat="Confinement Food" nav="food" />;
}
