import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FaqBlock from "@/components/site/Faq";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, articleLd, breadcrumbLd, faqLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { BUILD_DATE, BUILD_MONTH } from "@/lib/listings";
import { getAllPosts, getPost, relatedPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  // A post with its own hero gets it as the social card; the rest keep the
  // sitewide default that buildMetadata falls back to.
  return buildMetadata({
    title: p.title_tag,
    description: p.description,
    path: p.url,
    ogType: "article",
    ogImage: p.hero,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const related = relatedPosts(p, 3);

  return (
    <>
      <SchemaScripts
        blocks={[
          articleLd({
            headline: p.title,
            description: p.description,
            url: p.url,
            datePublished: BUILD_DATE,
            dateModified: BUILD_DATE,
            image: p.hero,
          }),
          breadcrumbLd([{ name: "Blog", url: "/blog/" }, { name: p.title }]),
          ...(p.faqs ? [faqLd(p.faqs)] : []),
        ]}
      />
      <Header active="blog" />
      <main id="main">
        <Breadcrumbs items={[{ name: "Blog", url: "/blog/" }, { name: p.title }]} />

        <article className="wrap" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <div className="prose">
            <h1>{p.title}</h1>
            <p className="byline">
              By the ConfinementFinderSG Editorial Team · Reviewed {BUILD_MONTH} · {p.reading_time} min read
            </p>

            {p.hero && (
              /* Above the fold, so it is the LCP element: fetched eagerly at high
                 priority rather than lazily, which would delay it. Matches the
                 plain-<img> approach used for listing photos. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="posthero"
                src={p.hero}
                alt={p.hero_alt || ""}
                width={1200}
                height={800}
                loading="eager"
                fetchPriority="high"
              />
            )}

            {p.toc.length > 0 && (
              <nav className="toc" aria-label="Table of contents">
                <p>On this page</p>
                <ol>
                  {p.toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div dangerouslySetInnerHTML={{ __html: p.html }} />

            <FaqBlock items={p.faqs} />

            <div className="authorbox">
              <p>
                <strong>About the authors:</strong> ConfinementFinderSG is an independent Singapore directory of
                confinement centres, nanny agencies, postnatal therapists and meal providers. We compile and
                verify every listing ourselves and publish indicative prices so families can compare before they
                enquire. <Link href="/about/">How we build this directory →</Link>
              </p>
            </div>

            <div className="cta-box">
              <h3>{p.cta_heading}</h3>
              <p>{p.cta_text}</p>
              <Link className="btn" href={p.cta_url}>
                {p.cta_label}
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="sec sec-alt">
            <div className="wrap">
              <h2 style={{ marginTop: 0 }}>Read next</h2>
              <div className="grid g3">
                {related.map((r) => (
                  <article className="card" key={r.slug}>
                    <div className="card-body">
                      <div className="badges">
                        <span className="badge badge-cat">{r.category}</span>
                      </div>
                      <h3>
                        <Link href={r.url}>{r.title}</Link>
                      </h3>
                      <p className="teaser">{r.excerpt}</p>
                      <div className="card-actions">
                        <Link className="btn btn-sm btn-ghost" href={r.url}>
                          Read guide
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
