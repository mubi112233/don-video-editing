/**
 * Canonical site origin for metadata, sitemap, and JSON-LD.
 * CRITICAL: This must always point to www.don-video.com in production.
 * Prevents duplicate content issues and ensures proper indexing.
 */
export const isProduction = process.env.NODE_ENV === "production";

// Force correct production domain - NEVER change this
const PRODUCTION_SITE_URL = "https://www.don-video.com";
const DEFAULT_SITE_URL = isProduction ? PRODUCTION_SITE_URL : "http://localhost:3000";

// Validate env URL - reject invalid domains to prevent indexing issues
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const isValidEnvUrl =
  envUrl &&
  !envUrl.includes("don-va.com") &&
  !envUrl.includes("don-video.com") &&
  (envUrl.includes("don-video.com") || !isProduction);

export const SITE_URL = (isValidEnvUrl ? envUrl : DEFAULT_SITE_URL) as string;

// Sanity check for production
if (isProduction && !SITE_URL.includes("don-video.com")) {
  console.error(
    `[SEO CRITICAL] SITE_URL is incorrect in production: ${SITE_URL}. Must be https://www.don-video.com`
  );
}

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


