# ConfinementFinderSG — Project Context

Reference document for briefing an assistant on marketing, SEO and content work.
Everything below was verified against the live site and the repository on
**9 August 2026**. Figures marked *(generated)* are computed at build time from
`src/data/listings.json` and will change as listings are added or removed.

---

## 1. What the site is

An independent directory of confinement care in Singapore. It helps a woman in
her third trimester shortlist and enquire with providers, and it publishes
honest price guidance the providers themselves mostly hide.

- **Domain:** https://confinementfindersg.com (apex; `www` 301s to it)
- **Market:** Singapore only. English, `en-SG`.
- **Status:** Live and open to search engines as of 9 Aug 2026.
- **Audience:** Expecting mothers, typically 3rd trimester, and their partners
  or parents who often do the research and the paying.

### The four provider types — do not conflate these

| Type | What it is | Count *(generated)* |
|---|---|---|
| Confinement Centre | A residential serviced stay, usually 28 days | 12 |
| Nanny Agency | Places an individual nanny in your own home | 18 |
| Postnatal Services | Massage, lactation and recovery therapists | 18 |
| Confinement Food | Meal delivery only | 9 |

**57 listings total.** Note the shape of this: the site is named for confinement
*centres* and that is the head keyword, but centres are the *smallest*
category. Nanny agencies and postnatal services each outnumber them.

---

## 2. Positioning and voice

The site's credibility rests on being visibly non-promotional. This is a
commercial differentiator, not just an ethical stance — every competitor is a
thinly disguised ad.

**Do:**
- Lead with the direct answer, then depth. Readers are anxious and time-poor.
- Use real S$ figures. Numbers earn clicks and trust.
- Be inclusive of Chinese, Malay and Indian confinement practices. They differ
  materially and all exist in Singapore.
- Say "centre", never "center", in anything user-facing.
- Acknowledge trade-offs honestly, including when the site can't help.

**Do not:**
- Rank providers as "best". The site explicitly refuses to. Suitability depends
  on budget, region and the kind of care wanted.
- Imply ratings are the site's own. They are Google's, displayed for reference.
- Invent prices, statistics or provider claims. If a number isn't in `/costs/`
  or the listing data, it must be researched and cited, not estimated.
- Use urgency, scarcity or fear framing. The audience is already anxious.

**Tone:** calm, expert, reassuring. Think a well-informed friend who happens to
know the market — not a salesperson and not a clinician.

---

## 3. Verified price data

These come from `/costs/` and are the **only** figures that may be quoted
without fresh research. They are indicative ranges, always to be qualified.

| Item | Range (28 days unless noted) |
|---|---|
| Confinement centre — standard | S$9,000 – S$16,000 |
| Confinement centre — premium | S$16,000 – S$22,000 |
| Confinement centre — luxury | S$22,000 – S$30,000+ |
| Centre, pro-rated daily | ~S$400 – S$650/day |
| Confinement nanny (stay-in) | S$3,000 – S$4,500 + customary red packet |
| Confinement food delivery | S$800 – S$1,500 |
| Peak surcharge (CNY, auspicious dates) | +S$300 – S$800 |

Deposits of 10–30% at booking are normal; cancellation terms vary widely.

**Dated facts that need re-checking before reuse:** nanny medical insurance
minimum was raised to S$60,000/year for policies starting on or after 1 July
2023 — confirm against MOM before citing.

---

## 4. Site structure

```
/                             Homepage — hero, quiz, region + category tiles, featured, guides
/confinement-centres/         All 57 listings, filterable (the flagship commercial page)
/confinement-centres/{region} 5 region pages: central, east, north-east, north, west
/nanny-agencies/              Category
/postnatal-services/          Category
/confinement-food/            Category
/listing/{slug}               57 individual provider pages
/costs/                       Price guide (the other priority page)
/compare/                     Side-by-side comparison of up to 3
/blog/  +  /blog/{slug}       5 published guides
/about/ /contact/ /privacy/ /list-your-business/
/sitemap.xml /robots.txt /llms.txt
```

**79 indexable pages.** Sitemap is a verified 1:1 match — no orphans, no dead
entries, all returning 200.

**Nav:** Find a Centre · Nanny Agencies · Postnatal · Food · Costs · Blog ·
For Businesses (CTA)

**Listings by region *(generated)*:** Central 28 · East 10 · North 7 ·
West 6 · North-East 6. Central dominance is real, not a data gap — that is
where Singapore's centres actually are.

---

## 5. Business model

Two revenue lines, stated openly on `/about/`:

1. **Featured placement** — providers can pay for visibility.
2. **Enquiry forwarding** — parent enquiries passed to relevant providers.

Explicitly guaranteed: paying does **not** buy a better rating, and does **not**
remove competitors. Every verified provider is listed free either way.

**This transparency is the marketing angle.** Any campaign that undermines it
damages the core asset.

### Conversion paths

- **Get Matched quiz** (homepage) — 3 questions: due month → region → type of
  help → lead form. The primary conversion route.
- **Per-listing enquiry** — on all 57 listing pages.
- **Compare flow** — shortlist up to 3, one enquiry to all.

Leads are tagged by source: `get-matched`, `listing`, `region`, `category`,
`compare`, `costs`, `all-listings`, `contact`, `business`. Handled by Web3Forms.

---

## 6. SEO position

### Keyword clusters by volume

| Cluster | Vol/mo | Difficulty | Coverage |
|---|---|---|---|
| Confinement Centre (core) | 3,200 | KD 13 head term | Strong |
| **Postnatal Services** | **1,800** | **KD 2 — easiest** | **Category page only** |
| Nanny Agency | 1,690 | KD 31–53 | 1 post |
| Confinement Food | 1,440 | KD 15–39 | 1 post |

