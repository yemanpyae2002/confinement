import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact ConfinementFinderSG",
  description:
    "Get in touch about a listing, a correction, or help finding confinement care in Singapore. We reply to most enquiries within one working day.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: "Contact" }])]} />
      <Header />
      <main id="main">
        <Breadcrumbs items={[{ name: "Contact" }]} />
        <section className="wrap" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <div className="prose">
            <h1>Contact us</h1>
            <p>
              Questions about a listing, a correction to make, or you&apos;d like help finding the right
              confinement care? Send us a message and we&apos;ll reply within one to two working days.
            </p>
            <p>
              If you own a business and want to claim or update your listing, the{" "}
              <a href="/list-your-business/">list your business</a> page is faster.
            </p>
          </div>
          <div className="narrow" style={{ marginTop: 36 }}>
            <div className="form-card">
              <LeadForm
                subject="Contact form — ConfinementFinderSG"
                hidden={{ lead_type: "contact" }}
                heading="Send us a message"
                hint="We read everything and reply to everything."
                button="Send message"
                compact
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
