#!/usr/bin/env python3
"""build.py — ConfinementFinderSG static site generator.

Reads data/listings_final.csv -> renders every page into site/.
Rebuild in seconds whenever the data changes:  python build.py
"""
from __future__ import annotations
import json, re, shutil, sys, html as htmllib
from datetime import date
from pathlib import Path
from urllib.parse import quote_plus

import pandas as pd
from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).parent
OUT = ROOT / "site"
SITE = "https://confinementfindersg.com"
YEAR = date.today().year
BUILD_DATE = date.today().isoformat()
BUILD_MONTH = date.today().strftime("%B %Y")

REGIONS = ["Central", "East", "North-East", "North", "West"]
CATS = ["Confinement Centre", "Nanny Agency", "Postnatal Services", "Confinement Food"]
CAT_URL = {
    "Nanny Agency": "/nanny-agencies/",
    "Postnatal Services": "/postnatal-services/",
    "Confinement Food": "/confinement-food/",
    "Confinement Centre": "/confinement-centres/",
}
TAG_NAMES = {
    "korean-style": "Korean-style", "halal-friendly": "Halal-friendly",
    "24-hour": "24-hour", "home-visit": "Home visit",
    "wheelchair-accessible": "Wheelchair access", "online-booking": "Online booking",
}
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

errors: list[str] = []


# ------------------------------------------------------------------ helpers --
def slugify(s: str) -> str:
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", str(s).lower())).strip("-")


def tagname(t: str) -> str:
    return TAG_NAMES.get(t, t.replace("-", " ").title())


def esc(s) -> str:
    return htmllib.escape(str(s), quote=True)


def clean_name(name: str) -> str:
    """Shorter human display name: drop SEO stuffing after | or - and Pte Ltd."""
    n = re.split(r"\s*[|–]\s*", str(name))[0]
    n = re.sub(r"\s*\(.*?\)\s*$", "", n)
    n = re.sub(r"\s*[-–]\s*(Best|Confinement Nanny|Lactation|Birth,).*$", "", n, flags=re.I)
    n = re.sub(r"\s*\bPte\.? Ltd\.?\b\.?", "", n, flags=re.I).strip(" -–,")
    return n or str(name)


def jparse(v):
    if isinstance(v, str) and v.strip().startswith("{"):
        try:
            return json.loads(v)
        except Exception:
            return {}
    return {}


def hours_rows(raw):
    h = jparse(raw)
    if not h:
        return [], "Not published"
    rows = []
    for d in DAYS:
        v = h.get(d) or h.get(d[:3])
        rows.append((d, ", ".join(v) if isinstance(v, list) else (v or "Closed")))
    vals = {r[1] for r in rows}
    if vals == {"Open 24 hours"}:
        summary = "Open 24 hours, daily"
    elif len(vals) == 1:
        summary = f"{rows[0][1]}, daily"
    else:
        summary = f"Mon {rows[0][1]}"
    return rows, summary


def about_bullets(raw) -> list[str]:
    """Turn the scraped `about` JSON into human highlight bullets (facts only)."""
    a = jparse(raw)
    out = []
    for section, items in a.items():
        if not isinstance(items, dict):
            continue
        trues = [k for k, v in items.items() if v is True]
        for t in trues:
            label = t.replace("_", " ").strip()
            if section.lower() in ("accessibility", "amenities", "service options",
                                   "planning", "payments", "offerings", "crowd", "children"):
                out.append(label[0].upper() + label[1:])
    seen, uniq = set(), []
    for o in out:
        k = o.lower()
        if k not in seen:
            seen.add(k)
            uniq.append(o)
    return uniq[:10]


def area_from_address(addr: str) -> str:
    """Best-effort neighbourhood name from the street line."""
    a = re.sub(r",?\s*Singapore\s*\d{6}.*$", "", str(addr)).strip()
    m = re.search(r"([A-Z][a-zA-Z']+(?:\s[A-Z][a-zA-Z']+){0,2})\s+(?:Rd|Road|Ave|Avenue|St|Street|Cres|Crescent|Dr|Drive|Link|Walk|Way|Lane|Ln|Central|Blvd)\b", a)
    return m.group(1) if m else ""


