"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { REGIONS, tagName } from "@/lib/listings";
import ListingCard from "@/components/site/ListingCard";
import CompareBar from "@/components/site/CompareBar";

type SortKey = "reviews" | "rating" | "name";

export default function FilterGrid({
  listings,
  cats,
  tags,
  compare = false,
  noResultsHint = "Try removing a filter — or tell us what you need and we’ll find it for you.",
}: {
  listings: Listing[];
  cats?: string[];
  tags?: string[];
  compare?: boolean;
  noResultsHint?: string;
}) {
  const [region, setRegion] = useState("");
  const [cat, setCat] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("reviews");

  const filtered = useMemo(() => {
    let out = listings.filter((l) => {
      if (region && l.region !== region) return false;
      if (cat && l.cat_label !== cat) return false;
      if (activeTags.length && !activeTags.every((t) => l.tags.includes(t))) return false;
      return true;
    });
    out = [...out].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating || b.reviews - a.reviews;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.reviews - a.reviews;
    });
    return out;
  }, [listings, region, cat, activeTags, sort]);

  const hasFilters = !!(region || cat || activeTags.length);

  function toggleTag(t: string) {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }
  function clear() {
    setRegion("");
    setCat("");
    setActiveTags([]);
  }

  return (
    <>
      <div className="filters" role="region" aria-label="Filter listings">
        <div className="frow">
          <span className="flab">Region</span>
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              className="pill"
              aria-pressed={region === r}
              onClick={() => setRegion(region === r ? "" : r)}
            >
              {r}
            </button>
          ))}
        </div>
        {cats && cats.length > 0 && (
          <div className="frow">
            <span className="flab">Type</span>
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                className="pill"
                aria-pressed={cat === c}
                onClick={() => setCat(cat === c ? "" : c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="frow">
            <span className="flab">Features</span>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className="pill"
                aria-pressed={activeTags.includes(t)}
                onClick={() => toggleTag(t)}
              >
                {tagName(t)}
              </button>
            ))}
          </div>
        )}
        <div className="fbar-foot">
          <span className="count">
            <b>{filtered.length}</b> of {listings.length} listings shown
            {hasFilters && (
              <>
                {" "}
                <button className="linkbtn" type="button" onClick={clear}>
                  Clear filters
                </button>
              </>
            )}
          </span>
          <label>
            Sort:{" "}
            <select className="sortsel" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="reviews">Most reviewed</option>
              <option value="rating">Highest rated</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid g3">
        {filtered.map((l) => (
          <ListingCard key={l.slug} l={l} compare={compare} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results show">
          <h3>No listings match those filters</h3>
          <p>{noResultsHint}</p>
          <Link className="btn" href="/#get-matched">
            Get matched free
          </Link>
        </div>
      )}

      {compare && <CompareBar />}
    </>
  );
}
