import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { allListings } from "@/lib/listings";

const total = allListings().length;

export const metadata: Metadata = buildMetadata({
  title: "About ConfinementFinderSG — How We Build This Directory",
  description:
    "Who we are, how we compile and verify every confinement listing, and how the site is funded. Independent, Singapore-made, and always free for parents.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: "About" }])]} />
      <Header />
      <main id="main">
        <Breadcrumbs items={[{ name: "About" }]} />
        <section className="wrap" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <div className="prose">
            <h1>About ConfinementFinderSG</h1>
            <p>
              <strong>ConfinementFinderSG is an independent directory of confinement care in Singapore.</strong>{" "}
              We list {total} confinement centres, nanny agencies, postnatal therapists and meal providers,
              describe what each one does in plain English, and publish honest price ranges so families can
              compare before they enquire.
            </p>

            <h2 id="why">Why this exists</h2>
            <p>
              Choosing confinement care in Singapore is unnecessarily hard. Prices are almost never published.
              Google Maps gives you a pin and a star rating but no way to compare what&apos;s included. The
              &ldquo;best confinement centre&rdquo; listicles are mostly advertorial. Meanwhile you&apos;re in
              your third trimester, tired, and trying to make a S$10,000 decision with bad information.
            </p>
            <p>
              We built the thing we wanted to exist: every provider in one place, filterable by region and type,
              with realistic costs stated up front and one enquiry form instead of fifteen.
            </p>

            <h2 id="how">How we compile and verify listings</h2>
            <ol>
              <li>
                We start from public business data across Singapore — name, address, contact details, opening
                hours and Google ratings.
              </li>
              <li>
                We filter out businesses that aren&apos;t genuinely confinement-related. Gynaecology clinics,
                baby stores and mis-tagged listings get removed rather than padding our numbers.
              </li>
              <li>
                Each listing is assigned a region from its postal sector, and a category: confinement centre,
                nanny agency, postnatal service, or confinement food.
              </li>
              <li>
                We write a factual description from the provider&apos;s own listed information.{" "}
                <strong>We never invent services a provider hasn&apos;t stated.</strong>
              </li>
              <li>
                Ratings shown are Google ratings, clearly labelled as such. We don&apos;t collect our own reviews
                and we don&apos;t mark up third-party ratings as if we did.
              </li>
            </ol>
            <p>
              Our directory covers an estimated 70–80% of the active market. We&apos;d rather list fewer real
              providers than inflate the count with businesses that don&apos;t serve confinement mums.
            </p>

            <h2 id="money">How the site is funded</h2>
            <p>
              Plainly: providers can pay for a featured placement, and we pass parent enquiries to relevant
              providers. That&apos;s it. To be specific about what this does and doesn&apos;t buy:
            </p>
            <ul>
              <li>
                <strong>Paying does not buy a better rating.</strong> Ratings come from Google and we don&apos;t
                touch them.
              </li>
              <li>
                <strong>Paying does not remove competitors.</strong> Every provider we verify is listed free,
                whether they pay or not.
              </li>
              <li>
                <strong>Featured placement is labelled &ldquo;Featured&rdquo;</strong>, never &ldquo;Best&rdquo;
                or &ldquo;Top rated&rdquo;.
              </li>
              <li>
                <strong>Enquiries go to the providers you asked about</strong>, not to the highest bidder.
              </li>
            </ul>
            <p>
              We&apos;re telling you this because a directory that hides its business model shouldn&apos;t be
              trusted with a decision this size. If you&apos;re a provider, see{" "}
              <a href="/list-your-business/">list your business</a>.
            </p>

            <h2 id="notdo">What we don&apos;t do</h2>
            <p>
              We&apos;re a finder, not a booking platform. We don&apos;t take commission on bookings, hold
              deposits, or handle contracts — you deal with the provider directly. We also don&apos;t publish
              user reviews, because a thin, gameable review section is worse than none.
            </p>

            <h2 id="wrong">Something wrong?</h2>
            <p>
              If a listing is inaccurate, out of date, or shouldn&apos;t be here, <a href="/contact/">tell us</a>{" "}
              and we&apos;ll fix it. If you own a business and want to correct or claim your listing, use the{" "}
              <a href="/list-your-business/">claim form</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
