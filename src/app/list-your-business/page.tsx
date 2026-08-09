import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "List Your Confinement Business — ConfinementFinderSG",
  description:
    "Get discovered by expecting parents across Singapore. Claim your free verified listing, or ask about featured placement and enquiry forwarding.",
  path: "/list-your-business/",
});

export default function ListYourBusinessPage() {
  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: "List your business" }])]} />
      <Header />
      <main id="main">
        <Breadcrumbs items={[{ name: "List your business" }]} />
        <section className="wrap" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <div className="prose">
            <h1>Get discovered by expecting parents</h1>
            <p>
              Parents researching confinement care in Singapore land here in their second and third trimester —
              with a budget, a due date and a decision to make within weeks.{" "}
              <strong>We send their enquiries straight to providers.</strong>
            </p>

            <h2 id="free">Every verified listing is free</h2>
            <p>
              If you run a confinement centre, nanny agency, postnatal service or confinement meal kitchen in
              Singapore, your listing costs nothing. A standard listing includes:
            </p>
            <ul>
              <li>Your own page with description, photo, opening hours, map and contact details</li>
              <li>Inclusion in region and category browsing, and in the comparison tool</li>
              <li>A direct enquiry form on your page — leads come to you by email</li>
              <li>A link to your website</li>
            </ul>

            <h2 id="featured">Featured placement</h2>
            <p>
              Featured providers get top placement on relevant category and region pages, a highlighted card, a
              larger photo presence, and priority in matched enquiries from our Get Matched flow.
            </p>
            <p>
              We don&apos;t publish pricing here because it depends on category and how many enquiries
              we&apos;re already sending in your area. Ask below and we&apos;ll reply with real numbers and
              recent enquiry volume for your category — no obligation, and no call unless you want one.
            </p>

            <h2 id="honest">Being straight with you</h2>
            <p>
              Featured placement buys <em>visibility</em>. It does not change your Google rating, does not
              remove competitors from the directory, and is always labelled &ldquo;Featured&rdquo; rather than
              &ldquo;Best&rdquo;. Parents can tell when a directory is rigged, and a directory parents don&apos;t
              trust is worthless to you.
            </p>

            <h2 id="claim">Claiming an existing listing</h2>
            <p>
              Already listed? Use the form to claim it — we&apos;ll verify you&apos;re the owner, then you can
              correct details, add a description and photos, and start receiving enquiries directly.
            </p>
          </div>

          <div className="narrow" style={{ marginTop: 36 }}>
            <div className="form-card">
              <LeadForm
                subject="Business enquiry — ConfinementFinderSG"
                hidden={{ lead_type: "business", listing: "" }}
                heading="Claim your listing or ask about featured placement"
                hint="Tell us your business name and what you'd like to do. We reply within one working day."
                button="Send enquiry"
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
