import Link from "next/link";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { REGIONS, slugifyRegion, YEAR } from "@/lib/listings";
import { getAllPosts } from "@/lib/posts";

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/ConfinementFinderSG/", label: "Facebook", Icon: Facebook },
  { href: "https://www.instagram.com/confinementfinder/", label: "Instagram", Icon: Instagram },
  { href: "https://www.youtube.com/@confinementfinderSG", label: "YouTube", Icon: Youtube },
  { href: "https://www.linkedin.com/company/confinement-finder-sg/", label: "LinkedIn", Icon: Linkedin },
];

export default function Footer() {
  const footerPosts = getAllPosts()
    .slice(0, 4)
    .map((p) => ({ url: p.url, short: p.title.length > 35 ? `${p.title.slice(0, 34)}…` : p.title }));

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <span className="flogo">
              ConfinementFinder<span className="sg">SG</span>
            </span>
            <p className="ftag">
              Rest well. Start well. Singapore’s most comprehensive guide to confinement centres, nannies and
              postnatal care.
            </p>
            <Link className="btn btn-sm btn-rose" href="/#get-matched">
              Get matched free
            </Link>
            <div className="fsocial">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${label}`}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>By region</h4>
            <ul>
              {REGIONS.map((r) => (
                <li key={r}>
                  <Link href={`/confinement-centres/${slugifyRegion(r)}/`}>{r}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>By need</h4>
            <ul>
              <li>
                <Link href="/confinement-centres/">Confinement centres</Link>
              </li>
              <li>
                <Link href="/nanny-agencies/">Confinement nannies</Link>
              </li>
              <li>
                <Link href="/postnatal-services/">Postnatal services</Link>
              </li>
              <li>
                <Link href="/confinement-food/">Confinement food</Link>
              </li>
              <li>
                <Link href="/compare/">Compare centres</Link>
              </li>
              <li>
                <Link href="/costs/">Prices &amp; costs</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Guides &amp; info</h4>
            <ul>
              {footerPosts.map((p) => (
                <li key={p.url}>
                  <Link href={p.url}>{p.short}</Link>
                </li>
              ))}
              <li>
                <Link href="/about/">About us</Link>
              </li>
              <li>
                <Link href="/contact/">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="fbar">
          <span>© {YEAR} ConfinementFinderSG. Made in Singapore.</span>
          <span>
            <Link href="/privacy/">Privacy</Link> · <Link href="/list-your-business/">List your business</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
