"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, Users, Clock, DollarSign, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchCaseStudyCards, type CaseStudyCard } from "@/lib/api";
import { getCopy } from "@/lib/copy";
import { SPACING } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CaseStudyFull {
  id: number | string;
  caseStudyId?: number;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution?: string;
  results?: Array<{ metric: string; value: string; description: string }>;
  testimonial?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  image: string;
  stats: { costSaved: string; timeframe: string; vaCount: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

function findStudy(studies: CaseStudyFull[], slug: string): CaseStudyFull | null {
  if (!studies.length) return null;

  // Extract trailing numeric ID: "company-title-5" → 5
  const parts = slug.split("-");
  const trailingId = Number(parts[parts.length - 1]);
  const hasId = Number.isInteger(trailingId) && trailingId > 0;

  // 1 — by id / caseStudyId
  if (hasId) {
    const s = studies.find(
      (x) =>
        Number(x.id) === trailingId ||
        Number(x.caseStudyId) === trailingId
    );
    if (s) return s;
  }

  // 2 — by slugified title
  const titlePart = hasId ? parts.slice(0, -1).join("-") : slug;
  for (const s of studies) {
    const ts = slugify(s.title);
    if (ts === slug || ts === titlePart) return s;
  }

  // 3 — slug starts with title slug
  for (const s of studies) {
    if (slug.startsWith(slugify(s.title))) return s;
  }

  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CaseStudyDetailClient({
  slug,
  lang,
}: {
  slug: string;
  lang: string;
}) {
  const router = useRouter();
  const copy = getCopy(lang, "caseStudies");
  const isGe = lang === "ge";

  const [study, setStudy] = useState<CaseStudyFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);

      try {
        // fetchCaseStudyCards is the proven client-side fetch used on homepage
        const cards = await fetchCaseStudyCards(lang);

        if (cancelled) return;

        console.log(
          `[CaseStudyDetailClient] fetched ${cards.length} studies, slug=${slug}`
        );

        const found = findStudy(cards as unknown as CaseStudyFull[], slug);

        if (found) {
          setStudy(found);
        } else {
          console.log(
            "[CaseStudyDetailClient] not found. Available:",
            cards.map((c) => `${c.id}:${slugify(c.title)}`).join(", ")
          );
          setNotFound(true);
        }
      } catch (err) {
        console.error("[CaseStudyDetailClient] error:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, lang]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────────
  if (notFound || !study) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-6">
          {isGe
            ? "Diese Fallstudie wurde nicht gefunden."
            : "We couldn't find this case study."}
        </p>
        <button
          onClick={() => router.push(`/${lang}/#case-studies`)}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
        >
          {isGe ? "Zurück zu Fallstudien" : "Back to Case Studies"}
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className={SPACING.sideMargin}>
      <article className="max-w-5xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          <Link href={`/${lang}`} className="hover:text-foreground transition-colors">
            {isGe ? "Startseite" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/#case-studies`} className="hover:text-foreground transition-colors">
            {isGe ? "Fallstudien" : "Case Studies"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground truncate inline-block max-w-[150px] sm:max-w-none align-bottom">
            {study.company}
          </span>
        </nav>

        {/* Back */}
        <Link
          href={`/${lang}/#case-studies`}
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">
            {isGe ? "Zurück zu Fallstudien" : "Back to Case Studies"}
          </span>
          <span className="sm:hidden">{isGe ? "Zurück" : "Back"}</span>
        </Link>

        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-bold rounded-full">
              {study.industry}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            {study.company}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary font-semibold leading-relaxed">
            {study.title}
          </p>
        </header>

        {/* Image */}
        {study.image && (
          <figure className="mb-10 sm:mb-12">
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={study.image}
                alt={`${study.company} case study`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                priority
              />
            </div>
          </figure>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {[
            { Icon: DollarSign, value: study.stats?.costSaved, label: copy.labels?.saved ?? "Saved" },
            { Icon: Users, value: study.stats?.vaCount, label: copy.labels?.teamSize ?? "Team Size" },
            { Icon: Clock, value: study.stats?.timeframe, label: copy.labels?.timeline ?? "Timeline" },
          ].map(({ Icon, value, label }) => (
            <div
              key={label}
              className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm border border-primary/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="p-2.5 sm:p-3 bg-primary/10 rounded-full">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{value}</div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Challenge */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-3">
            <span className="w-1 h-6 sm:h-8 bg-primary rounded-full" />
            {isGe ? "Herausforderung" : "Challenge"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {study.challenge}
          </p>
        </section>

        {/* Solution */}
        {study.solution && (
          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-3">
              <span className="w-1 h-6 sm:h-8 bg-primary rounded-full" />
              {isGe ? "Lösung" : "Solution"}
            </h2>
            <div
              className="text-base sm:text-lg text-muted-foreground leading-relaxed prose prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: study.solution }}
            />
          </section>
        )}

        {/* Results */}
        {study.results && study.results.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-3">
              <span className="w-1 h-6 sm:h-8 bg-primary rounded-full" />
              {isGe ? "Ergebnisse" : "Results"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {study.results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-primary/30 hover:shadow-lg hover:scale-105 transition-all"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">{result.value}</div>
                      <div className="text-xs sm:text-sm font-semibold text-primary mb-2">{result.metric}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{result.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonial */}
        {study.testimonial && (
          <aside className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 mb-10 sm:mb-12 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-primary/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-base sm:text-lg lg:text-xl italic text-foreground leading-relaxed">
                {study.testimonial}
              </blockquote>
            </div>
            {(study.testimonialAuthor || study.testimonialRole) && (
              <div className="sm:ml-14">
                {study.testimonialAuthor && (
                  <div className="font-bold text-foreground text-base sm:text-lg">{study.testimonialAuthor}</div>
                )}
                {study.testimonialRole && (
                  <div className="text-primary font-medium text-sm sm:text-base">{study.testimonialRole}</div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border/50 text-center">
          <Link
            href={`/${lang}/#case-studies`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground text-sm sm:text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:scale-105 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">
              {isGe ? "Alle Fallstudien ansehen" : "View All Case Studies"}
            </span>
            <span className="sm:hidden">{isGe ? "Alle" : "All Studies"}</span>
          </Link>
        </footer>

      </article>
    </div>
  );
}
