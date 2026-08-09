# ConfinementFinderSG.com

Static site generator for the Singapore confinement centre directory.
**80 pages, 57 verified listings, 5 launch blog posts.** No frameworks in the deployed output —
just HTML, one CSS file and one JS file.

---

## Before you deploy: one required manual step

Lead capture is the entire business model, and it will not work until you do this.

1. Create a free account at **[web3forms.com](https://web3forms.com)** and get an access key.
2. Find and replace `YOUR_WEB3FORMS_KEY` across the built site:

```bash
grep -rl 'YOUR_WEB3FORMS_KEY' site/ | xargs sed -i '' 's/YOUR_WEB3FORMS_KEY/your-real-key-here/g'
```

Better: put the key in `templates/_macros.html` (the `access_key` hidden input) and rebuild,
so it survives future rebuilds.

Until this is done, every form shows *"This form isn't connected yet"* rather than silently
losing leads.

---

## Deploying

The `site/` folder is deploy-ready for any static host.

**Cloudflare Pages** (recommended — free, fast in Singapore)
1. Go to Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets
2. Drag the `site/` folder in
3. Add your custom domain `confinementfindersg.com` under Custom domains

**Netlify** — drag `site/` onto [app.netlify.com/drop](https://app.netlify.com/drop).

`404.html` is picked up automatically by both.

### After DNS is live
1. Add the property in **Google Search Console**
2. Submit `https://confinementfindersg.com/sitemap.xml`
3. Request indexing for `/` and `/confinement-centres/` first — those are the money pages

---

## Rebuilding

```bash
python3 -m venv .venv
.venv/bin/pip install pandas openpyxl jinja2 requests markdown pyyaml

# 1. clean the raw scrape        -> data/listings.csv + data/review_flags.csv
.venv/bin/python ../.claude/scripts/clean_listings.py ../.claude/assets/Confinement_Centers.xlsx --outdir data

# 2. apply human review decisions -> data/listings_final.csv
.venv/bin/python apply_overrides.py

# 3. build the site               -> site/
.venv/bin/python build.py
```

Step 3 runs the QA checklist automatically and exits non-zero if anything fails.

### Local preview
```bash
.venv/bin/python -m http.server 8899 --directory site
```
Note: clean URLs like `/costs/` work on the real host; locally use `/costs/index.html`.

---

## Project layout

| Path | What it is |
|---|---|
| `build.py` | Data loading, schema generation, render helpers, entry point |
| `pages.py` | Every page definition and the sitemap |
| `content.py` | Editorial copy, category intros, FAQ sets |
| `qa.py` | The 13 pre-delivery checks from `seo-specs.md` |
| `apply_overrides.py` | Applies human review decisions to the cleaned data |
| `posts/*.md` | Blog posts — YAML frontmatter + markdown |
| `templates/` | Jinja2 templates |
| `static/` | `style.css` (18 KB) and `main.js` (8 KB) |
| `data/overrides.csv` | Editable record of data corrections, with reasons |
| `site/` | **Build output — this is what you deploy** |

### Adding a blog post
Drop a `.md` file in `posts/` with frontmatter matching an existing post, add its slug to the
`order` list in `pages.py`, and rebuild.

### Adding or fixing a listing
Edit `data/overrides.csv` (`drop` / `recategorise`), then re-run steps 2 and 3.

---

## Decisions worth knowing

**Taxonomy.** Pure confinement centres are deliberately *uncategorised* — `/confinement-centres/`
owns the head term "confinement centre singapore" (1,300/mo, KD 13). Explicit categories exist only
for Nanny Agencies, Postnatal Services and Confinement Food. Tags are attributes only, never
service classification.

**No `aggregateRating` in schema.** Ratings are Google's, not collected on this site. Marking up
third-party ratings breaches Google's structured data guidelines and risks a manual action that
would take the whole domain down. Stars are displayed visually and labelled "Google rating".

**Photos.** 55 of 57 scraped photo URLs are expired signed Google CDN links returning HTTP 403 —
the exact failure `seo-specs.md` anticipated. The build falls back to branded, category-coloured
placeholders with the business initials. To fix properly, source photos from each provider (a good
reason to contact them — and an upsell hook for featured listings).

**Data corrections applied.** Compass One (a shopping mall with 10,202 reviews that would have
topped the Featured section) and a duplicate Rejoy Suites entry were dropped; a gynae clinic and a
prenatal fitness centre were recategorised out of "confinement centre". All recorded with reasons
in `data/overrides.csv`.

---

## Still open

- `data/review_flags.csv` has 27 rows worth a human pass. Two flagged in `SKILL.md` remain
  unresolved: **Shan Confinement** (Google-typed "Shopping mall" — verify it is real) and
  **Thomson ParentCraft Centre** (present in the data and listed under Postnatal Services).
- Content plan Sets B, C and D (about 12 more posts) are unwritten.
- Cost ranges are compiled from published packages and should be re-verified before launch,
  then refreshed yearly — titles pull the year at build time, so a rebuild updates them.
