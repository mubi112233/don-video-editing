/**
 * Canonical site origin for metadata, sitemap, and JSON-LD.
 * Real domain: https://www.don-video.com
 */
export const isProduction = process.env.NODE_ENV === "production";

const PRODUCTION_SITE_URL = "https://www.don-video.com";
const DEFAULT_SITE_URL = isProduction ? PRODUCTION_SITE_URL : "http://localhost:3000";

// Use NEXT_PUBLIC_SITE_URL if set, otherwise use default
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
export const SITE_URL = (envUrl || DEFAULT_SITE_URL) as string;

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

/** Path segment for canonical / OG URLs: `de` for German (valid hreflang), `en` for English. */
export function publicLocalePathSegment(lang: string): "en" | "de" {
  return lang === "ge" || lang === "de" ? "de" : "en";
}

/**
 * Path after locale, e.g. "" for home, "contact", "blog/post-slug"
 * (no leading slash on segments).
 */
export function hreflangAlternates(pathAfterLocale: string): {
  canonicalEn: string;
  canonicalDe: string;
  languages: Record<string, string>;
} {
  const tail = pathAfterLocale ? `/${pathAfterLocale.replace(/^\//, "")}` : "";
  return {
    canonicalEn: absoluteUrl(`/en${tail}`),
    canonicalDe: absoluteUrl(`/de${tail}`),
    languages: {
      en: absoluteUrl(`/en${tail}`),
      de: absoluteUrl(`/de${tail}`),
      "x-default": absoluteUrl(`/en${tail}`),
    },
  };
}


