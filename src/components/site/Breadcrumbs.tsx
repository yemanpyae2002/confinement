import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {items.map((it, i) => (
          <span key={i}>
            <span>›</span>
            {it.url ? <Link href={it.url}>{it.name}</Link> : it.name}
          </span>
        ))}
      </nav>
    </div>
  );
}
