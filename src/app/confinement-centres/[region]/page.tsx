import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import ListingCard from "@/components/site/ListingCard";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd, itemListLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { REGIONS, byReviews, listingsByRegion, regionCounts, slugifyRegion } from "@/lib/listings";
import { REGION_INTROS } from "@/lib/content";

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: slugifyRegion(r) }));
}

function findRegion(slug: string): string | undefined {
  return REGIONS.find((r) => slugifyRegion(r) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = findRegion(regionSlug);
  if (!region) return {};
  const count = listingsByRegion(region).length;
  let title = `Confinement Centres in ${region} Singapore — Compare & Enquire`;
  if (title.length > 60) title = `Confinement Centres in ${region} Singapore — Compare`;
  return buildMetadata({
    title,
    description: `${count} confinement centres, nannies and postnatal services in ${region} Singapore. Compare ratings and features, then enquire free.`,
    path: `/confinement-centres/${regionSlug}/`,
  });
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = findRegion(regionSlug);
  if (!region) notFound();

  const rl = listingsByRegion(region);
  const centres = rl.filter((l) => l.cat_label === "Confinement Centre");
  const services = rl.filter((l) => l.cat_label !== "Confinement Centre");
  const thin = rl.length <= 7;
  const islandwide = thin
    ? byReviews()
        .filter((l) => l.region !== region && (l.cat_label === "Nanny Agency" || l.cat_label === "Confinement Food"))
        .slice(0, 6)
    : [];
  const areas = [...new Set(rl.map((l) => l.area).filter(Boolean))].slice(0, 3);
  const counts = regionCounts();
  const siblings = REGIONS.filter((r) => r !== region);

  return (
    <>
      <SchemaScripts
        blocks={[
          breadcrumbLd([{ name: "Confinement centres", url: "/confinement-centres/" }, { name: region }]),
          itemListLd(rl, `Confinement services in ${region} Singapore`),
        ]}
      />
      <Header active="centres" />
      <main id="main">
        <Breadcrumbs items={[{ name: "Confinement centres", url: "/confinement-centres/" }, { name: region }]} />

        <section className="wrap" style={{ paddingTop: 18 }}>
          <h1>Confinement Centres &amp; Services in {region} Singapore</h1>
          <div className="prose">
            <p>{REGION_INTROS[region]}</p>
            {areas.length > 0 && (
              <p>
                Listings here cover areas including {areas.join(", ")}. Compare what each provider offers, then
                send one enquiry — or read the <Link href="/costs/">Singapore confinement cost guide</Link>{" "}
                before you do.
              </p>
            )}
          </div>
        </section>

        <section className="wrap">
          {centres.length > 0 && (
            <>
              <h2>Confinement centres in {region}</h2>
              <div className="grid g3">
                {centres.map((l) => (
                  <ListingCard key={l.slug} l={l} />
                ))}
              </div>
            </>
          )}

          {thin && (
            <div className="form-card" style={{ margin: "38px 0" }}>
              <LeadForm
                subject={`Region enquiry (${region}) — ConfinementFinderSG`}
                hidden={{ lead_type: "region", region_pref: region }}
                heading="Can't find what you're looking for near you?"
                hint={`The ${region} has fewer resident centres than Central — but many nanny agencies and meal services cover the whole island, and some centres are only a short drive away. Tell us what you need and we'll shortlist options that will actually travel to you.`}
                button="Find options near me"
              />
            </div>
          )}

          {services.length > 0 && (
            <>
              <h2>Nannies, postnatal care and meals in {region}</h2>
              <p className="prose">
                Many of these providers travel to your home or deliver island-wide, so don&apos;t rule out one
                based on its address alone.
              </p>
              <div className="grid g3">
                {services.map((l) => (
                  <ListingCard key={l.slug} l={l} />
                ))}
              </div>
            </>
          )}

          {islandwide.length > 0 && (
            <>
              <h2>Island-wide services that cover {region}</h2>
              <p className="prose">These providers deliver or make home visits across Singapore, including the {region}.</p>
              <div className="grid g3">
                {islandwide.map((l) => (
                  <ListingCard key={l.slug} l={l} />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="sec">
          <div className="wrap">
            <h2>Also look nearby</h2>
            <div className="grid g4">
              {siblings.map((r) => (
                <Link className="tile tile-count" key={r} href={`/confinement-centres/${slugifyRegion(r)}/`}>
                  <span className="n">{r}</span>
                  <span className="c">
                    {counts[r]} listing{counts[r] === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 26 }}>
              Compare prices before you enquire — see the <Link href="/costs/">Singapore confinement cost guide</Link>
              , or <Link href="/compare/">compare centres side by side</Link>.
            </p>
          </div>
        </section>

        {!thin && (
          <section className="sec sec-alt">
            <div className="wrap narrow">
              <div className="form-card">
                <LeadForm
                  subject={`Region enquiry (${region}) — ConfinementFinderSG`}
                  hidden={{ lead_type: "region", region_pref: region }}
                  heading={`Enquire with ${region} providers in one go`}
                  hint="One short form. We pass it to the providers that fit your dates and budget."
                  button="Send my enquiry"
                />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
