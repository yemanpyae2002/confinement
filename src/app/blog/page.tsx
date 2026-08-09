import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = buildMetadata({
  title: "Confinement Guides for Singapore Parents & Mums-to-Be",
  description:
    "Straight answers on confinement centres, nannies, costs, food and traditions — written for Singapore parents planning the fourth trimester. Free to read.",
  path: "/blog/",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const grouped = new Map<string, typeof posts>();
  for (const p of posts) {
    const arr = grouped.get(p.category) || [];
    arr.push(p);
    grouped.set(p.category, arr);
  }

  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: "Blog" }])]} />
      <Header active="blog" />
      <main id="main">
        <Breadcrumbs items={[{ name: "Blog" }]} />
        <section className="wrap" style={{ paddingTop: 18 }}>
          <h1>Confinement guides for Singapore parents</h1>
          <div className="prose">
            <p>
              Practical, Singapore-specific guides on choosing confinement care, what it costs, and what the
              traditions actually require. Written to answer the question first, then give you the detail.
            </p>
          </div>
        </section>

        {[...grouped.entries()].map(([cat, items], i) => (
          <section className={`sec${i % 2 === 1 ? " sec-alt" : ""}`} key={cat}>
            <div className="wrap">
              <h2 style={{ marginTop: 0 }}>{cat}</h2>
              <div className="grid g3">
                {items.map((p) => (
                  <article className="card" key={p.slug}>
                    <div className="card-body">
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
            </div>
          </section>
        ))}

        <section className="sec">
          <div className="wrap narrow">
            <div className="cta-box">
              <h3>Ready to shortlist?</h3>
              <p>
                Answer three quick questions and we&apos;ll match you with confinement centres, nannies or meal
                providers that fit your dates, region and budget.
              </p>
              <Link className="btn" href="/#get-matched">
                Get matched free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
