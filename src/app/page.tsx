import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ListingCard from "@/components/site/ListingCard";
import GetMatchedQuiz from "@/components/site/GetMatchedQuiz";
import { SchemaScripts } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import {
  REGIONS,
  SITE,
  allListings,
  catCounts,
  featuredListings,
  regionCounts,
  slugifyRegion,
  BUILD_MONTH,
} from "@/lib/listings";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = buildMetadata({
  title: "ConfinementFinderSG — Find Your Perfect Confinement Centre",
  description: `Compare ${allListings().length} verified confinement centres, nanny agencies, postnatal services and meal providers in Singapore. Honest price guidance, free enquiries.`,
  path: "/",
});

export default function HomePage() {
  const total = allListings().length;
  const counts = regionCounts();
  const cCounts = catCounts();
  const featured = featuredListings(6);
  const posts = getAllPosts().slice(0, 3);

  const needCards = [
    { name: "Confinement Centres", url: "/confinement-centres/", count: cCounts["Confinement Centre"] },
    { name: "Nanny Agencies", url: "/nanny-agencies/", count: cCounts["Nanny Agency"] },
    { name: "Postnatal Services", url: "/postnatal-services/", count: cCounts["Postnatal Services"] },
    { name: "Confinement Food", url: "/confinement-food/", count: cCounts["Confinement Food"] },
  ];

  return (
    <>
      <SchemaScripts
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ConfinementFinderSG",
            url: `${SITE}/`,
            description: "Singapore directory of confinement centres, nannies and postnatal care.",
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ConfinementFinderSG",
            url: `${SITE}/`,
            logo: `${SITE}/img/og-default.svg`,
            areaServed: "SG",
          },
        ]}
      />
      <Header active="home" />
      <main id="main">
        <section className="hero">
          <div className="wrap">
            <h1>Find your perfect confinement centre</h1>
            <p className="sub">
              Compare {total} verified confinement centres, nanny agencies, postnatal therapists and meal
              services across Singapore — with honest price guidance and one free enquiry.
            </p>
            <div className="region-pick">
              {REGIONS.map((r) => (
                <Link key={r} href={`/confinement-centres/${slugifyRegion(r)}/`}>
                  {r} <span aria-hidden="true">·</span> {counts[r]}
                </Link>
              ))}
            </div>
            <div className="hero-cta">
              <a className="btn" href="#get-matched">
                Get matched free
              </a>
              <Link className="btn btn-ghost" href="/confinement-centres/">
                Browse all listings
              </Link>
            </div>
          </div>
        </section>

        <section className="sec sec-alt" id="get-matched">
          <div className="wrap">
            <div className="sec-head">
              <h2>Not sure where to start? Answer 3 questions.</h2>
              <p>
                Tell us when you&apos;re due and what kind of help you want. We&apos;ll shortlist the right
                providers and send your enquiry — free, and with no obligation.
              </p>
            </div>
            <GetMatchedQuiz />
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>Browse by region</h2>
              <p>Most mums choose a centre close to home or to their parents. Start with your area.</p>
            </div>
            <div className="grid g5">
              {REGIONS.map((r) => (
                <Link className="tile" key={r} href={`/confinement-centres/${slugifyRegion(r)}/`}>
                  <span className="n">{r}</span>
                  <span className="c">
                    {counts[r]} listing{counts[r] === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec-alt">
          <div className="wrap">
            <div className="sec-head">
              <h2>Browse by what you need</h2>
              <p>
                Confinement care in Singapore comes in four main forms. They cost very differently —{" "}
                <Link href="/costs/">see the price guide</Link>.
              </p>
            </div>
            <div className="grid g4">
              {needCards.map((c) => (
                <Link className="tile" key={c.url} href={c.url}>
                  <span className="n">{c.name}</span>
                  <span className="c">
                    {c.count} listing{c.count === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>Featured providers</h2>
              <p>
                Well-established providers with a strong track record on Google. Listed for visibility, not
                ranked as &ldquo;best&rdquo; — the right one depends on your budget and region.
              </p>
            </div>
            <div className="grid g3">
              {featured.map((l) => (
                <ListingCard key={l.slug} l={l} />
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 28 }}>
              <Link className="btn btn-ghost" href="/confinement-centres/">
                See all {total} listings
              </Link>
            </p>
          </div>
        </section>

        <section className="sec sec-alt">
          <div className="wrap">
            <div className="sec-head">
              <h2>Why use ConfinementFinderSG instead of just Googling?</h2>
            </div>
            <div className="grid g4">
              <div className="tile" style={{ textAlign: "left" }}>
                <span className="n">Compare side by side</span>
                <p className="c" style={{ marginTop: 8 }}>
                  Put three centres next to each other — region, hours, rating, what they offer — instead of
                  juggling 12 browser tabs.
                </p>
              </div>
              <div className="tile" style={{ textAlign: "left" }}>
                <span className="n">Honest price ranges</span>
                <p className="c" style={{ marginTop: 8 }}>
                  Most centres hide prices behind a form. Our <Link href="/costs/">cost guide</Link> tells you the
                  realistic ranges before you enquire.
                </p>
              </div>
              <div className="tile" style={{ textAlign: "left" }}>
                <span className="n">Every listing described</span>
                <p className="c" style={{ marginTop: 8 }}>
                  Plain-English descriptions of who each provider suits — not just a pin on a map and a star
                  rating.
                </p>
              </div>
              <div className="tile" style={{ textAlign: "left" }}>
                <span className="n">One enquiry, several replies</span>
                <p className="c" style={{ marginTop: 8 }}>
                  Fill in one short form and we pass it to your shortlist. No repeating your due date five times.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>Start with these guides</h2>
              <p>Written for third-trimester mums who want a straight answer.</p>
            </div>
            <div className="grid g3">
              {posts.map((p) => (
                <article className="card" key={p.slug}>
                  <div className="card-body">
                    <div className="badges">
                      <span className="badge badge-cat">{p.category}</span>
                    </div>
                    <h3>
                      <Link href={p.url}>{p.title}</Link>
                    </h3>
                    <p className="teaser">{p.excerpt}</p>
                    <div className="card-actions">
                      <Link className="btn btn-sm btn-ghost" href={p.url}>
                        Read guide
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="trust">
              {total} verified listings · Updated {BUILD_MONTH} · Made in Singapore for Singapore mums
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
