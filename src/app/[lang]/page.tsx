import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { HomeBelowFold } from "@/components/HomeBelowFold.hybrid";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchApiData, API_ENDPOINTS, normalizeLanguage, fetchFAQ, type HeroData } from "@/lib/api";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { SITE_URL, absoluteUrl, hreflangAlternates, publicLocalePathSegment } from "@/lib/site-url";

export const revalidate = 60;

const SUPPORTED_LANGS = ['en', 'ge', 'de'];

async function getHeroMeta(lang: string) {
  try {
    const data = await fetchApiData<{ hero: any | any[] }>(API_ENDPOINTS.HERO, normalizeLanguage(lang));
    if (!data?.hero) return null;

    // Handle array response (multiple heroes)
    if (Array.isArray(data.hero)) {
      // Prefer hero with metaTitle/metaDescription for SEO, then fall back to newest
      const withMeta = data.hero.find((h: any) => h.metaTitle || h.metaDescription);
      if (withMeta) {
        console.log(`[getHeroMeta] Found hero with SEO meta:`, withMeta._id);
        return withMeta;
      }
      // Sort by _id (newest first - MongoDB ObjectId contains timestamp)
      const sorted = data.hero.sort((a: any, b: any) => {
        const idA = a._id || '';
        const idB = b._id || '';
        return idB.localeCompare(idA);
      });
      console.log(`[getHeroMeta] Found ${sorted.length} heroes, using newest:`, sorted[0]?._id);
      return sorted[0] || null;
    }

    return data.hero;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'de' || rawLang === 'ge' ? 'ge' : 'en';
  const hero = await getHeroMeta(lang);
  console.log("[generateMetadata] hero data:", JSON.stringify({ metaTitle: hero?.metaTitle, metaDescription: hero?.metaDescription, metaKeywords: hero?.metaKeywords, title: hero?.title, _id: hero?._id }));

  const title =
    hero?.metaTitle ||
    (lang === "ge"
      ? "don-video-editing – Premium Video Editing Agentur"
      : "don-video-editing – Premium Video Editing Services");
  const description =
    hero?.metaDescription ||
    (lang === "ge"
      ? "Professionelle Videobearbeitung mit Fokus auf Qualität und Storytelling. Von der Rohfassung bis zum fertigen Video – alles individuell auf Ihre Marke zugeschnitten."
      : "Professional video editing services. High-quality cuts, color grading, motion graphics, and post-production. Fast turnaround, guaranteed satisfaction.");
  const keywordsFromHero = hero?.metaKeywords
    ? hero.metaKeywords.split(",").map((k: string) => k.trim())
    : null;
  const defaultDeKeywords = [
    "Video Editing Agentur",
    "Videobearbeitung",
    "Post-Produktion",
    "Farbkorrektur",
    "Motion Graphics",
    "Social Media Video",
    "Corporate Video",
    "YouTube Video Editing",
    "Video Content",
    "don-video-editing",
  ];
  const defaultEnKeywords = [
    "video editing agency",
    "professional video editing",
    "post-production",
    "color grading",
    "motion graphics",
    "social media video editing",
    "corporate video editing",
    "youtube video editing",
    "video content creation",
    "don-video-editing",
  ];
  const keywords = keywordsFromHero ?? (lang === "ge" ? defaultDeKeywords : defaultEnKeywords);
  const pathSeg = publicLocalePathSegment(lang);
  const canonical = absoluteUrl(`/${pathSeg}`);
  const { languages } = hreflangAlternates("");

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "don-video",
      locale: lang === "ge" ? "de_DE" : "en_US",
      alternateLocale: lang === "ge" ? "en_US" : "de_DE",
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: lang === "ge" ? "don-video-editing — Premium Video Editing Agentur" : "don-video-editing — Premium Video Editing Services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

const pageJsonLd = (baseUrl: string) => ({
  en: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "don-video-editing — Premium Video Editing Services",
    provider: { "@type": "Organization", name: "don-video-editing" },
    description:
      "Professional video editing services. High-quality cuts, color grading, motion graphics, and post-production. Fast turnaround, guaranteed satisfaction.",
    areaServed: [
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "Switzerland" },
      { "@type": "Place", name: "Worldwide" },
    ],
    availableLanguage: ["English", "German"],
    url: `${baseUrl}/en`,
    inLanguage: "en-US",
  },
  ge: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "don-video-editing — Premium Video Editing Services",
    provider: { "@type": "Organization", name: "don-video-editing" },
    description:
      "Professionelle Videobearbeitungsservices. Hochwertige Schnitte, Farbkorrektur, Motion Graphics und Post-Produktion. Schnelle Lieferung, garantierte Zufriedenheit.",
    areaServed: [
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "Switzerland" },
      { "@type": "Place", name: "Worldwide" },
    ],
    availableLanguage: ["Deutsch", "Englisch"],
    url: `${baseUrl}/de`,
    inLanguage: "de-DE",
  },
});

export default async function HomeLangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLangValue } = await params;
  const rawLang = rawLangValue?.toLowerCase();

  if (!SUPPORTED_LANGS.includes(rawLang)) {
    notFound();
  }

  const lang = rawLang === 'de' || rawLang === 'ge' ? 'ge' : 'en';
  const jsonLd = pageJsonLd(SITE_URL)[lang];

  // Fetch hero + FAQ in parallel server-side
  const [heroApiData, faqApiData] = await Promise.all([
    fetchApiData<{ hero: HeroData | HeroData[] }>(API_ENDPOINTS.HERO, normalizeLanguage(lang)),
    fetchFAQ(lang),
  ]);

  let initialHero: HeroData | null = null;
  if (heroApiData?.hero) {
    if (Array.isArray(heroApiData.hero)) {
      const sorted = [...heroApiData.hero].sort((a, b) => (b._id || '').localeCompare(a._id || ''));
      initialHero = sorted[0] || null;
    } else {
      initialHero = heroApiData.hero;
    }
  }

  const faqs = faqApiData?.faqs?.slice(0, 10) || [];
  const faqSchema = faqs.length > 0
    ? generateFAQSchema(faqs.map((f: any) => ({ question: f.question, answer: f.answer })))
    : null;

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: lang === 'ge' ? 'Startseite' : 'Home', href: `/${lang}` },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Navbar />
      <main id="main-content" className="overflow-x-hidden">
        <Hero initialData={initialHero} />
        <HomeBelowFold lang={lang} initialFaqs={faqApiData?.faqs || []} />
      </main>
    </div>
  );
}
