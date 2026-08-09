#!/usr/bin/env python3
"""pages.py — renders every page. Imported by build.py."""
from __future__ import annotations
import json, re, shutil
from datetime import date
from pathlib import Path

import build as B
import content as C
from build import (OUT, SITE, YEAR, BUILD_DATE, BUILD_MONTH, REGIONS, CATS, CAT_URL,
                   render, ld, breadcrumb_ld, itemlist_ld, faq_ld, localbusiness_ld,
                   slugify, errors, PAGES, env)

STATIC = Path(__file__).parent / "static"
POSTS_DIR = Path(__file__).parent / "posts"


# ------------------------------------------------------------------- posts ---
def load_posts():
    import markdown, yaml
    md = markdown.Markdown(extensions=["extra", "toc", "sane_lists"])
    posts = []
    for f in sorted(POSTS_DIR.glob("*.md")):
        raw = f.read_text(encoding="utf-8")
        _, fm, body = raw.split("---", 2)
        meta = yaml.safe_load(fm)
        md.reset()
        html = md.convert(body.strip())
        # wrap tables for horizontal scroll on mobile
        html = html.replace("<table>", '<div class="tablewrap"><table class="data">').replace("</table>", "</table></div>")
        heads = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', html)
        words = len(re.sub(r"<[^>]+>", " ", html).split())
        meta.update({
            "html": html,
            "url": f"/blog/{meta['slug']}/",
            "toc": [{"id": i, "text": re.sub(r"<[^>]+>", "", t)} for i, t in heads] if words > 1200 else [],
            "reading_time": max(3, round(words / 220)),
            "words": words,
        })
        posts.append(meta)
    order = ["is-confinement-after-birth-necessary", "how-long-is-confinement-period",
             "what-is-a-confinement-nanny", "confinement-centre-vs-nanny-vs-diy",
             "confinement-food-singapore"]
    posts.sort(key=lambda p: order.index(p["slug"]) if p["slug"] in order else 99)
    for p in posts:
        p["related"] = [q for q in posts if q["slug"] != p["slug"]][:3]
    return posts


# ------------------------------------------------------------------ static ---
def copy_static():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in STATIC.iterdir():
        shutil.copy(f, OUT / f.name)
    (OUT / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        '<rect width="64" height="64" rx="14" fill="#7BAE8A"/>'
        '<text x="32" y="44" font-family="Poppins,sans-serif" font-size="34" font-weight="600" '
        'fill="#FAF7F2" text-anchor="middle">C</text></svg>', encoding="utf-8")
    # OG default card
    (OUT / "img").mkdir(exist_ok=True)
    (OUT / "img" / "og-default.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">'
        '<rect width="1200" height="630" fill="#FAF7F2"/>'
        '<circle cx="1050" cy="90" r="260" fill="#7BAE8A" opacity=".13"/>'
        '<circle cx="130" cy="560" r="200" fill="#D4A5A5" opacity=".13"/>'
        '<text x="80" y="300" font-family="Poppins,sans-serif" font-size="62" font-weight="600" fill="#2D2D2D">'
        'Find your perfect</text>'
        '<text x="80" y="380" font-family="Poppins,sans-serif" font-size="62" font-weight="600" fill="#2D2D2D">'
        'confinement centre</text>'
        '<text x="80" y="452" font-family="Poppins,sans-serif" font-size="30" fill="#7BAE8A">'
        'ConfinementFinderSG · Singapore</text></svg>', encoding="utf-8")


