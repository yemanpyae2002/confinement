"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/confinement-centres/", label: "Find a Centre", key: "centres" },
  { href: "/nanny-agencies/", label: "Nanny Agencies", key: "nanny" },
  { href: "/postnatal-services/", label: "Postnatal", key: "postnatal" },
  { href: "/confinement-food/", label: "Food", key: "food" },
  { href: "/costs/", label: "Costs", key: "costs" },
  { href: "/blog/", label: "Blog", key: "blog" },
];

export default function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap hdr">
        <Link className="logo" href="/">
          ConfinementFinder<span className="sg">SG</span>
        </Link>
        <button
          className="burger"
          aria-expanded={open}
          aria-controls="nav"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <nav className={`nav${open ? " open" : ""}`} id="nav" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.key} href={l.href} aria-current={active === l.key ? "page" : undefined} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link className="nav-cta" href="/list-your-business/" onClick={() => setOpen(false)}>
            For Businesses
          </Link>
        </nav>
      </div>
    </header>
  );
}
