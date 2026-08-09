#!/usr/bin/env python3
"""qa.py — pre-delivery QA checks from references/seo-specs.md."""
from __future__ import annotations
import json, re
from collections import Counter
from pathlib import Path

from build import OUT, SITE, PAGES


def run():
    files = sorted(OUT.rglob("*.html"))
    checks: list[tuple[str, bool, str]] = []
    fails: list[str] = []

    titles, descs = Counter(), Counter()
    generated = {("/" + str(f.relative_to(OUT)).replace("index.html", "")).replace("//", "/")
                 for f in files}
    generated |= {"/" + str(f.relative_to(OUT)) for f in files}

    n_h1 = n_can = n_alt = n_ld = n_form = big = 0
    broken: list[str] = []

    for f in files:
        html = f.read_text(encoding="utf-8")
        rel = "/" + str(f.relative_to(OUT)).replace("index.html", "")

        if len(re.findall(r"<h1[\s>]", html)) != 1:
            n_h1 += 1; fails.append(f"{rel}: not exactly one <h1>")

        t = re.search(r"<title>(.*?)</title>", html, re.S)
        titles[t.group(1).strip() if t else ""] += 1
        d = re.search(r'<meta name="description" content="(.*?)"', html, re.S)
        descs[d.group(1).strip() if d else ""] += 1

        if f'<link rel="canonical" href="{SITE}' not in html:
            n_can += 1; fails.append(f"{rel}: missing/invalid canonical")

        for img in re.findall(r"<img\b[^>]*>", html):
            if "alt=" not in img:
                n_alt += 1; fails.append(f"{rel}: <img> without alt")

        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
            try:
                json.loads(block)
            except Exception as e:
                n_ld += 1; fails.append(f"{rel}: invalid JSON-LD ({e})")

        needs_form = (rel == "/" or rel.startswith("/listing/") or rel == "/contact/"
                      or rel == "/list-your-business/" or re.match(r"^/confinement-centres/[a-z-]+/$", rel))
        if needs_form and "api.web3forms.com/submit" not in html:
            n_form += 1; fails.append(f"{rel}: expected a lead form, none found")

        if len(html.encode()) > 200_000:
            big += 1; fails.append(f"{rel}: HTML over 200 KB")

        for href in re.findall(r'href="(/[^"#?]*)', html):
            href = href.split("#")[0].split("?")[0]
            if not href or href.endswith((".css", ".js", ".xml", ".txt", ".svg", ".jpg", ".png", ".ico")):
                continue
            if href not in generated:
                broken.append(f"{rel} -> {href}")

    dup_t = [t for t, c in titles.items() if c > 1]
    dup_d = [d for d, c in descs.items() if c > 1]
    long_t = [p["title"] for p in PAGES if len(p["title"]) > 62]

    sm = (OUT / "sitemap.xml").read_text(encoding="utf-8")
    sm_n = sm.count("<loc>")
    page_n = len(PAGES)

    checks = [
        ("Exactly one <h1> per page", n_h1 == 0, f"{n_h1} page(s) failed"),
        ("Unique <title> sitewide", not dup_t, f"{len(dup_t)} duplicate(s): {dup_t[:3]}"),
        ("Unique meta description", not dup_d, f"{len(dup_d)} duplicate(s): {dup_d[:2]}"),
        ("Titles within ~60 chars", not long_t, f"{len(long_t)} too long: {long_t[:3]}"),
        ("Canonical on every page", n_can == 0, f"{n_can} missing"),
        ("Every <img> has alt", n_alt == 0, f"{n_alt} missing"),
        ("All JSON-LD parses", n_ld == 0, f"{n_ld} invalid"),
        ("Internal links resolve", not broken, f"{len(broken)} broken: {broken[:4]}"),
        ("Lead form on key pages", n_form == 0, f"{n_form} missing"),
        ("No page over 200 KB", big == 0, f"{big} oversized"),
        ("sitemap count == pages", sm_n == page_n, f"sitemap {sm_n} vs pages {page_n}"),
        ("robots.txt present", (OUT / "robots.txt").exists(), ""),
        ("404.html present", (OUT / "404.html").exists(), ""),
    ]

    print("\n" + "=" * 66)
    print("QA CHECKLIST")
    print("=" * 66)
    for name, ok, detail in checks:
        print(f"  {'PASS' if ok else 'FAIL'}  {name:<32} {'' if ok else detail}")
    passed = sum(1 for _, ok, _ in checks if ok)
    print("-" * 66)
    print(f"  {passed}/{len(checks)} checks passed · {len(files)} HTML pages generated")
    if fails:
        print(f"\n  First issues:")
        for x in fails[:12]:
            print(f"    - {x}")
    print("=" * 66)
    return passed == len(checks)
