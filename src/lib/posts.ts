import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Post, PostMeta } from "@/lib/types";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

// Launch order (matches content-plan.md priority)
const ORDER = [
  "is-confinement-after-birth-necessary",
  "how-long-is-confinement-period",
  "what-is-a-confinement-nanny",
  "confinement-centre-vs-nanny-vs-diy",
  "can-husband-stay-at-confinement-centre",
  "confinement-food-singapore",
  "confinement-herbal-bath",
];

function slugsOnDisk(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function wrapTables(html: string): string {
  return html.replace(/<table>/g, '<div class="tablewrap"><table class="data">').replace(/<\/table>/g, "</table></div>");
}

/** Read intrinsic pixel dimensions straight from a WebP header.
 *
 * Markdown gives us no way to declare a size, but shipping an <img> without
 * width/height reserves no space and shifts the layout as each one loads.
 * Reading the real numbers off disk keeps authoring to plain `![alt](src)`
 * while still emitting explicit dimensions, so CLS stays at zero.
 *
 * Deliberately dependency-free: this runs during the build, and a header parse
 * is cheaper and more predictable than pulling in an image library.
 * Returns null for anything unrecognised, which downgrades gracefully. */
function webpSize(file: string): { w: number; h: number } | null {
  let buf: Buffer;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return null;
  }
  if (buf.length < 30 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  const chunk = buf.toString("ascii", 12, 16);
  // Extended format: 24-bit canvas dimensions, stored minus one.
  if (chunk === "VP8X") {
    return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
  }
  // Lossless: 14 bits each, packed into 4 bytes after the 0x2f signature.
  if (chunk === "VP8L" && buf[20] === 0x2f) {
    const bits = buf.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  // Lossy: dimensions follow the 3-byte sync code 0x9d 0x01 0x2a.
  if (chunk === "VP8 " && buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

/** Give markdown images the attributes the rest of the site already sets by
 * hand: explicit dimensions, lazy loading, async decoding. A standalone image
 * arrives from remark wrapped in its own <p>; promote that to a <figure> so it
 * is semantically a figure rather than a paragraph, and turn the optional
 * markdown title — `![alt](src "caption")` — into a real <figcaption>. */
function enhanceImages(html: string): string {
  const withAttrs = html.replace(/<img([^>]*?)src="([^"]+)"([^>]*?)\/?>/g, (m, pre, src, post) => {
    if (/\bwidth=/.test(m) || !src.startsWith("/")) return m;
    const dim = webpSize(path.join(process.cwd(), "public", src));
    const size = dim ? ` width="${dim.w}" height="${dim.h}"` : "";
    return `<img${pre}src="${src}"${post}${size} loading="lazy" decoding="async">`;
  });

  return withAttrs.replace(/<p>(<img[^>]*>)<\/p>/g, (_m, img: string) => {
    const title = /title="([^"]*)"/.exec(img);
    const caption = title ? `<figcaption>${title[1]}</figcaption>` : "";
    return `<figure>${img.replace(/\s*title="[^"]*"/, "")}${caption}</figure>`;
  });
}

function extractToc(html: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  const re = /<h2 id="([^"]+)">(.*?)<\/h2>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, "") });
  }
  return out;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function addHeadingIds(html: string): string {
  return html.replace(/<h2>(.*?)<\/h2>/g, (_m, inner) => {
    const id = slugify(inner.replace(/<[^>]+>/g, ""));
    return `<h2 id="${id}">${inner}</h2>`;
  });
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  const slugs = slugsOnDisk();
  const posts: Post[] = slugs.map((slug) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf-8");
    const { data, content } = matter(raw);
    const processed = remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).processSync(content);
    let html = wrapTables(String(processed));
    html = addHeadingIds(html);
    html = enhanceImages(html);
    const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    const meta = data as PostMeta;
    return {
      ...meta,
      html,
      url: `/blog/${meta.slug}/`,
      toc: words > 1200 ? extractToc(html) : [],
      reading_time: Math.max(3, Math.round(words / 220)),
      words,
    };
  });

  posts.sort((a, b) => {
    const ai = ORDER.indexOf(a.slug);
    const bi = ORDER.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function relatedPosts(p: Post, n = 3): Post[] {
  return getAllPosts()
    .filter((q) => q.slug !== p.slug)
    .slice(0, n);
}

export function cardPost(p: PostMeta & { url?: string; excerpt: string }) {
  return { url: p.url ?? `/blog/${p.slug}/`, title: p.title, excerpt: p.excerpt, category: p.category };
}
