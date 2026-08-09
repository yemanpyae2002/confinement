import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { BUILD_MONTH } from "@/lib/listings";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — ConfinementFinderSG",
  description:
    "What ConfinementFinderSG collects, how your enquiries are shared with providers, and how to request deletion. PDPA-aware, written in plain English.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: "Privacy" }])]} />
      <Header />
      <main id="main">
        <Breadcrumbs items={[{ name: "Privacy" }]} />
        <section className="wrap" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <div className="prose">
            <h1>Privacy policy</h1>
            <p className="pricenote">Last updated {BUILD_MONTH}. Written in plain English deliberately.</p>

            <h2 id="collect">What we collect</h2>
            <p>
              Only what you type into a form on this site: your name, email address, and optionally your phone
              number, due month, preferred region, budget range and message. We don&apos;t require anything else,
              and we don&apos;t run analytics or advertising cookies on this site.
            </p>

            <h2 id="use">What we do with it</h2>
            <p>
              We pass your enquiry to the provider or providers you asked about, so they can reply to you
              directly. That is the entire purpose of the form. If you use the Get Matched flow, we pass it to a
              small number of providers that match your stated region, budget and type of care.
            </p>
            <p>
              <strong>We do not sell your personal data.</strong> We do not add you to a marketing list without
              your asking, and we do not share your details with providers unrelated to your enquiry.
            </p>

            <h2 id="providers">Once a provider has your details</h2>
            <p>
              Providers are independent businesses and become responsible for the data we pass to them under
              Singapore&apos;s Personal Data Protection Act. If you want a provider to delete your details,
              contact them directly — and tell us too, so we can follow up.
            </p>

            <h2 id="processors">Who processes the data</h2>
            <p>
              Form submissions are handled by a third-party form service, which transmits them to our email
              inbox. Our website is served by a static hosting provider that keeps standard server logs, which
              may include IP addresses.
            </p>

            <h2 id="keep">How long we keep it</h2>
            <p>Enquiries are kept for up to 24 months so we can follow up on complaints or disputes, then deleted.</p>

            <h2 id="rights">Your rights</h2>
            <p>
              Under the PDPA you can ask what personal data we hold about you, ask us to correct it, and ask us
              to delete it. Email <a href="mailto:hello@confinementfindersg.com">hello@confinementfindersg.com</a>{" "}
              and we&apos;ll action it within 30 days.
            </p>

            <h2 id="listings">Business listings</h2>
            <p>
              Listing information — business name, address, phone, opening hours, ratings — is public business
              information, not personal data. If you own a listed business and want it amended or removed,{" "}
              <a href="/contact/">contact us</a> and we&apos;ll do it.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
