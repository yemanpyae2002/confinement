import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import FaqBlock from "@/components/site/Faq";
import FilterGrid from "@/components/site/FilterGrid";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd, itemListLd, faqLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { allListings, allTags, byReviews, CATS, regionCounts, YEAR } from "@/lib/listings";
import { allListingsIntro, ALL_LISTINGS_FAQS } from "@/lib/content";

const total = allListings().length;

export const metadata: Metadata = buildMetadata({
  title: `Confinement Centres in Singapore (${total} Verified) — ${YEAR}`,
  description: `Browse all ${total} confinement centres, nanny agencies and postnatal providers in Singapore. Filter by region, compare prices and reviews, enquire free.`,
  path: "/confinement-centres/",
});

export default function AllListingsPage() {
  const listings = byReviews();
  const counts = regionCounts();
  const tags = allTags();

  return (
    <>
      <SchemaScripts
        blocks={[
          breadcrumbLd([{ name: "Confinement centres" }]),
          itemListLd(listings, "Confinement centres and services in Singapore"),
          faqLd(ALL_LISTINGS_FAQS),
        ]}
      />
      <Header active="centres" />
      <main id="main">
        <Breadcrumbs items={[{ name: "Confinement centres" }]} />

        <section className="wrap" style={{ paddingTop: 18 }}>
          <h1>Confinement Centres in Singapore ({total} Verified Listings)</h1>
          <div className="prose">{allListingsIntro(total, counts)}</div>
        </section>

        <section className="wrap" style={{ paddingBottom: 60 }}>
          <FilterGrid listings={listings} cats={CATS} tags={tags} compare />
        </section>

        <section className="sec sec-alt">
          <div className="wrap narrow">
            <FaqBlock items={ALL_LISTINGS_FAQS} />
          </div>
        </section>

        <section className="sec">
          <div className="wrap narrow">
            <div className="form-card">
              <LeadForm
                subject="Enquiry from All Listings — ConfinementFinderSG"
                hidden={{ lead_type: "all-listings" }}
                heading="Still not sure which to choose?"
                hint="Tell us your due date, region and budget. We'll shortlist 3–5 providers that genuinely fit and send your enquiry for you."
                button="Get my free shortlist"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
