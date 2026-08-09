import Link from "next/link";
import type { Faq } from "@/lib/types";
import type { CatLabel } from "@/lib/types";

export function allListingsIntro(total: number, counts: Record<string, number>) {
  return (
    <>
      <p>
        This is the full directory of confinement care in Singapore — <strong>{total} verified providers</strong>{" "}
        covering residential confinement centres, confinement nanny agencies, postnatal recovery therapists and
        confinement meal delivery. Filter by region, type and features, shortlist up to three, and send one
        enquiry instead of {total} emails.
      </p>
      <p>
        <strong>What does a confinement centre cost in Singapore?</strong> Expect roughly{" "}
        <strong>S$9,000–S$16,000</strong> for a 28-day stay at a standard centre, and{" "}
        <strong>S$18,000–S$30,000+</strong> at the luxury end. A confinement nanny at home is usually{" "}
        <strong>S$3,000–S$4,500</strong> for 28 days including the agency fee, plus the customary red packet.
        Meal delivery runs about <strong>S$800–S$1,500</strong> for 28 days. These are indicative ranges — always
        confirm with the provider. Our <Link href="/costs/">confinement cost guide</Link> breaks down what changes the
        price.
      </p>
      <p>
        <strong>Centre or nanny?</strong> A centre is a serviced stay: you check in, staff handle night feeds,
        meals arrive, and you go home when confinement ends. A nanny lives in your home for 28 days and does the
        same job one-to-one for roughly a third of the price — if you have a spare room and don&apos;t mind
        another adult in the house. Neither is objectively better; it comes down to space, budget and how much
        you want handled for you. Our honest{" "}
        <Link href="/blog/confinement-centre-vs-nanny-vs-diy/">centre vs nanny vs DIY comparison</Link> walks through
        who each option suits.
      </p>
      <p>
        Listings are spread across {counts.Central ?? 0} in Central, {counts.East ?? 0} in the East,{" "}
        {counts["North-East"] ?? 0} in the North-East, {counts.North ?? 0} in the North and {counts.West ?? 0} in
        the West. Many nanny agencies and meal providers serve the whole island regardless of their office
        address.
      </p>
    </>
  );
}

export const ALL_LISTINGS_FAQS: Faq[] = [
  {
    q: "Is a confinement centre worth it?",
    a: "It's worth it if you value round-the-clock newborn care, cooked confinement meals and no household logistics during recovery — and can budget S$9,000–S$16,000 for 28 days. If you have space at home and family support, a confinement nanny delivers similar care one-to-one for roughly a third of the price.",
  },
  {
    q: "Can a husband stay with his wife in a confinement centre?",
    a: "At most Singapore confinement centres, yes — partners can usually stay overnight, though some charge extra for a second occupant or limit visits to certain hours. Policies differ significantly between centres, so confirm before booking if overnight company matters to you.",
  },
  {
    q: "How much is a confinement nanny in Singapore?",
    a: "A stay-in confinement nanny typically costs S$3,000–S$4,500 for 28 days through an agency, including the agency placement fee. Budget separately for the customary red packet (about S$100–S$300) and, for foreign nannies, the Ministry of Manpower work permit and levy.",
  },
  {
    q: "Is there a confinement centre in Singapore?",
    a: "Yes — Singapore has a growing number of dedicated confinement centres, concentrated in the Central region with others in the East and North-East. They offer residential postnatal stays with meals, newborn care and recovery support, typically for 28 days.",
  },
  {
    q: "How far in advance should I book?",
    a: "Book in your second trimester if you can. Popular centres and experienced nannies are commonly reserved four to six months ahead, and peak periods around auspicious birth dates fill earliest. Enquiring early costs nothing and most providers hold a slot with a small deposit.",
  },
];

interface CategoryCopy {
  h1: string;
  title: string;
  desc: string;
  intro: React.ReactNode;
  faqs: Faq[];
  posts: string[];
}