# ------------------------------------------------------------ description ----
def make_about(l: dict) -> str:
    """~150-word factual description generated only from real data."""
    name, cat, region = l["display_name"], l["cat_label"], l["region"]
    area = l["area"]
    where = f"in {area}, in Singapore’s {region} region" if area else f"in the {region} region of Singapore"
    tags = [tagname(t) for t in l["tags"]]

    if cat == "Confinement Centre":
        p1 = (f"{name} is a confinement centre located {where}. Confinement centres offer a residential stay "
              f"for the first few weeks after birth, typically bundling accommodation, confinement meals, "
              f"round-the-clock newborn care and postnatal recovery support into one package.")
        suits = ("It tends to suit parents who would rather recover in a serviced environment than manage a "
                 "nanny at home, and who value having night feeds handled by staff.")
    elif cat == "Nanny Agency":
        p1 = (f"{name} is a confinement nanny agency based {where}. Agencies match families with a trained "
              f"confinement nanny (pui yuet) who cares for mother and newborn at home — cooking confinement "
              f"meals, handling night feeds, and helping with recovery — usually for 28 days.")
        suits = ("It suits families who want one-to-one help in their own home and have a spare room, and who "
                 "prefer to stay put rather than move into a centre.")
    elif cat == "Postnatal Services":
        p1 = (f"{name} provides postnatal recovery services {where}. Providers in this category typically offer "
              f"postnatal massage, jamu or TCM-based treatments, womb care, binding and lactation support, "
              f"either at a clinic or as a home visit.")
        suits = ("It suits mums who have their confinement care sorted but want targeted recovery treatment, "
                 "or who are doing confinement at home without a nanny.")
    else:
        p1 = (f"{name} prepares and delivers confinement meals {where}. Confinement food providers cook the "
              f"nourishing, warming dishes traditionally eaten after birth — think red date tea, sesame oil "
              f"chicken, fish and papaya soups — and deliver them daily, usually on 7, 14 or 28-day plans.")
        suits = ("It suits families doing confinement at home who want the diet handled without a nanny cooking, "
                 "and anyone whose helper cannot cook confinement dishes.")

    facts = []
    if l["reviews"] >= 30:
        facts.append(f"It holds a {l['rating']:.1f}-star Google rating from {l['reviews']:,} reviews")
    if tags:
        facts.append(("and is listed with " if facts else "It is listed with ") + ", ".join(t.lower() for t in tags))
    p2 = (" ".join(facts) + ".") if facts else ""
    p3 = (f"Prices are not published publicly, which is normal for this category — packages vary with length "
          f"of stay, room type and add-ons. See our <a href=\"/costs/\">Singapore confinement cost guide</a> "
          f"for realistic ranges, then send an enquiry below for a current quote from {name}.")
    return "".join(f"<p>{x}</p>" for x in [p1, f"{suits} {p2}".strip(), p3] if x)


def make_teaser(l: dict) -> str:
    area = l["area"]
    base = {
        "Confinement Centre": "Residential confinement stay",
        "Nanny Agency": "Confinement nannies for care at home",
        "Postnatal Services": "Postnatal recovery and massage",
        "Confinement Food": "Confinement meal delivery",
    }[l["cat_label"]]
    return f"{base} {'in ' + area if area else 'in the ' + l['region']}."


# ------------------------------------------------------------------- schema --
def ld(obj) -> str:
    # `<` escaped so a stray "</script>" in data can never break out of the block.
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("<", r"\u003c")


def breadcrumb_ld(items):
    el = [{"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"}]
    for i, it in enumerate(items, start=2):
        e = {"@type": "ListItem", "position": i, "name": it["name"]}
        if it.get("url"):
            e["item"] = SITE + it["url"]
        el.append(e)
    return ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": el})


