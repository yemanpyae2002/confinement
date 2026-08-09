#!/usr/bin/env python3
"""export_json.py — dumps fully-computed listing data to JSON for the Next.js
app to consume directly, reusing the tested logic in build.py (region mapping,
about-text generation, hours parsing, teasers) rather than re-implementing it
in TypeScript.

Output: ../src/data/listings.json
"""
import json
from pathlib import Path

from build import load, make_about, REGIONS, CATS, CAT_URL

OUT = Path(__file__).parent.parent / "src" / "data" / "listings.json"


def main():
    listings = load()
    for l in listings:
        l["about_html"] = make_about(l)
        # drop fields not needed client-side / not JSON friendly as-is
        l.pop("photo", None)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "listings": listings,
        "regions": REGIONS,
        "cats": CATS,
        "catUrl": CAT_URL,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Wrote {len(listings)} listings -> {OUT}")


if __name__ == "__main__":
    main()
