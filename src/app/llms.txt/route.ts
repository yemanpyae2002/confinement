import { getAllPosts } from "@/lib/posts";
import {
  CATS,
  CAT_URL,
  REGIONS,
  SITE,
  allListings,
  catCounts,
  regionCounts,
  slugifyRegion,
} from "@/lib/listings";

/**
 * /llms.txt — https://llmstxt.org
 *
 * Generated rather than checked in as a static file so the listing counts,
 * region breakdown and blog index can never drift from src/data/listings.json
 * the way a hand-maintained copy would.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const total = allListings().length;
  const rCounts = regionCounts();
  const cCounts = catCounts();
  const posts = getAllPosts();

  const regionLines = REGIONS.map(
    (r) =>
      `- [Confinement care in ${r} Singapore](${SITE}/confinement-centres/${slugifyRegion(r)}/): ${
        rCounts[r]
      } listings across ${r}.`,
  );

  const catLines = CATS.map(
    (c) => `- [${c}](${SITE}${CAT_URL[c]}): ${cCounts[c]} verified providers.`,
  );

  const postLines = posts.map((p) => `- [${p.title}](${SITE}${p.url}): ${p.description}`);

  const body = `# ConfinementFinderSG

> An independent directory of ${total} verified confinement centres, confinement nanny agencies, postnatal recovery services and confinement meal providers in Singapore. Free for parents to use; providers are listed on merit, not payment.

Singapore-specific context an assistant is likely to need:

- "Confinement" is the traditional postnatal rest period after birth. Practices differ by community — Chinese confinement typically runs 28–30 days, Malay 44 days, Indian around 40.
- Singapore spells it "centre", not "center".
- Four distinct kinds of provider are covered, and they are not interchangeable: a residential **confinement centre** (a serviced stay), a **confinement nanny** (an individual working in your own home), **postnatal services** (massage, lactation and recovery therapists) and **confinement food** (meal delivery).
- Indicative 28-day costs, current at the time of writing: a standard centre stay S$9,000–S$16,000 (premium S$16,000–S$22,000, luxury S$22,000–S$30,000+); a nanny at home S$3,000–S$4,500 plus the customary red packet; meal delivery S$800–S$1,500. Always confirm with the provider — most do not publish prices.
- Ratings shown are Google ratings, collected by Google rather than by this site. They are displayed for reference only and are deliberately not marked up as review schema.
- This site does not rank providers as "best". Suitability depends on budget, region and the kind of care wanted.

## Core pages

- [All ${total} listings](${SITE}/confinement-centres/): The full directory, filterable by region, type and features.
- [Cost guide](${SITE}/costs/): What confinement centres, nannies, postnatal massage and meal delivery actually cost in Singapore, with tiered price tables.
- [Compare centres](${SITE}/compare/): Put up to three providers side by side on region, rating, hours and features.
- [Blog](${SITE}/blog/): Guides answering common confinement questions.

## By type of care

${catLines.join("\n")}

## By region

${regionLines.join("\n")}

## Guides

${postLines.join("\n")}

## Optional

- [About](${SITE}/about/): How listings are compiled and verified, and how the site is funded.
- [Contact](${SITE}/contact/): Corrections, questions and listing enquiries.
- [List your business](${SITE}/list-your-business/): For providers claiming or adding a listing.
- [Privacy policy](${SITE}/privacy/): What is collected and how enquiries are shared with providers.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