**Head term:** `confinement centre singapore` — 1,300/mo, KD 13. Ranking pages
have Domain Rating 1–14, so a new site can compete.

**Biggest open opportunity:** postnatal massage. 1,800/mo at KD 2 — the lowest
difficulty on the board — and there is no blog content on it at all.

**Known dead end:** location+centre combinations (`...newton`, `...sentosa`)
return 0 volume. Region pages exist for UX and internal linking, not traffic.

### Technical state

All verified, not assumed:

- Every page: unique title ≤60 chars, meta description 140–155, single H1,
  self-referencing canonical, explicit `index, follow`.
- `googlebot` directive lifts snippet/preview truncation.
- Schema: `LocalBusiness`/`FoodEstablishment` on all 57 listings,
  `BreadcrumbList` sitewide, `ItemList` on directories, `FAQPage` on 11 pages,
  `Article` on posts, `WebSite` + `Organization` on the homepage.
- **No `aggregateRating` anywhere, deliberately.** Ratings are Google's;
  marking up third-party ratings violates Google's guidelines and risks a
  manual action. Do not "fix" this.
- `/llms.txt` published per llmstxt.org.
- 376 images, all with alt text and explicit dimensions.
- `robots.txt` allows all, disallows `/*?` (only `/compare/?ids=` exists).

### Content rules

Per post: 1,200–1,800 words · direct answer in first 40–60 words · H2s phrased
as real question-keywords · one table where it helps · FAQ block with FAQPage
schema · 2–4 internal links · 1–2 authoritative citations (MOM, HealthHub, KKH)
· CTA to the most relevant category or the quiz.

**Cannibalisation guard:** commercial keywords belong to `/costs/`,
`/confinement-centres/` and the category pages. The blog takes informational
questions and links *to* them. Check before writing.

### Published guides

| Post | Category | Words |
|---|---|---|
| Is Confinement After Birth Necessary? | Recovery & traditions | 1,455 |
| How Long Is the Confinement Period? | Recovery & traditions | 1,248 |
| What Is a Confinement Nanny — and How Much? | Choosing care | 1,406 |
| Confinement Centre vs Nanny vs DIY | Choosing care | 1,600 |
| Confinement Food in Singapore | Confinement food | 1,551 |

Planned but unwritten: MOM work permit guide · red date tea · herbal baths ·
confinement gifts · Korean-style centres · luxury vs budget · husband staying
over · what to do during confinement.

---

## 7. Brand

| Token | Hex | Use |
|---|---|---|
| Sage | `#7BAE8A` | Primary — buttons, links, accents |
| Sage dark | `#5F9370` | Link text, hover |
| Sage light | `#E8F1EB` | Backgrounds, badges |
| Cream | `#FAF7F2` | Page background |
| Rose | `#D4A5A5` | Secondary accent |
| Charcoal | `#2D2D2D` | Body text |
| Taupe | `#B8A99A` | Muted text |

**Type:** Poppins (400/500/600). **Feel:** spa and wellness clinic — calm,
uncluttered, generous whitespace. Rounded corners (14px cards, pill buttons).
Not clinical, not cutesy, no pastel baby imagery.

**Logo:** `ConfinementFinder` + `SG` in rose. Social card at
`/img/og-default.png` (1200×630).

**Imagery reality:** there are no venue photos. 48 of 57 listings show the
business's own logo; 9 show an initials placeholder. The scraped Google photos
expired (HTTP 403) and re-hosting them carries copyright risk. Do not promise
photo-rich listings in marketing.

---

## 8. Data notes and gotchas

- **Ratings 3.0–5.0, 24,733 reviews total** across 57 listings *(generated)*.
- **Feature tags are sparse:** wheelchair-accessible 22, 24-hour 8,
  halal-friendly 1. Do not market filtering as a strength — the data is thin.
  The single halal tag is on a *nanny agency* (Ratu Confinement), **not on any
  food listing**, so never claim halal meal filtering. Muslim and Malay
  confinement is a genuine underserved angle here, but it needs real data
  before it can be marketed.
- **`area` values are unreliable** — often street names ("Playfair", "Quality",
  "Tham Soong"), not neighbourhoods. Use the curated `REGION_AREAS` map in
  `src/lib/content.tsx` for anything user-facing.
- **Largest providers by reviews:** PEM Confinement Nanny Agency (4.9, 6,556),
  Postnatal Massage Singapore (4.9, 2,832), Confinement Angels (4.8, 1,992),
  Tian Wei Signature (4.7, 1,628), STAR Confinement (4.9, 1,425).

---

## 9. Open items

Not yet done, roughly in priority order:

1. **No analytics.** Nothing is being measured — no traffic, conversion or
   keyword data. Recommended: Cloudflare Web Analytics (cookieless, no consent
   banner needed). Never default-inject GA.
2. **Google Search Console** — needs domain verification and sitemap
   submission. Indexing will be slow without it.
3. **Postnatal massage content** — the 1,800/mo KD 2 gap.
4. **9 listings have only ~2 inbound internal links** vs 80 for money pages.
5. **No security headers** (HSTS, X-Content-Type-Options, Referrer-Policy).
6. Blog frontmatter for the nanny post promises "2026 price ranges" but the
   body cites no 2026 figures — will read as stale in January.

---

## 10. Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 3 + hand-written CSS
in `globals.css` · Markdown content via gray-matter · hosted on Hostinger
(Node, behind their CDN) · `trailingSlash: true` throughout.

Listing data lives in `src/data/listings.json` and drives counts, schema,
sitemap and `/llms.txt` — nothing is hardcoded.
