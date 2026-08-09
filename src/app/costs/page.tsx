import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LeadForm from "@/components/site/LeadForm";
import FaqBlock from "@/components/site/Faq";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { SchemaScripts, breadcrumbLd, faqLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { YEAR } from "@/lib/listings";
import { COSTS_FAQS } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: `Confinement Centre & Nanny Prices Singapore (${YEAR} Guide)`,
  description: `A 28-day confinement centre stay runs S$9,000–S$16,000; a nanny S$3,000–S$4,500. Full ${YEAR} Singapore price guide with what changes the cost.`,
  path: "/costs/",
});

export default function CostsPage() {
  return (
    <>
      <SchemaScripts blocks={[breadcrumbLd([{ name: "Costs" }]), faqLd(COSTS_FAQS)]} />
      <Header active="costs" />
      <main id="main">
        <Breadcrumbs items={[{ name: "Costs" }]} />

        <section className="wrap" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <div className="prose">
            <h1>Confinement Centre &amp; Nanny Costs in Singapore ({YEAR} Guide)</h1>

            <p>
              A 28-day stay at a standard Singapore confinement centre costs roughly{" "}
              <strong>S$9,000–S$16,000</strong>. A confinement nanny at home is about{" "}
              <strong>S$3,000–S$4,500</strong>. Meal delivery alone runs <strong>S$800–S$1,500</strong>. Those
              three numbers explain most of the decision families make.
            </p>

            <p className="pricenote">
              All figures below are indicative ranges compiled from published Singapore provider packages and
              enquiry quotes. Confinement pricing is rarely listed publicly and changes often — always verify
              directly with the provider before budgeting.
            </p>

            <h2 id="centre">Confinement centre prices (28-day stay)</h2>
            <div className="tablewrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>28-day package</th>
                    <th>What you typically get</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Standard</th>
                    <td>S$9,000 – S$16,000</td>
                    <td>Private room, all confinement meals, 24-hour nursery care, basic postnatal massage sessions</td>
                  </tr>
                  <tr>
                    <th scope="row">Premium</th>
                    <td>S$16,000 – S$22,000</td>
                    <td>Larger suite, partner can stay, more massage and lactation sessions, better room service</td>
                  </tr>
                  <tr>
                    <th scope="row">Luxury</th>
                    <td>S$22,000 – S$30,000+</td>
                    <td>Hotel-grade suite, higher staff ratio, full spa programme, premium menu, sometimes a private nurse</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Shorter stays are usually pro-rated at a slightly higher daily rate — expect roughly S$400–S$650 a
              day at a standard centre. Deposits of 10–30% at booking are normal, and cancellation terms vary a
              lot, so read them before paying. <Link href="/confinement-centres/">Browse centres by region</Link> or{" "}
              <Link href="/compare/">compare three side by side</Link>.
            </p>

            <h2 id="nanny">Confinement nanny prices (28 days)</h2>
            <div className="tablewrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Arrangement</th>
                    <th>Cost</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Stay-in via agency</th>
                    <td>S$3,000 – S$4,500</td>
                    <td>Most common. Includes agency placement fee</td>
                  </tr>
                  <tr>
                    <th scope="row">Stay-in, direct hire</th>
                    <td>S$2,600 – S$3,800</td>
                    <td>Cheaper; no vetting or replacement guarantee</td>
                  </tr>
                  <tr>
                    <th scope="row">Daytime only (~12 hrs)</th>
                    <td>S$2,200 – S$3,200</td>
                    <td>Suits families with a partner on night duty</td>
                  </tr>
                  <tr>
                    <th scope="row">Peak period surcharge</th>
                    <td>+S$300 – S$800</td>
                    <td>Chinese New Year and auspicious birth dates</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <strong>Costs people forget to budget for:</strong>
            </p>
            <ul>
              <li>
                <strong>Red packet (ang bao)</strong> — customarily S$100–S$300 at the end of the placement.
                Effectively expected.
              </li>
              <li>
                <strong>Her food</strong> — she eats what she cooks; add it to the grocery bill.
              </li>
              <li>
                <strong>MOM levy</strong> — <strong>S$60 per month</strong> if your newborn is a Singapore citizen,{" "}
                <strong>S$300 per month</strong> if not.
              </li>
              <li>
                <strong>Medical insurance</strong> — required for a foreign nanny; the minimum coverage was
                raised to S$60,000 per year for policies starting on or after 1 July 2023.
              </li>
              <li>
                <strong>Extension rate</strong> — ask the daily rate beyond 28 days. Note the work permit caps at
                16 weeks from the birth date.
              </li>
            </ul>
            <p>
              Rules and levy amounts change — confirm current figures on the{" "}
              <a href="https://www.mom.gov.sg/passes-and-permits/work-permit-for-confinement-nanny/eligibility">
                Ministry of Manpower confinement nanny work permit page
              </a>
              . More detail in our guide to{" "}
              <Link href="/blog/what-is-a-confinement-nanny/">what a confinement nanny does and costs</Link>, or{" "}
              <Link href="/nanny-agencies/">browse agencies</Link>.
            </p>

            <h2 id="massage">Postnatal massage packages</h2>
            <div className="tablewrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Typical price</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Single session</th>
                    <td>S$90 – S$180</td>
                    <td>Home visits cost more than clinic visits</td>
                  </tr>
                  <tr>
                    <th scope="row">5 sessions</th>
                    <td>S$450 – S$800</td>
                    <td>The most commonly booked package</td>
                  </tr>
                  <tr>
                    <th scope="row">10 sessions</th>
                    <td>S$900 – S$1,500</td>
                    <td>Often adds herbal treatments, womb care and binding</td>
                  </tr>
                  <tr>
                    <th scope="row">TCM / jamu premium</th>
                    <td>S$1,200 – S$2,000</td>
                    <td>With herbal baths, acupuncture or bengkung binding</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <Link href="/postnatal-services/">Compare postnatal providers →</Link>
            </p>

            <h2 id="food">Confinement food delivery</h2>
            <div className="tablewrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Typical price</th>
                    <th>Per day</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Trial day</th>
                    <td>S$30 – S$60</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <th scope="row">7 days</th>
                    <td>S$250 – S$450</td>
                    <td>~S$36 – S$64</td>
                  </tr>
                  <tr>
                    <th scope="row">14 days</th>
                    <td>S$450 – S$800</td>
                    <td>~S$32 – S$57</td>
                  </tr>
                  <tr>
                    <th scope="row">28 days (lunch + dinner)</th>
                    <td>S$800 – S$1,500</td>
                    <td>~S$28 – S$50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <Link href="/confinement-food/">Compare meal providers →</Link> or read{" "}
              <Link href="/blog/confinement-food-singapore/">what confinement food actually involves</Link>.
            </p>

            <h2 id="total">What a full confinement actually costs</h2>
            <div className="tablewrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Approach</th>
                    <th>Realistic total (28 days)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Centre stay (standard)</th>
                    <td>S$9,000 – S$16,000 — most things included</td>
                  </tr>
                  <tr>
                    <th scope="row">Nanny + massage package</th>
                    <td>S$3,700 – S$5,600 including red packet and levy</td>
                  </tr>
                  <tr>
                    <th scope="row">Meal delivery + massage</th>
                    <td>S$1,300 – S$2,300</td>
                  </tr>
                  <tr>
                    <th scope="row">Fully DIY, family help</th>
                    <td>S$300 – S$800 (groceries and herbs)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="what-affects">What actually changes the price</h2>
            <ul>
              <li>
                <strong>Length of stay</strong> — the biggest lever. Two weeks instead of four roughly halves it.
              </li>
              <li>
                <strong>Room type</strong> — at a centre, suite upgrades are the single largest add-on.
              </li>
              <li>
                <strong>Timing</strong> — Chinese New Year and auspicious date clusters carry surcharges and sell
                out first.
              </li>
              <li>
                <strong>Nanny experience</strong> — a nanny with 15 years and strong referrals commands the top of
                the range.
              </li>
              <li>
                <strong>Twins</strong> — expect a meaningful surcharge for both centres and nannies.
              </li>
              <li>
                <strong>Add-ons</strong> — extra massage sessions, lactation consults and photography are usually
                priced separately.
              </li>
            </ul>

            <h2 id="subsidy">Is any of this subsidised?</h2>
            <p>
              No. Confinement centres, nannies and meal plans are private services in Singapore and are not
              covered by MediSave, MediShield Life, or the medical components of the Baby Bonus scheme. The Baby
              Bonus cash gift can of course be spent on them, but there is no dedicated subsidy for confinement
              care. Budget accordingly.
            </p>

            <h2 id="saving">Where to save without regretting it</h2>
            <p>
              If the budget is tight, spend it on the <strong>first two weeks</strong>. That&apos;s when you are
              least mobile, most sleep-deprived and most likely to be establishing breastfeeding. A 14-day nanny
              plus meal delivery for the rest of the month usually beats spreading a thin budget across 28 days.
            </p>
            <p>
              The thing not to cut is help at night. Sleep deprivation is the single biggest driver of a
              miserable postpartum month, and it is the hardest thing to fix retrospectively. Read our{" "}
              <Link href="/blog/confinement-centre-vs-nanny-vs-diy/">
                honest comparison of the three approaches
              </Link>{" "}
              before committing.
            </p>

            <FaqBlock items={COSTS_FAQS} />
          </div>

          <div className="narrow" style={{ marginTop: 36 }}>
            <div className="form-card">
              <LeadForm
                subject="Costs page enquiry — ConfinementFinderSG"
                hidden={{ lead_type: "costs" }}
                heading="Tell us your budget, we'll shortlist for you"
                hint="Send your due date, region and budget. We'll come back with providers that genuinely fit the number you have in mind — no upselling."
                button="Get my free shortlist"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
