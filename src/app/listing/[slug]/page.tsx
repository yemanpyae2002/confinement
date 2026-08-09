import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import LazyMap from "@/components/site/LazyMap";
import ListingCard, { Photo, Stars } from "@/components/site/ListingCard";
import { TagBadges } from "@/components/site/ListingCard";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd, localBusinessLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { allListings, getListing, listingDescription, listingTitle, relatedListings, slugifyRegion } from "@/lib/listings";

export function generateStaticParams() {
  return allListings().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) return {};
  return buildMetadata({
    title: listingTitle(l),
    description: listingDescription(l),
    path: l.url,
    ogImage: l.has_photo ? `/img/${l.slug}.jpg` : "/img/og-default.svg",
  });
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) notFound();

  const related = relatedListings(l, 3);
  const crumbItems = [
    { name: l.cat_label, url: l.cat_url },
    { name: l.region, url: `/confinement-centres/${slugifyRegion(l.region)}/` },
    { name: l.display_name },
  ];

  return (
    <>
      <SchemaScripts blocks={[localBusinessLd(l), breadcrumbLd(crumbItems)]} />
      <Header active="centres" />
      <main id="main" className="has-mobcta">
        <Breadcrumbs
          items={[
            { name: l.cat_label, url: l.cat_url },
            { name: l.region, url: `/confinement-centres/${slugifyRegion(l.region)}/` },
            { name: l.display_name },
          ]}
        />

        <div className="wrap listing-head">
          <h1>{l.name}</h1>
          <div className="badges">
            <span className="badge badge-region">{l.region}</span>
            <span className="badge badge-cat">{l.cat_label}</span>
            <TagBadges tags={l.tags} />
          </div>
          <div className="quickbar">
            <Stars rating={l.rating} reviews={l.reviews} />
            {l.phone && <a href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>}
            {l.website && (
              <a href={l.website} rel="nofollow noopener" target="_blank">
                Visit website ↗
              </a>
            )}
            <span>{l.address}</span>
          </div>
        </div>

        <div className="wrap layout">
          <div>
            <div className="hero-img card-media" data-c={l.cat_label}>
              <Photo l={l} />
            </div>

            <h2>About {l.display_name}</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: l.about_html }} />

            {l.highlights.length > 0 && (
              <>
                <h2>Services &amp; highlights</h2>
                <ul className="ticks">
                  {l.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </>
            )}

            {l.hours.length > 0 && (
              <>
                <h2>Opening hours</h2>
                <div className="tablewrap">
                  <table className="hours">
                    <caption className="sr-only">Opening hours for {l.name}</caption>
                    <tbody>
                      {l.hours.map(([d, h]) => (
                        <tr key={d}>
                          <th scope="row">{d}</th>
                          <td>{h}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="pricenote">
                  Hours are from the provider&apos;s Google listing and can change — confirm before you visit.
                </p>
              </>
            )}

            <h2>Where it is</h2>
            <p>{l.address}</p>
            <LazyMap src={l.map_src} title={`Map showing ${l.name}`} />

            <h2 id="enquire">Check availability &amp; pricing</h2>
            <div className="form-card">
              <LeadForm
                subject={`Enquiry: ${l.name} — ConfinementFinderSG`}
                hidden={{
                  lead_type: "listing",
                  listing: l.name,
                  listing_slug: l.slug,
                  region: l.region,
                  category: l.cat_label,
                }}
                hint={`Send one enquiry and ${l.display_name} will get back to you directly with availability and current package prices. Free, no obligation.`}
                button={`Send enquiry to ${l.display_name.length > 28 ? `${l.display_name.slice(0, 27)}…` : l.display_name}`}
              />
            </div>

            {related.length > 0 && (
              <>
                <h2>Similar options nearby</h2>
                <div className="grid g3">
                  {related.map((r) => (
                    <ListingCard key={r.slug} l={r} />
                  ))}
                </div>
              </>
            )}

            <p className="owner-links">
              Are you the owner? <Link href={`/list-your-business/?listing=${l.slug}`}>Claim this listing</Link> ·
              Something wrong? <Link href={`/contact/?about=${l.slug}`}>Report an issue</Link>
            </p>
          </div>

          <aside>
            <div className="panel sticky">
              <h3 style={{ marginTop: 0 }}>At a glance</h3>
              <table className="hours">
                <tbody>
                  <tr>
                    <th scope="row">Type</th>
                    <td>{l.cat_label}</td>
                  </tr>
                  <tr>
                    <th scope="row">Region</th>
                    <td>
                      <Link href={`/confinement-centres/${slugifyRegion(l.region)}/`}>{l.region}</Link>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google rating</th>
                    <td>
                      ★ {l.rating.toFixed(1)} ({l.reviews.toLocaleString()})
                    </td>
                  </tr>
                  {l.phone && (
                    <tr>
                      <th scope="row">Phone</th>
                      <td>
                        <a href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>
                      </td>
                    </tr>
                  )}
                  {l.website && (
                    <tr>
                      <th scope="row">Website</th>
                      <td>
                        <a href={l.website} rel="nofollow noopener" target="_blank">
                          Visit ↗
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p style={{ margin: "16px 0 0" }}>
                <a className="btn btn-block" href="#enquire">
                  Check availability
                </a>
              </p>
              <p className="privacy-note">
                Prices are not published by most providers — enquire for a current quote. See{" "}
                <Link href="/costs/">typical ranges</Link>.
              </p>
            </div>
          </aside>
        </div>

        <div className="mob-cta">
          <a className="btn btn-block" href="#enquire">
            Check availability &amp; pricing
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
