"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BlogPostClient from "./BlogPostClient";
import { fetchBlog } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  _id?: string;
  blogId?: number;
  id?: number;
  lang?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  slug?: string;
  order?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

function findPost(posts: BlogPost[], slug: string): BlogPost | null {
  if (!posts.length) return null;

  const parts = slug.split("-");
  const trailingId = Number(parts[parts.length - 1]);
  const hasId = Number.isInteger(trailingId) && trailingId > 0;
  const titlePart = hasId ? parts.slice(0, -1).join("-") : slug;

  // 1 — match by blogId / id
  if (hasId) {
    const p = posts.find((x) => x.blogId === trailingId || x.id === trailingId);
    if (p) return p;
  }

  // 2 — exact title slug match
  for (const p of posts) {
    const ts = slugify(p.title);
    if (ts === slug || ts === titlePart) return p;
  }

  // 3 — explicit slug field
  const byField = posts.find((p) => p.slug === slug);
  if (byField) return byField;

  // 4 — starts-with title slug
  for (const p of posts) {
    if (slug.startsWith(slugify(p.title))) return p;
  }

  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlogDetailClient({
  slug,
  lang,
}: {
  slug: string;
  lang: string;
}) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);

      try {
        const data = await fetchBlog(lang);
        if (cancelled) return;

        const blogs: BlogPost[] = Array.isArray(data?.blogs)
          ? (data.blogs as BlogPost[])
          : Array.isArray((data as any)?.posts)
            ? (data as any).posts
            : [];

        console.log(`[BlogDetailClient] fetched ${blogs.length} posts for lang=${lang}, slug=${slug}`);
        console.log(`[BlogDetailClient] posts:`, blogs.map(p => `${p.blogId}:${slugify(p.title)}`).join(", "));

        const found = findPost(blogs, slug);

        if (found) {
          setPost(found);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("[BlogDetailClient] fetch error:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug, lang]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // ── Not found ──
  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find this blog post.
        </p>
        <button
          onClick={() => router.push(`/${lang}/blog`)}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  // ── Render post ──
  return <BlogPostClient post={post as any} lang={lang} />;
}
