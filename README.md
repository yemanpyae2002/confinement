# ConfinementFinderSG.com

A Next.js (App Router) directory of confinement centres, nanny agencies, postnatal services and
confinement food providers in Singapore. 84 statically-generated pages, 57 verified listings,
5 launch blog posts.

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (or whichever port Next.js picks if 3000 is
busy — check the terminal output).

## Before you deploy: one required manual step

Lead capture is the entire business model, and it won't work until you do this.

1. Create a free account at **[web3forms.com](https://web3forms.com)** and get an access key.
2. Replace `YOUR_WEB3FORMS_KEY` in `src/components/site/LeadForm.tsx` with your real key.
3. Rebuild (`yarn build`).

Until then, every form shows *"This form isn't connected yet"* instead of silently losing leads.

## Architecture

- **Content pipeline** (`confinementfindersg/`, Python) — cleans the raw Google Maps scrape, applies
  human review decisions, and exports the final listing data. This is a *build-time data source*,
  not a runtime dependency — it's not deployed.
  - `confinementfindersg/data/listings_final.csv` → the source of truth for listings
  - `confinementfindersg/export_json.py` → writes `src/data/listings.json` for Next.js to import
  - `confinementfindersg/posts/*.md` → source blog posts, copied to `src/content/posts/`
  - See `confinementfindersg/README.md` for the full data pipeline (cleaning, overrides, QA)

- **Next.js app** (`src/`) — everything that's actually deployed:
  - `src/app/` — routes (App Router), one folder per URL
  - `src/components/site/` — Header, Footer, ListingCard, FilterGrid, LeadForm, GetMatchedQuiz, etc.
  - `src/lib/listings.ts` — reads `src/data/listings.json`, region/category helpers
  - `src/lib/posts.ts` — reads `src/content/posts/*.md` (gray-matter + remark)
  - `src/lib/schema.tsx` — JSON-LD builders (LocalBusiness, ItemList, FAQPage, BreadcrumbList, Article)
  - `src/lib/content.tsx` — editorial copy shared across category/region/compare/costs pages
  - `src/app/sitemap.ts`, `src/app/robots.ts` — generated automatically by Next.js

### Regenerating listing/post data
If the raw scrape or overrides change:
```bash
cd confinementfindersg
../.venv/bin/python apply_overrides.py   # data/listings.csv -> data/listings_final.csv
../.venv/bin/python export_json.py       # -> ../src/data/listings.json
cp posts/*.md ../src/content/posts/      # if posts changed
cd .. && yarn build
```

## Deploying

Standard Next.js static/SSG deploy — Vercel, Netlify, or `next start` on any Node host.
`next.config.ts` sets `trailingSlash: true` because every canonical URL, internal link and schema
block in this project uses folder-style URLs (`/costs/`, not `/costs`) — don't remove that setting.

### After DNS is live
1. Add the property in **Google Search Console**
2. Submit `https://confinementfindersg.com/sitemap.xml` (auto-generated at `/sitemap.xml`)
3. Request indexing for `/` and `/confinement-centres/` first — those are the money pages

## Decisions worth knowing

**Taxonomy.** Pure confinement centres are deliberately *uncategorised* — `/confinement-centres/`
owns the head term "confinement centre singapore" (1,300/mo, KD 13). Explicit categories exist only
for Nanny Agencies, Postnatal Services and Confinement Food. Tags are attributes only, never
service classification.

**No `aggregateRating` in schema.** Ratings are Google's, not collected on this site. Marking up
third-party ratings breaches Google's structured data guidelines. Stars display visually, labelled
"Google rating".

**Photos.** Most scraped photo URLs are expired signed Google CDN links (HTTP 403). Listings without
a live photo render a branded, category-coloured placeholder with initials instead of a broken image.

**Data corrections applied** (see `confinementfindersg/data/overrides.csv` for the full list with
reasons): a shopping mall with 10,000+ reviews and a duplicate entry were dropped; a gynae clinic and
a prenatal fitness centre were recategorised out of "confinement centre".

## Still open

- `confinementfindersg/data/review_flags.csv` has 27 rows worth a human pass, including one
  unresolved listing (Shan Confinement) with a mis-tagged Google category.
- Content plan Sets B, C and D (~12 more blog posts) are unwritten — see
  `.claude/references/content-plan.md`.
- Cost ranges are compiled estimates and should be verified against live provider pricing before
  launch. Titles pull the current year at build time, so a rebuild refreshes them.
