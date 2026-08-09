import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/site/Breadcrumbs";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <Breadcrumbs items={[{ name: "Not found" }]} />
        <section className="wrap" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <div className="prose">
            <h1>We couldn&apos;t find that page</h1>
            <p>The page you&apos;re after has moved or never existed. Try one of these instead:</p>
            <ul>
              <li>
                <Link href="/confinement-centres/">All confinement centres and services</Link>
              </li>
              <li>
                <Link href="/costs/">What confinement costs in Singapore</Link>
              </li>
              <li>
                <Link href="/nanny-agencies/">Confinement nanny agencies</Link>
              </li>
              <li>
                <Link href="/confinement-food/">Confinement food delivery</Link>
              </li>
              <li>
                <Link href="/blog/">Guides for Singapore parents</Link>
              </li>
            </ul>
            <p>
              Or <Link href="/#get-matched">tell us what you need</Link> and we&apos;ll find it for you.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