def itemlist_ld(listings, name):
    return ld({"@context": "https://schema.org", "@type": "ItemList", "name": name,
               "numberOfItems": len(listings),
               "itemListElement": [{"@type": "ListItem", "position": i, "name": l["name"],
                                    "url": SITE + l["url"]} for i, l in enumerate(listings, 1)]})


def faq_ld(faqs):
    return ld({"@context": "https://schema.org", "@type": "FAQPage",
               "mainEntity": [{"@type": "Question", "name": f["q"],
                               "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in faqs]})


def localbusiness_ld(l):
    t = "FoodEstablishment" if l["cat_label"] == "Confinement Food" else "LocalBusiness"
    o = {"@context": "https://schema.org", "@type": t, "name": l["name"],
         "url": SITE + l["url"],
         "address": {"@type": "PostalAddress", "streetAddress": l["street"] or l["address"],
                     "addressLocality": "Singapore", "postalCode": str(l["postal_code"]),
                     "addressCountry": "SG"},
         "geo": {"@type": "GeoCoordinates", "latitude": l["latitude"], "longitude": l["longitude"]},
         "areaServed": {"@type": "AdministrativeArea", "name": f"{l['region']} Region, Singapore"}}
    if l["has_photo"]:
        o["image"] = f"{SITE}/img/{l['slug']}.jpg"
    if l["phone"]:
        o["telephone"] = l["phone"]
    if l["website"]:
        o["sameAs"] = [l["website"]]
    spec = []
    for d, h in l["hours"]:
        if h in ("Closed", "Not published"):
            continue
        if h == "Open 24 hours":
            spec.append({"@type": "OpeningHoursSpecification", "dayOfWeek": d,
                         "opens": "00:00", "closes": "23:59"})
            continue
        mm = re.match(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)[-–](\d{1,2})(?::(\d{2}))?\s*(am|pm)", h, re.I)
        if mm:
            def t24(hh, mi, ap):
                hh = int(hh) % 12
                if ap.lower() == "pm":
                    hh += 12
                return f"{hh:02d}:{int(mi or 0):02d}"
            spec.append({"@type": "OpeningHoursSpecification", "dayOfWeek": d,
                         "opens": t24(mm.group(1), mm.group(2), mm.group(3)),
                         "closes": t24(mm.group(4), mm.group(5), mm.group(6))})
    if spec:
        o["openingHoursSpecification"] = spec
    # NOTE: deliberately NO aggregateRating — ratings are Google's, not ours.
    return ld(o)


# --------------------------------------------------------------- load data ---
def load() -> list[dict]:
    df = pd.read_csv(ROOT / "data" / "listings_final.csv")
    out, seen = [], set()

    def s(v) -> str:
        """NaN/None-safe string."""
        return "" if v is None or (isinstance(v, float) and pd.isna(v)) else str(v).strip()

    for _, r in df.iterrows():
        d = {k: (None if (isinstance(v, float) and pd.isna(v)) else v) for k, v in r.to_dict().items()}
        slug = slugify(d["slug"])
        if slug in seen:
            errors.append(f"duplicate slug: {slug}")
        seen.add(slug)
        cat = d.get("service_category")
        cat = cat if isinstance(cat, str) and cat.strip() in CATS else "Confinement Centre"
        tags = [t for t in s(d.get("tags")).split(",") if t]
        hours, hsum = hours_rows(d.get("working_hours"))
        name = s(d["name"])
        disp = clean_name(name)
        lat, lng = d.get("latitude"), d.get("longitude")
        if not name or not d.get("region") or lat is None or lng is None:
            errors.append(f"listing missing required field: {name or slug}")
        l = {
            "slug": slug, "name": name, "display_name": disp,
            "initials": "".join(w[0] for w in re.findall(r"[A-Za-z]+", disp)[:2]).upper() or "CF",
            "url": f"/listing/{slug}/", "cat_label": cat, "cat_url": CAT_URL[cat],
            "region": d["region"], "tags": tags, "hours": hours, "hours_summary": hsum,
            "phone": s(d.get("phone")), "website": s(d.get("website")),
            "address": s(d.get("address")), "street": s(d.get("street")),
            "postal_code": s(d.get("postal_code")).split(".")[0],
            "latitude": lat, "longitude": lng,
            "rating": float(d.get("rating") or 0), "reviews": int(d.get("reviews") or 0),
            "photo": s(d.get("photo")),
            "highlights": about_bullets(d.get("about")),
            "has_photo": False,
        }
        l["area"] = area_from_address(l["address"])
        l["map_src"] = ("https://www.google.com/maps?q=" + quote_plus(f"{name} {l['address']}")
                        + f"&ll={lat},{lng}&z=15&output=embed")
        l["teaser"] = make_teaser(l)
        out.append(l)
    return out


def fetch_photos(listings):
    """Download each listing photo once; fall back to a brand placeholder."""
    imgdir = OUT / "img"
    imgdir.mkdir(parents=True, exist_ok=True)
    cache = ROOT / ".photocache"
    cache.mkdir(exist_ok=True)
    try:
        import requests
    except ImportError:
        return
    ok = expired = 0
    for l in listings:
        dest = imgdir / f"{l['slug']}.jpg"
        cached = cache / f"{l['slug']}.jpg"
        if cached.exists() and cached.stat().st_size > 1000:
            shutil.copy(cached, dest); l["has_photo"] = True; ok += 1; continue
        if not l["photo"] or not l["photo"].startswith("http"):
            continue
        try:
            r = requests.get(l["photo"], timeout=12,
                             headers={"User-Agent": "Mozilla/5.0 ConfinementFinderSG/1.0"})
            if r.ok and len(r.content) > 1000 and "image" in r.headers.get("content-type", ""):
                cached.write_bytes(r.content); shutil.copy(cached, dest)
                l["has_photo"] = True; ok += 1
            elif r.status_code in (403, 404, 400):
                expired += 1
        except Exception:
            pass
    print(f"  photos: {ok}/{len(listings)} downloaded, {expired} expired Google CDN link(s) "
          f"-> brand placeholder used")


# ------------------------------------------------------------------- render --
env = Environment(loader=FileSystemLoader(str(ROOT / "templates")),
                  autoescape=select_autoescape(["html"]), trim_blocks=True, lstrip_blocks=True)
env.filters["slug"] = slugify
env.filters["tagname"] = tagname
env.globals.update(SITE=SITE, YEAR=YEAR, REGIONS=REGIONS, CATS=CATS,
                   BUILD_MONTH=BUILD_MONTH, BUILD_DATE=BUILD_DATE)

PAGES: list[dict] = []   # for sitemap + QA


def render(tpl: str, path: str, **ctx):
    ctx.setdefault("schema", [])
    ctx.setdefault("nav", "")
    if not ctx.get("title") or not ctx.get("description"):
        errors.append(f"missing title/description: {path}")
    html = env.get_template(tpl).render(path=path, **ctx)
    dest = OUT / (path.lstrip("/") + ("index.html" if path.endswith("/") else ""))
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding="utf-8")
    PAGES.append({"path": path, "title": ctx.get("title", ""),
                  "description": ctx.get("description", ""), "file": dest})
    return dest


# --------------------------------------------------------------------- main --
def main():
    import shutil as _sh
    if OUT.exists():
        _sh.rmtree(OUT)
    OUT.mkdir(parents=True)

    print("ConfinementFinderSG — build")
    print("-" * 46)
    listings = load()
    print(f"  loaded {len(listings)} listings")

    import pages
    pages.copy_static()
    fetch_photos(listings)
    posts = pages.load_posts()
    print(f"  loaded {len(posts)} blog posts "
          f"({sum(p['words'] for p in posts):,} words total)")

    n = pages.build_all(listings, posts)
    print(f"  rendered {n} pages -> {OUT}/")

    if errors:
        print("\n  BUILD ERRORS:")
        for e in errors[:20]:
            print(f"    - {e}")
        sys.exit(1)

    import qa
    ok = qa.run()
    sys.exit(0 if ok else 2)


if __name__ == "__main__":
    main()
