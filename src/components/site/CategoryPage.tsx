import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import FaqBlock from "@/components/site/Faq";
import FilterGrid from "@/components/site/FilterGrid";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Link from "next/link";
import { SchemaScripts, breadcrumbLd, itemListLd, faqLd } from "@/lib/schema";
import { listingsByCat } from "@/lib/listings";
import { CATEGORY_COPY } from "@/lib/content";
import { getPost } from "@/lib/posts";
import type { CatLabel } from "@/lib/types";

export default function CategoryPage({ cat, nav }: { cat: Exclude<CatLabel, "Confinement Centre">; nav: string }) {
  const cfg = CATEGORY_COPY[cat];
  const listings = listingsByCat(cat);
  const relatedPosts = cfg.posts.map((s) => getPost(s)).filter(Boolean) as NonNullable<ReturnType<typeof getPost>>[];

  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: cfg.h1 }]), itemListLd(listings, cfg.h1), faqLd(cfg.faqs)]} />
      <Header active={nav} />
      <main id="main">
        <Breadcrumbs items={[{ name: cfg.h1 }]} />

        <section className="wrap" style={{ paddingTop: 18 }}>
          <h1>{cfg.h1}</h1>
          <div className="prose">{cfg.intro}</div>
        </section>

        <section className="wrap" style={{ paddingBottom: 50 }}>
          <FilterGrid
            listings={listings}
            noResultsHint="Many providers here cover the whole island — clear the filter, or ask us directly."
          />
        </section>

        <section className="sec sec-alt">
          <div className="wrap narrow">
            <FaqBlock items={cfg.faqs} />
            {relatedPosts.length > 0 && (
              <>
                <h2>Read next</h2>
                <ul>
                  {relatedPosts.map((p) => (
                    <li key={p.slug}>
                      <Link href={p.url}>{p.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        <section className="sec">
          <div className="wrap narrow">
            <div className="form-card">
              <LeadForm
                subject={`Enquiry: ${cfg.h1} — ConfinementFinderSG`}
                hidden={{ lead_type: "category", category: cfg.h1 }}
                heading={`Get quotes from ${cfg.h1.toLowerCase()}`}
                hint="Tell us your dates and budget — we'll pass your enquiry to providers that have availability."
                button="Send my enquiry"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
