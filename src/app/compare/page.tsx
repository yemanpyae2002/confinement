import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import FaqBlock from "@/components/site/Faq";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd, faqLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { allListings, byReviews, tagName } from "@/lib/listings";
import { COMPARE_INTRO, COMPARE_FAQS } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Compare Confinement Centres in Singapore Side by Side",
  description:
    "Compare Singapore confinement centres on region, rating, hours and features. Shortlist three, send one enquiry, get quotes back directly.",
  path: "/compare/",
});

export default function ComparePage() {
  const total = allListings().length;
  const cols = byReviews()
    .filter((l) => l.cat_label === "Confinement Centre")
    .slice(0, 3);

  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: "Compare" }]), faqLd(COMPARE_FAQS)]} />
      <Header active="centres" />
      <main id="main">
        <Breadcrumbs items={[{ name: "Compare" }]} />

        <section className="wrap" style={{ paddingTop: 18 }}>
          <h1>Compare Confinement Centres in Singapore</h1>
          <div className="prose">{COMPARE_INTRO}</div>
        </section>

        <section className="wrap">
          <div className="tablewrap">
            <table className="cmp-table">
              <caption className="sr-only">Side-by-side comparison of confinement centres in Singapore</caption>
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  {cols.map((l) => (
                    <th scope="col" key={l.slug}>
                      <a href={l.url}>{l.display_name}</a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Region</th>
                  {cols.map((l) => (
                    <td key={l.slug}>{l.region}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Type</th>
                  {cols.map((l) => (
                    <td key={l.slug}>{l.cat_label}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Google rating</th>
                  {cols.map((l) => (
                    <td key={l.slug}>
                      ★ {l.rating.toFixed(1)}
                      <br />
                      <span className="c">{l.reviews.toLocaleString()} reviews</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Features</th>
                  {cols.map((l) => (
                    <td key={l.slug}>{l.tags.length ? l.tags.map(tagName).join(", ") : "—"}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Opening hours</th>
                  {cols.map((l) => (
                    <td key={l.slug}>{l.hours_summary}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Contact</th>
                  {cols.map((l) => (
                    <td key={l.slug}>
                      {l.phone && (
                        <>
                          <a href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>
                          <br />
                        </>
                      )}
                      {l.website && (
                        <a href={l.website} rel="nofollow noopener" target="_blank">
                          Website ↗
                        </a>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">&nbsp;</th>
                  {cols.map((l) => (
                    <td key={l.slug}>
                      <a className="btn btn-sm" href={`${l.url}#enquire`}>
                        Enquire
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="pricenote">
            Ratings shown are Google ratings, not reviews collected by ConfinementFinderSG. Prices are not
            published by most providers — send one enquiry below to get current quotes.
          </p>
        </section>

        <section className="sec">
          <div className="wrap narrow">
            <div className="form-card">
              <LeadForm
                subject="Compare enquiry — ConfinementFinderSG"
                hidden={{ lead_type: "compare", compared: "" }}
                heading="Send one enquiry to all of them"
                hint="Rather than filling in three separate forms, tell us once. We'll forward it to the centres you're comparing and they'll reply to you directly."
                button="Send to all selected"
              />
            </div>
          </div>
        </section>

        <section className="sec sec-alt">
          <div className="wrap narrow">
            <FaqBlock items={COMPARE_FAQS} />
            <p style={{ marginTop: 26 }}>
              <Link className="btn btn-ghost" href="/confinement-centres/">
                Browse all {total} listings
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
