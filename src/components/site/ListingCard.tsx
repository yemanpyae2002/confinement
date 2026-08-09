import Link from "next/link";
import type { Listing } from "@/lib/types";
import { tagName } from "@/lib/listings";

export function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="rating">
      <span className="star">★</span> {rating.toFixed(1)}{" "}
      <span className="cnt">({reviews.toLocaleString()} Google reviews)</span>
    </span>
  );
}

export function Photo({ l }: { l: Listing }) {
  if (l.has_photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/img/${l.slug}.jpg`}
        alt={`${l.name} — ${l.cat_label.toLowerCase()} in ${l.region}, Singapore`}
        width={640}
        height={400}
        loading="lazy"
      />
    );
  }
  return (
    <div className="ph" role="img" aria-label={`${l.display_name} — ${l.cat_label.toLowerCase()} in ${l.region}, Singapore`}>
      <span className="ini">{l.initials}</span>
      <span className="lbl">{l.region}</span>
    </div>
  );
}

export default function ListingCard({ l, compare = false }: { l: Listing; compare?: boolean }) {
  return (
    <article
      className="card"
      data-listing
      data-region={l.region}
      data-cat={l.cat_label}
      data-tags={l.tags.join(",")}
      data-rating={l.rating}
      data-reviews={l.reviews}
      data-name={l.name}
    >
      <div className="card-media" data-c={l.cat_label}>
        <Photo l={l} />
      </div>
      <div className="card-body">
        <div className="badges">
          <span className="badge badge-region">{l.region}</span>
          <span className="badge badge-cat">{l.cat_label}</span>
        </div>
        <h3>
          <Link href={l.url}>{l.display_name}</Link>
        </h3>
        <Stars rating={l.rating} reviews={l.reviews} />
        <p className="teaser">{l.teaser}</p>
        {compare && (
          <label className="cmp">
            <input type="checkbox" data-cmp value={l.slug} data-name={l.display_name} /> Add to compare
          </label>
        )}
        <div className="card-actions">
          <Link className="btn btn-sm btn-ghost" href={l.url}>
            View details
          </Link>
          <Link className="btn btn-sm" href={`${l.url}#enquire`}>
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TagBadges({ tags }: { tags: string[] }) {
  return (
    <>
      {tags.map((t) => (
        <span className="badge badge-tag" key={t}>
          {tagName(t)}
        </span>
      ))}
    </>
  );
}