export const CATEGORY_COPY: Record<Exclude<CatLabel, "Confinement Centre">, CategoryCopy> = {
  "Nanny Agency": {
    h1: "Confinement Nanny Agencies in Singapore",
    title: "Confinement Nanny Agencies Singapore — Compare {year}",
    desc: "Compare {n} confinement nanny agencies in Singapore. Typical cost S$3,000–S$4,500 for 28 days. Check availability and get quotes free.",
    intro: (
      <>
        <p>
          A confinement nanny (<em>pui yuet</em> in Cantonese, <em>yue sao</em> in Mandarin) moves into your home
          for the confinement period — usually 28 days — and takes care of both mother and newborn. She cooks
          confinement meals, handles night feeds so you can sleep, bathes the baby, does baby laundry and
          supports your recovery. Most families in Singapore hire through an agency rather than directly, because
          agencies vet nannies, handle work-permit paperwork and provide a replacement if the placement
          doesn&apos;t work out.
        </p>
        <p>
          <strong>What it costs:</strong> expect <strong>S$3,000–S$4,500 for 28 days</strong> stay-in through an
          agency, inclusive of the placement fee. Daytime-only arrangements run lower, roughly
          S$2,200–S$3,200. On top of the fee, it&apos;s customary to give a red packet (<em>ang bao</em>) of
          around S$100–S$300 at the end, and to cover the nanny&apos;s food. Full breakdown in our{" "}
          <Link href="/costs/">confinement cost guide</Link>.
        </p>
        <p>
          <strong>The work permit point:</strong> most confinement nannies in Singapore are Malaysian and require
          a work permit. Agencies normally handle the Ministry of Manpower application, but the employer of
          record is you — so confirm in writing who is applying, what the levy is, and what happens if the
          permit is rejected. Our guide on{" "}
          <Link href="/blog/what-is-a-confinement-nanny/">what a confinement nanny does and costs</Link> covers this in
          detail.
        </p>
        <p>
          Agencies below are listed with their registered office region, but nearly all place nannies
          island-wide — don&apos;t filter one out purely on address.
        </p>
      </>
    ),
    faqs: [
      {
        q: "What does a confinement nanny do?",
        a: "A confinement nanny cooks confinement meals, cares for the newborn including night feeds and bathing, does baby laundry, and supports the mother's recovery with practices like herbal baths and massage. She typically works six days a week and lives in your home for 28 days.",
      },
      {
        q: "How much is a confinement nanny in Singapore?",
        a: "Roughly S$3,000–S$4,500 for a 28-day stay-in placement through an agency, including the agency fee. Daytime-only is around S$2,200–S$3,200. Add the customary red packet of S$100–S$300 and, for foreign nannies, the work permit levy.",
      },
      {
        q: "Where can I get a confinement nanny in Singapore?",
        a: "Through a licensed confinement nanny agency — the fastest route, since agencies pre-screen candidates and handle work permits — or by direct referral from family and friends. This page lists established agencies across Singapore with their Google ratings.",
      },
      {
        q: "How do I apply for a work permit for a confinement nanny?",
        a: "Foreign confinement nannies need a Ministry of Manpower work permit, valid for up to 16 weeks from the child's birth. Most agencies file it for you, but you are the legal employer. Apply early — approval can take a couple of weeks.",
      },
    ],
    posts: ["what-is-a-confinement-nanny", "confinement-centre-vs-nanny-vs-diy"],
  },
  "Postnatal Services": {
    h1: "Postnatal Massage & Recovery Services in Singapore",
    title: "Postnatal Massage Singapore — Compare Providers {year}",
    desc: "Compare {n} postnatal massage and recovery providers in Singapore. Home visits and clinic packages, from ~S$450 for 5 sessions.",
    intro: (
      <>
        <p>
          Postnatal massage is the most-booked confinement service in Singapore, and the one most mums book even
          when they skip everything else. A typical course is <strong>5 to 10 sessions</strong> in the weeks
          after birth, combining massage, womb care and abdominal binding (the <em>bengkung</em> in Malay-style
          jamu, or a binder in TCM-style treatments) to ease soreness, reduce swelling and support the body back
          into shape.
        </p>
        <p>
          <strong>What it costs:</strong> roughly{" "}
          <strong>S$450–S$800 for a package of five home-visit sessions</strong>, or S$90–S$180 per single
          session. Clinic-based TCM packages that add herbal treatments or acupuncture run higher. Many providers
          here travel to your home, which matters a lot in the first fortnight.
        </p>
        <p>
          This category also covers lactation consultants, TCM physicians offering postpartum treatment, doulas
          and womb-care specialists. If you&apos;re recovering at home without a nanny, these are the services
          that fill the gap — and they pair well with{" "}
          <Link href="/confinement-food/">confinement meal delivery</Link>. See the <Link href="/costs/">cost guide</Link>{" "}
          for how postnatal packages compare with a full centre stay.
        </p>
      </>
    ),
    faqs: [
      {
        q: "How much is postnatal massage in Singapore?",
        a: "Expect S$90–S$180 per session, or S$450–S$800 for a five-session home-visit package. Ten-session packages that include herbal treatments, womb care and binding typically run S$900–S$1,500. Home visits usually cost slightly more than clinic appointments.",
      },
      {
        q: "When should I start postnatal massage?",
        a: "Most therapists start around 5–7 days after a vaginal delivery, and 3–4 weeks after a caesarean once the wound has healed. Check with your doctor first, particularly after a C-section, and tell your therapist about any complications during delivery.",
      },
      {
        q: "What is the difference between jamu and TCM postnatal massage?",
        a: "Jamu is the Malay-Indonesian tradition using herbal oils, a warm stone compress and the bengkung cloth binding. TCM-based treatment uses ginger or herbal oils with meridian work and often pairs with herbal drinks. Both aim to reduce swelling and support recovery.",
      },
    ],
    posts: ["how-long-is-confinement-period", "is-confinement-after-birth-necessary"],
  },
  "Confinement Food": {
    h1: "Confinement Food Delivery in Singapore",
    title: "Confinement Food Delivery Singapore — Compare {year}",
    desc: "Compare {n} confinement food delivery providers in Singapore. Typical cost S$800–S$1,500 for 28 days of daily meals.",
    intro: (
      <>
        <p>
          Confinement food is the warming, nourishing diet traditionally eaten in the weeks after birth — sesame
          oil chicken, fish and papaya soup, pork trotter in vinegar, red date tea — designed to restore energy,
          support milk supply and, in the traditional framing, help the body expel &quot;wind&quot; and cold.
          Ordering it in is now the default for Singapore families doing confinement at home without a nanny who
          cooks.
        </p>
        <p>
          <strong>What it costs:</strong> around{" "}
          <strong>S$800–S$1,500 for a full 28-day plan</strong> with daily lunch and dinner delivery, or roughly
          S$28–S$50 per day. Shorter 7 and 14-day plans are widely available, and most providers let you start
          with a trial day before committing.
        </p>
        <p>
          Providers differ more than you&apos;d expect: some cook strictly traditional Chinese confinement menus,
          others offer halal, Malay, Indian or lighter &quot;modern&quot; versions with less oil and ginger. If
          you have gestational diabetes, are vegetarian, or dislike heavy sesame oil, say so at enquiry — most
          kitchens will adjust. Our guide to{" "}
          <Link href="/blog/confinement-food-singapore/">what to eat and avoid during confinement</Link> explains the
          reasoning behind the menu.
        </p>
      </>
    ),
    faqs: [
      {
        q: "What is confinement food?",
        a: "Confinement food is the warming, nutrient-dense diet eaten for about a month after childbirth. Staples include sesame oil chicken, fish and papaya soup, pork trotter in black vinegar, red date tea and ginger-based dishes, chosen to rebuild strength and support breastfeeding.",
      },
      {
        q: "How much is confinement food delivery in Singapore?",
        a: "A 28-day plan with daily lunch and dinner typically costs S$800–S$1,500, or about S$28–S$50 per day. Shorter 7 and 14-day plans are available, and most providers offer a paid trial day so you can taste the food before committing.",
      },
      {
        q: "What food should I avoid during confinement?",
        a: "Traditional practice avoids cold and raw foods, iced drinks, excessive salt and, for breastfeeding mothers, alcohol and high-caffeine drinks. Some families also avoid cabbage and certain vegetables believed to cause wind. Medically, the priority is simply a balanced diet and enough fluids.",
      },
      {
        q: "Is there halal confinement food in Singapore?",
        a: "Yes — several Singapore providers cook halal confinement menus, drawing on Malay postnatal traditions with dishes built around ginger, turmeric and herbal soups. Confirm the kitchen's halal certification directly, as certification status can change.",
      },
    ],
    posts: ["confinement-food-singapore", "how-long-is-confinement-period"],
  },
};

