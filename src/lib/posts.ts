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
  "confinement-food-singapore",
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