# ------------------------------------------------------------------- build ---
def build_all(listings, posts):
    counts = {r: sum(1 for l in listings if l["region"] == r) for r in REGIONS}
    cat_counts = {c: sum(1 for l in listings if l["cat_label"] == c) for c in CATS}
    total = len(listings)
    by_reviews = sorted(listings, key=lambda l: -l["reviews"])
    footer_posts = [{"url": p["url"], "short": p["category"]} for p in posts[:4]]
    env.globals["footer_posts"] = [
        {"url": p["url"], "short": (p["title"][:34] + "…") if len(p["title"]) > 35 else p["title"]}
        for p in posts[:4]]

    post_by_slug = {p["slug"]: p for p in posts}
    card_post = lambda p: {"url": p["url"], "title": p["title"], "excerpt": p["excerpt"],
                           "category": p["category"]}

    # ------------------------------------------------------------- home ----
    featured = []
    seen_regions = set()
    for l in by_reviews:                      # spread across regions
        if len(featured) >= 6:
            break
        if l["region"] in seen_regions and len(seen_regions) < len(REGIONS):
            continue
        featured.append(l); seen_regions.add(l["region"])
    for l in by_reviews:
        if len(featured) >= 6:
            break
        if l not in featured:
            featured.append(l)

    due = []
    d = date.today()
    for i in range(6):
        m = d.month + i
        y = d.year + (m - 1) // 12
        due.append(date(y, (m - 1) % 12 + 1, 1).strftime("%b %Y"))

    render("home.html", "/",
           title="ConfinementFinderSG — Find Your Perfect Confinement Centre",
           description=f"Compare {total} verified confinement centres, nanny agencies, postnatal services and "
                       f"meal providers in Singapore. Honest price guidance, free enquiries.",
           nav="home", total=total, region_counts=counts, featured=featured,
           due_options=due, home_posts=[card_post(p) for p in posts[:3]],
           need_cards=[{"name": "Confinement Centres", "url": "/confinement-centres/", "count": cat_counts["Confinement Centre"]},
                       {"name": "Nanny Agencies", "url": "/nanny-agencies/", "count": cat_counts["Nanny Agency"]},
                       {"name": "Postnatal Services", "url": "/postnatal-services/", "count": cat_counts["Postnatal Services"]},
                       {"name": "Confinement Food", "url": "/confinement-food/", "count": cat_counts["Confinement Food"]}],
           schema=[ld({"@context": "https://schema.org", "@type": "WebSite", "name": "ConfinementFinderSG",
                       "url": SITE + "/",
                       "description": "Singapore directory of confinement centres, nannies and postnatal care."}),
                   ld({"@context": "https://schema.org", "@type": "Organization",
                       "name": "ConfinementFinderSG", "url": SITE + "/",
                       "logo": SITE + "/img/og-default.svg", "areaServed": "SG"})])

    # --------------------------------------------------- all listings ------
    all_tags = sorted({t for l in listings for t in l["tags"]})
    render("all-listings.html", "/confinement-centres/",
           title=f"Confinement Centres in Singapore ({total} Verified) — {YEAR}",
           description=f"Browse all {total} confinement centres, nanny agencies and postnatal providers in "
                       f"Singapore. Filter by region, compare prices and reviews, enquire free.",
           nav="centres", h1=f"Confinement Centres in Singapore ({total} Verified Listings)",
           intro=C.all_listings_intro(total, counts), listings=by_reviews,
           all_tags=all_tags, faqs=C.ALL_LISTINGS_FAQS, total=total,
           schema=[breadcrumb_ld([{"name": "Confinement centres"}]),
                   itemlist_ld(by_reviews, "Confinement centres and services in Singapore"),
                   faq_ld(C.ALL_LISTINGS_FAQS)])

    # ------------------------------------------------------- regions -------
    for r in REGIONS:
        rl = [l for l in by_reviews if l["region"] == r]
        centres = [l for l in rl if l["cat_label"] == "Confinement Centre"]
        services = [l for l in rl if l["cat_label"] != "Confinement Centre"]
        thin = len(rl) <= 7
        islandwide = ([l for l in by_reviews
                       if l["region"] != r and l["cat_label"] in ("Nanny Agency", "Confinement Food")][:6]
                      if thin else [])
        areas = [l["area"] for l in rl if l["area"]][:3]
        intro = f"<p>{C.REGION_INTROS[r]}</p>"
        if areas:
            intro += f"<p>Listings here cover areas including {', '.join(dict.fromkeys(areas))}. " \
                     f"Compare what each provider offers, then send one enquiry — or read the " \
                     f"<a href=\"/costs/\">Singapore confinement cost guide</a> before you do.</p>"
        rtitle = f"Confinement Centres in {r} Singapore — Compare & Enquire"
        if len(rtitle) > 60:
            rtitle = f"Confinement Centres in {r} Singapore — Compare"
        render("region.html", f"/confinement-centres/{slugify(r)}/",
               title=rtitle,
               description=f"{len(rl)} confinement centres, nannies and postnatal services in {r} Singapore. "
                           f"Compare ratings and features, then enquire free.",
               nav="centres", region=r, h1=f"Confinement Centres & Services in {r} Singapore",
               intro=intro, centres=centres, services=services, islandwide=islandwide,
               thin=thin, region_counts=counts,
               siblings=[x for x in REGIONS if x != r],
               schema=[breadcrumb_ld([{"name": "Confinement centres", "url": "/confinement-centres/"},
                                      {"name": r}]),
                       itemlist_ld(rl, f"Confinement services in {r} Singapore")])

    # ---------------------------------------------------- categories -------
    for cat, cfg in C.CATEGORY_COPY.items():
        cl = [l for l in by_reviews if l["cat_label"] == cat]
        url = CAT_URL[cat]
        nav = {"Nanny Agency": "nanny", "Postnatal Services": "postnatal", "Confinement Food": "food"}[cat]
        render("category.html", url,
               title=cfg["title"].format(year=YEAR),
               description=cfg["desc"].format(n=len(cl)),
               nav=nav, cat_name=cat, h1=cfg["h1"], intro=cfg["intro"], listings=cl,
               faqs=cfg["faqs"],
               related_posts=[card_post(post_by_slug[s]) for s in cfg["posts"] if s in post_by_slug],
               schema=[breadcrumb_ld([{"name": cfg["h1"]}]),
                       itemlist_ld(cl, cfg["h1"]), faq_ld(cfg["faqs"])])

    # ------------------------------------------------------ listings -------
    for l in listings:
        same_region = [x for x in by_reviews if x["slug"] != l["slug"] and x["region"] == l["region"]]
        same_cat = [x for x in by_reviews if x["slug"] != l["slug"] and x["cat_label"] == l["cat_label"]]
        rel, seen = [], set()
        for x in same_region + same_cat:
            if x["slug"] not in seen:
                seen.add(x["slug"]); rel.append(x)
            if len(rel) == 3:
                break
        l["about_html"] = C_about(l)
        crumbs = [{"name": l["cat_label"], "url": l["cat_url"]},
                  {"name": l["region"], "url": f"/confinement-centres/{slugify(l['region'])}/"},
                  {"name": l["display_name"]}]
        cat_word = l["cat_label"]
        t = f"{l['display_name']} — {cat_word}, {l['region']} Singapore"
        if len(t) > 60:                              # drop " Singapore"
            t = f"{l['display_name']} — {cat_word}, {l['region']}"
        if len(t) > 60:                              # then truncate the name
            room = 60 - len(f" — {cat_word}, {l['region']}") - 1
            t = f"{l['display_name'][:max(12, room)].rstrip(' -,&')}… — {cat_word}, {l['region']}"
        desc = (f"{l['display_name']} is a {cat_word.lower()} in "
                f"{l['area'] or l['region']}, Singapore. Google rating {l['rating']:.1f} from "
                f"{l['reviews']:,} reviews. Check availability and pricing free.")[:158]
        render("listing.html", l["url"], title=t, description=desc, nav="centres",
               l=l, related=rel, crumb_items=crumbs, body_class="has-mobcta",
               og_image=f"/img/{l['slug']}.jpg" if l["has_photo"] else "/img/og-default.svg",
               schema=[localbusiness_ld(l), breadcrumb_ld(crumbs)])

    # ------------------------------------------------------- compare -------
    default_cols = [l for l in by_reviews if l["cat_label"] == "Confinement Centre"][:3]
    render("compare.html", "/compare/",
           title="Compare Confinement Centres in Singapore Side by Side",
           description="Compare Singapore confinement centres on region, rating, hours and features. "
                       "Shortlist three, send one enquiry, get quotes back directly.",
           nav="centres", h1="Compare Confinement Centres in Singapore",
           intro=C.COMPARE_INTRO, cols=default_cols, faqs=C.COMPARE_FAQS, total=total,
           schema=[breadcrumb_ld([{"name": "Compare"}]), faq_ld(C.COMPARE_FAQS)])

    # --------------------------------------------------------- costs -------
    render("page.html", "/costs/",
           title=f"Confinement Centre & Nanny Prices Singapore ({YEAR} Guide)",
           description=f"A 28-day confinement centre stay runs S$9,000–S$16,000; a nanny S$3,000–S$4,500. "
                       f"Full {YEAR} Singapore price guide with what changes the cost.",
           nav="costs", h1=f"Confinement Centre & Nanny Costs in Singapore ({YEAR} Guide)",
           body=costs_body(), faqs=C.COSTS_FAQS,
           crumb_items=[{"name": "Costs"}],
           form=env.get_template("_macros.html").module.leadform(
               subject="Costs page enquiry — ConfinementFinderSG",
               hidden={"lead_type": "costs"},
               heading="Tell us your budget, we'll shortlist for you",
               hint="Send your due date, region and budget. We'll come back with providers that genuinely fit "
                    "the number you have in mind — no upselling.",
               button="Get my free shortlist", id="costsform"),
           schema=[breadcrumb_ld([{"name": "Costs"}]), faq_ld(C.COSTS_FAQS)])

    # ---------------------------------------------------------- blog -------
    grouped = {}
    for p in posts:
        grouped.setdefault(p["category"], []).append(card_post(p))
    render("blog-index.html", "/blog/",
           title="Confinement Guides for Singapore Parents | ConfinementFinderSG",
           description="Straight answers on confinement centres, nannies, costs, food and traditions — "
                       "written for Singapore parents planning the fourth trimester.",
           nav="blog", h1="Confinement guides for Singapore parents",
           intro="<p>Practical, Singapore-specific guides on choosing confinement care, what it costs, and "
                 "what the traditions actually require. Written to answer the question first, then give you "
                 "the detail.</p>",
           grouped=list(grouped.items()),
           schema=[breadcrumb_ld([{"name": "Blog"}])])

    for p in posts:
        render("post.html", p["url"], title=p["title_tag"], description=p["description"],
               nav="blog", p=p, og_type="article",
               schema=[ld({"@context": "https://schema.org", "@type": "Article",
                           "headline": p["title"], "description": p["description"],
                           "datePublished": BUILD_DATE, "dateModified": BUILD_DATE,
                           "mainEntityOfPage": {"@type": "WebPage", "@id": SITE + p["url"]},
                           "author": {"@type": "Organization", "name": "ConfinementFinderSG Editorial Team"},
                           "publisher": {"@type": "Organization", "name": "ConfinementFinderSG",
                                         "logo": {"@type": "ImageObject",
                                                  "url": SITE + "/img/og-default.svg"}}}),
                       breadcrumb_ld([{"name": "Blog", "url": "/blog/"}, {"name": p["title"]}]),
                       *([faq_ld(p["faqs"])] if p.get("faqs") else [])])

    # ------------------------------------------------- simple pages --------
    simple_pages(total, counts)

    # ------------------------------------------------------ sitemap --------
    urls = [p["path"] for p in PAGES]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">'.replace("sitemap.org", "sitemaps.org")]
    prio = {"/": "1.0", "/confinement-centres/": "0.9", "/costs/": "0.9"}
    for u in urls:
        sm.append(f"  <url><loc>{SITE}{u}</loc><lastmod>{BUILD_DATE}</lastmod>"
                  f"<priority>{prio.get(u, '0.7')}</priority></url>")
    sm.append("</urlset>")
    (OUT / "sitemap.xml").write_text("\n".join(sm), encoding="utf-8")
    (OUT / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n", encoding="utf-8")
    return len(urls)


def C_about(l):
    from content import __dict__ as _
    return B.make_about(l)


# --------------------------------------------------------------- costs body --
def costs_body():
    return f"""
<p>A 28-day stay at a standard Singapore confinement centre costs roughly <strong>S$9,000–S$16,000</strong>.
A confinement nanny at home is about <strong>S$3,000–S$4,500</strong>. Meal delivery alone runs
<strong>S$800–S$1,500</strong>. Those three numbers explain most of the decision families make.</p>

<p class="pricenote">All figures below are indicative ranges compiled from published Singapore provider
packages and enquiry quotes. Confinement pricing is rarely listed publicly and changes often — always verify
directly with the provider before budgeting.</p>

<h2 id="centre">Confinement centre prices (28-day stay)</h2>
<div class="tablewrap"><table class="data">
<thead><tr><th>Tier</th><th>28-day package</th><th>What you typically get</th></tr></thead>
<tbody>
<tr><th scope="row">Standard</th><td>S$9,000 – S$16,000</td>
<td>Private room, all confinement meals, 24-hour nursery care, basic postnatal massage sessions</td></tr>
<tr><th scope="row">Premium</th><td>S$16,000 – S$22,000</td>
<td>Larger suite, partner can stay, more massage and lactation sessions, better room service</td></tr>
<tr><th scope="row">Luxury</th><td>S$22,000 – S$30,000+</td>
<td>Hotel-grade suite, higher staff ratio, full spa programme, premium menu, sometimes a private nurse</td></tr>
</tbody></table></div>

<p>Shorter stays are usually pro-rated at a slightly higher daily rate — expect roughly S$400–S$650 a day at a
standard centre. Deposits of 10–30% at booking are normal, and cancellation terms vary a lot, so read them
before paying. <a href="/confinement-centres/">Browse centres by region</a> or
<a href="/compare/">compare three side by side</a>.</p>

<h2 id="nanny">Confinement nanny prices (28 days)</h2>
<div class="tablewrap"><table class="data">
<thead><tr><th>Arrangement</th><th>Cost</th><th>Notes</th></tr></thead>
<tbody>
<tr><th scope="row">Stay-in via agency</th><td>S$3,000 – S$4,500</td><td>Most common. Includes agency placement fee</td></tr>
<tr><th scope="row">Stay-in, direct hire</th><td>S$2,600 – S$3,800</td><td>Cheaper; no vetting or replacement guarantee</td></tr>
<tr><th scope="row">Daytime only (~12 hrs)</th><td>S$2,200 – S$3,200</td><td>Suits families with a partner on night duty</td></tr>
<tr><th scope="row">Peak period surcharge</th><td>+S$300 – S$800</td><td>Chinese New Year and auspicious birth dates</td></tr>
</tbody></table></div>

<p><strong>Costs people forget to budget for:</strong></p>
<ul>
<li><strong>Red packet (ang bao)</strong> — customarily S$100–S$300 at the end of the placement. Effectively expected.</li>
<li><strong>Her food</strong> — she eats what she cooks; add it to the grocery bill.</li>
<li><strong>MOM levy</strong> — <strong>S$60 per month</strong> if your newborn is a Singapore citizen, <strong>S$300 per month</strong> if not.</li>
<li><strong>Medical insurance</strong> — required for a foreign nanny; the minimum coverage was raised to S$60,000 per year for policies starting on or after 1 July 2023.</li>
<li><strong>Extension rate</strong> — ask the daily rate beyond 28 days. Note the work permit caps at 16 weeks from the birth date.</li>
</ul>
<p>Rules and levy amounts change — confirm current figures on the
<a href="https://www.mom.gov.sg/passes-and-permits/work-permit-for-confinement-nanny/eligibility">Ministry of Manpower
confinement nanny work permit page</a>. More detail in our guide to
<a href="/blog/what-is-a-confinement-nanny/">what a confinement nanny does and costs</a>, or
<a href="/nanny-agencies/">browse agencies</a>.</p>

<h2 id="massage">Postnatal massage packages</h2>
<div class="tablewrap"><table class="data">
<thead><tr><th>Package</th><th>Typical price</th><th>Notes</th></tr></thead>
<tbody>
<tr><th scope="row">Single session</th><td>S$90 – S$180</td><td>Home visits cost more than clinic visits</td></tr>
<tr><th scope="row">5 sessions</th><td>S$450 – S$800</td><td>The most commonly booked package</td></tr>
<tr><th scope="row">10 sessions</th><td>S$900 – S$1,500</td><td>Often adds herbal treatments, womb care and binding</td></tr>
<tr><th scope="row">TCM / jamu premium</th><td>S$1,200 – S$2,000</td><td>With herbal baths, acupuncture or bengkung binding</td></tr>
</tbody></table></div>
<p><a href="/postnatal-services/">Compare postnatal providers →</a></p>

<h2 id="food">Confinement food delivery</h2>
<div class="tablewrap"><table class="data">
<thead><tr><th>Plan</th><th>Typical price</th><th>Per day</th></tr></thead>
<tbody>
<tr><th scope="row">Trial day</th><td>S$30 – S$60</td><td>—</td></tr>
<tr><th scope="row">7 days</th><td>S$250 – S$450</td><td>~S$36 – S$64</td></tr>
<tr><th scope="row">14 days</th><td>S$450 – S$800</td><td>~S$32 – S$57</td></tr>
<tr><th scope="row">28 days (lunch + dinner)</th><td>S$800 – S$1,500</td><td>~S$28 – S$50</td></tr>
</tbody></table></div>
<p><a href="/confinement-food/">Compare meal providers →</a> or read
<a href="/blog/confinement-food-singapore/">what confinement food actually involves</a>.</p>

<h2 id="total">What a full confinement actually costs</h2>
<div class="tablewrap"><table class="data">
<thead><tr><th>Approach</th><th>Realistic total (28 days)</th></tr></thead>
<tbody>
<tr><th scope="row">Centre stay (standard)</th><td>S$9,000 – S$16,000 — most things included</td></tr>
<tr><th scope="row">Nanny + massage package</th><td>S$3,700 – S$5,600 including red packet and levy</td></tr>
<tr><th scope="row">Meal delivery + massage</th><td>S$1,300 – S$2,300</td></tr>
<tr><th scope="row">Fully DIY, family help</th><td>S$300 – S$800 (groceries and herbs)</td></tr>
</tbody></table></div>

<h2 id="what-affects">What actually changes the price</h2>
<ul>
<li><strong>Length of stay</strong> — the biggest lever. Two weeks instead of four roughly halves it.</li>
<li><strong>Room type</strong> — at a centre, suite upgrades are the single largest add-on.</li>
<li><strong>Timing</strong> — Chinese New Year and auspicious date clusters carry surcharges and sell out first.</li>
<li><strong>Nanny experience</strong> — a nanny with 15 years and strong referrals commands the top of the range.</li>
<li><strong>Twins</strong> — expect a meaningful surcharge for both centres and nannies.</li>
<li><strong>Add-ons</strong> — extra massage sessions, lactation consults and photography are usually priced separately.</li>
</ul>

<h2 id="subsidy">Is any of this subsidised?</h2>
<p>No. Confinement centres, nannies and meal plans are private services in Singapore and are not covered by
MediSave, MediShield Life, or the medical components of the Baby Bonus scheme. The Baby Bonus cash gift can of
course be spent on them, but there is no dedicated subsidy for confinement care. Budget accordingly.</p>

<h2 id="saving">Where to save without regretting it</h2>
<p>If the budget is tight, spend it on the <strong>first two weeks</strong>. That's when you are least mobile,
most sleep-deprived and most likely to be establishing breastfeeding. A 14-day nanny plus meal delivery for the
rest of the month usually beats spreading a thin budget across 28 days.</p>
<p>The thing not to cut is help at night. Sleep deprivation is the single biggest driver of a miserable
postpartum month, and it is the hardest thing to fix retrospectively. Read our
<a href="/blog/confinement-centre-vs-nanny-vs-diy/">honest comparison of the three approaches</a> before
committing.</p>
"""


# ------------------------------------------------------------ simple pages ---
def simple_pages(total, counts):
    lf = env.get_template("_macros.html").module.leadform

    render("page.html", "/about/", title="About ConfinementFinderSG — How We Build This Directory",
           description="Who we are, how we compile and verify confinement listings, and how the site is "
                       "funded. Independent, Singapore-made, free for parents.",
           h1="About ConfinementFinderSG", crumb_items=[{"name": "About"}],
           body=f"""
<p><strong>ConfinementFinderSG is an independent directory of confinement care in Singapore.</strong> We list
{total} confinement centres, nanny agencies, postnatal therapists and meal providers, describe what each one
does in plain English, and publish honest price ranges so families can compare before they enquire.</p>
<h2 id="why">Why this exists</h2>
<p>Choosing confinement care in Singapore is unnecessarily hard. Prices are almost never published. Google Maps
gives you a pin and a star rating but no way to compare what's included. The "best confinement centre" listicles
are mostly advertorial. Meanwhile you're in your third trimester, tired, and trying to make a S$10,000 decision
with bad information.</p>
<p>We built the thing we wanted to exist: every provider in one place, filterable by region and type, with
realistic costs stated up front and one enquiry form instead of fifteen.</p>
<h2 id="how">How we compile and verify listings</h2>
<ol>
<li>We start from public business data across Singapore — name, address, contact details, opening hours and Google ratings.</li>
<li>We filter out businesses that aren't genuinely confinement-related. Gynaecology clinics, baby stores and
mis-tagged listings get removed rather than padding our numbers.</li>
<li>Each listing is assigned a region from its postal sector, and a category: confinement centre, nanny agency,
postnatal service, or confinement food.</li>
<li>We write a factual description from the provider's own listed information. <strong>We never invent services
a provider hasn't stated.</strong></li>
<li>Ratings shown are Google ratings, clearly labelled as such. We don't collect our own reviews and we don't
mark up third-party ratings as if we did.</li>
</ol>
<p>Our directory covers an estimated 70–80% of the active market. We'd rather list fewer real providers than
inflate the count with businesses that don't serve confinement mums.</p>
<h2 id="money">How the site is funded</h2>
<p>Plainly: providers can pay for a featured placement, and we pass parent enquiries to relevant providers.
That's it. To be specific about what this does and doesn't buy:</p>
<ul>
<li><strong>Paying does not buy a better rating.</strong> Ratings come from Google and we don't touch them.</li>
<li><strong>Paying does not remove competitors.</strong> Every provider we verify is listed free, whether they pay or not.</li>
<li><strong>Featured placement is labelled "Featured"</strong>, never "Best" or "Top rated".</li>
<li><strong>Enquiries go to the providers you asked about</strong>, not to the highest bidder.</li>
</ul>
<p>We're telling you this because a directory that hides its business model shouldn't be trusted with a decision
this size. If you're a provider, see <a href="/list-your-business/">list your business</a>.</p>
<h2 id="notdo">What we don't do</h2>
<p>We're a finder, not a booking platform. We don't take commission on bookings, hold deposits, or handle
contracts — you deal with the provider directly. We also don't publish user reviews, because a thin, gameable
review section is worse than none.</p>
<h2 id="wrong">Something wrong?</h2>
<p>If a listing is inaccurate, out of date, or shouldn't be here, <a href="/contact/">tell us</a> and we'll fix
it. If you own a business and want to correct or claim your listing, use the
<a href="/list-your-business/">claim form</a>.</p>
""", schema=[breadcrumb_ld([{"name": "About"}])])

    render("page.html", "/contact/", title="Contact ConfinementFinderSG",
           description="Get in touch about a listing, a correction, or help finding confinement care in Singapore.",
           h1="Contact us", crumb_items=[{"name": "Contact"}],
           body="""
<p>Questions about a listing, a correction to make, or you'd like help finding the right confinement care?
Send us a message and we'll reply within one to two working days.</p>
<p>If you own a business and want to claim or update your listing, the
<a href="/list-your-business/">list your business</a> page is faster.</p>
""",
           form=lf(subject="Contact form — ConfinementFinderSG",
                   hidden={"lead_type": "contact"}, heading="Send us a message",
                   hint="We read everything and reply to everything.",
                   button="Send message", compact=True, id="contactform"),
           schema=[breadcrumb_ld([{"name": "Contact"}])])

    render("page.html", "/list-your-business/",
           title="List Your Confinement Business — ConfinementFinderSG",
           description="Get discovered by expecting parents in Singapore. Claim your free listing or ask "
                       "about featured placement and enquiry forwarding.",
           h1="Get discovered by expecting parents", crumb_items=[{"name": "List your business"}],
           body=f"""
<p>Parents researching confinement care in Singapore land here in their second and third trimester — with a
budget, a due date and a decision to make within weeks. <strong>We send their enquiries straight to
providers.</strong></p>
<h2 id="free">Every verified listing is free</h2>
<p>If you run a confinement centre, nanny agency, postnatal service or confinement meal kitchen in Singapore,
your listing costs nothing. A standard listing includes:</p>
<ul>
<li>Your own page with description, photo, opening hours, map and contact details</li>
<li>Inclusion in region and category browsing, and in the comparison tool</li>
<li>A direct enquiry form on your page — leads come to you by email</li>
<li>A link to your website</li>
</ul>
<h2 id="featured">Featured placement</h2>
<p>Featured providers get top placement on relevant category and region pages, a highlighted card, a larger
photo presence, and priority in matched enquiries from our Get Matched flow.</p>
<p>We don't publish pricing here because it depends on category and how many enquiries we're already sending in
your area. Ask below and we'll reply with real numbers and recent enquiry volume for your category — no
obligation, and no call unless you want one.</p>
<h2 id="honest">Being straight with you</h2>
<p>Featured placement buys <em>visibility</em>. It does not change your Google rating, does not remove
competitors from the directory, and is always labelled "Featured" rather than "Best". Parents can tell when a
directory is rigged, and a directory parents don't trust is worthless to you.</p>
<h2 id="claim">Claiming an existing listing</h2>
<p>Already listed? Use the form to claim it — we'll verify you're the owner, then you can correct details, add
a description and photos, and start receiving enquiries directly.</p>
""",
           form=lf(subject="Business enquiry — ConfinementFinderSG",
                   hidden={"lead_type": "business", "listing": ""},
                   heading="Claim your listing or ask about featured placement",
                   hint="Tell us your business name and what you'd like to do. We reply within one working day.",
                   button="Send enquiry", compact=True, id="bizform"),
           schema=[breadcrumb_ld([{"name": "List your business"}])])

    render("page.html", "/privacy/", title="Privacy Policy — ConfinementFinderSG",
           description="What ConfinementFinderSG collects, how enquiries are shared with providers, and how "
                       "to request deletion. PDPA-aware, in plain English.",
           h1="Privacy policy", crumb_items=[{"name": "Privacy"}],
           body=f"""
<p class="pricenote">Last updated {BUILD_MONTH}. Written in plain English deliberately.</p>
<h2 id="collect">What we collect</h2>
<p>Only what you type into a form on this site: your name, email address, and optionally your phone number,
due month, preferred region, budget range and message. We don't require anything else, and we don't run
analytics or advertising cookies on this site.</p>
<h2 id="use">What we do with it</h2>
<p>We pass your enquiry to the provider or providers you asked about, so they can reply to you directly. That is
the entire purpose of the form. If you use the Get Matched flow, we pass it to a small number of providers that
match your stated region, budget and type of care.</p>
<p><strong>We do not sell your personal data.</strong> We do not add you to a marketing list without your asking,
and we do not share your details with providers unrelated to your enquiry.</p>
<h2 id="providers">Once a provider has your details</h2>
<p>Providers are independent businesses and become responsible for the data we pass to them under Singapore's
Personal Data Protection Act. If you want a provider to delete your details, contact them directly — and tell
us too, so we can follow up.</p>
<h2 id="processors">Who processes the data</h2>
<p>Form submissions are handled by a third-party form service, which transmits them to our email inbox. Our
website is served by a static hosting provider that keeps standard server logs, which may include IP addresses.</p>
<h2 id="keep">How long we keep it</h2>
<p>Enquiries are kept for up to 24 months so we can follow up on complaints or disputes, then deleted.</p>
<h2 id="rights">Your rights</h2>
<p>Under the PDPA you can ask what personal data we hold about you, ask us to correct it, and ask us to delete
it. Email <a href="mailto:hello@confinementfindersg.com">hello@confinementfindersg.com</a> and we'll action it
within 30 days.</p>
<h2 id="listings">Business listings</h2>
<p>Listing information — business name, address, phone, opening hours, ratings — is public business information,
not personal data. If you own a listed business and want it amended or removed,
<a href="/contact/">contact us</a> and we'll do it.</p>
""", schema=[breadcrumb_ld([{"name": "Privacy"}])])

    # 404
    html = env.get_template("page.html").render(
        path="/404.html", title="Page not found — ConfinementFinderSG",
        description="That page doesn't exist. Browse confinement centres by region instead.",
        h1="We couldn't find that page", crumb_items=[{"name": "Not found"}], schema=[],
        body="""
<p>The page you're after has moved or never existed. Try one of these instead:</p>
<ul>
<li><a href="/confinement-centres/">All confinement centres and services</a></li>
<li><a href="/costs/">What confinement costs in Singapore</a></li>
<li><a href="/nanny-agencies/">Confinement nanny agencies</a></li>
<li><a href="/confinement-food/">Confinement food delivery</a></li>
<li><a href="/blog/">Guides for Singapore parents</a></li>
</ul>
<p>Or <a href="/#get-matched">tell us what you need</a> and we'll find it for you.</p>
""")
    (OUT / "404.html").write_text(html, encoding="utf-8")