export const REGION_INTROS: Record<string, string> = {
  Central:
    "Central Singapore has by far the densest cluster of confinement care — most of the island's dedicated confinement centres sit here, along Orchard, Novena, Newton, Toa Payoh and the Bukit Timah corridor. It's the region to start with if you want a residential centre stay, and the easiest for visiting family to reach.",
  East: "The East — Katong, Bedok, Tampines, Pasir Ris and the Geylang corridor — has a solid mix of confinement centres, nanny agencies and meal providers, and is popular with families who want to stay near the parents' home in the east rather than move Central for a month.",
  "North-East":
    "The North-East covers Serangoon, Hougang, Ang Mo Kio, Sengkang and Punggol — heavily residential, young-family territory. Provision here leans towards nanny agencies and home-visit postnatal services rather than residential centres.",
  North:
    "The North — Woodlands, Yishun, Sembawang and Upper Thomson — has fewer resident confinement centres, but it is home to several of Singapore's largest confinement meal kitchens and nanny agencies that place island-wide.",
  West: "The West covers Jurong, Clementi, Bukit Batok, Choa Chu Kang and the West Coast. There are fewer listed providers based here than in Central, but most nanny agencies and meal services deliver across the whole island, so your options are wider than the map suggests.",
};

export const COMPARE_INTRO = (
  <>
    <p>
      There is no single &ldquo;best confinement centre in Singapore&rdquo; — the right one depends on your
      region, your budget, and whether you want a hotel-like stay or a homely one. What actually helps is
      putting your shortlist side by side and seeing the differences in one view, which is what this page does.
    </p>
    <p>
      Pick up to three providers from the <Link href="/confinement-centres/">full directory</Link> using the{" "}
      <em>Add to compare</em> checkbox, and they&apos;ll appear here. Prices aren&apos;t shown because almost no
      centre publishes them — use the <Link href="/costs/">cost guide</Link> for realistic ranges, then send one
      enquiry below and let them quote you directly.
    </p>
  </>
);

