import type { Faq } from "@/lib/types";

export default function FaqBlock({ items }: { items?: Faq[] }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <h2>Frequently asked questions</h2>
      <div className="faq">
        {items.map((q, i) => (
          <details key={q.q} open={i === 0}>
            <summary>{q.q}</summary>
            <p>{q.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