export const COMPARE_FAQS: Faq[] = [
  {
    q: "What should I compare between confinement centres?",
    a: "Compare location relative to your home and hospital, what the package actually includes (meals, night care, postnatal massage sessions), room type and whether your partner can stay, the nurse-to-baby ratio, and the deposit and cancellation terms. Price alone rarely tells the full story.",
  },
  {
    q: "Which is the best confinement centre in Singapore?",
    a: "There isn't one objective best. Centres differ in region, price tier and style — some feel like serviced hotels, others like small family-run homes. Shortlist by region and budget, compare inclusions side by side, then visit the top two before committing.",
  },
  {
    q: "Can I visit a confinement centre before booking?",
    a: "Yes, and you should. Most Singapore centres offer tours by appointment, ideally in your second trimester while you're still comfortable travelling. Ask to see an actual room, the nursery and the kitchen, and ask how staffing changes overnight.",
  },
];

export const COSTS_FAQS: Faq[] = [
  {
    q: "How much is a confinement centre in Singapore?",
    a: "A 28-day stay at a standard confinement centre typically costs S$9,000–S$16,000, with premium centres at S$16,000–S$22,000 and luxury suites above S$22,000. Packages usually include accommodation, all confinement meals, 24-hour newborn care and some postnatal recovery treatments.",
  },
  {
    q: "How much is a confinement nanny in Singapore?",
    a: "Around S$3,000–S$4,500 for 28 days stay-in through an agency, including the placement fee. Daytime-only help runs S$2,200–S$3,200. Add the customary red packet of S$100–S$300, the nanny's food, and the work permit levy if she is not Singaporean.",
  },
  {
    q: "What is the cheapest confinement option in Singapore?",
    a: "Doing confinement at home with meal delivery is the cheapest structured option, at roughly S$800–S$1,500 for 28 days of food plus a postnatal massage package. A confinement nanny is the mid-tier choice, and a centre stay the most expensive.",
  },
  {
    q: "Are confinement costs claimable or subsidised in Singapore?",
    a: "No. Confinement centres, nannies and meal plans are private services and are not covered by MediSave, MediShield Life or the Baby Bonus scheme's medical components. The Baby Bonus cash gift can of course be spent on them, but there is no dedicated subsidy.",
  },
];
