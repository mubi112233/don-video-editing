"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { getCopy } from "@/lib/copy";
import { SPACING } from "@/lib/constants";
import { localizedPath, siteConfig, localeUrlPrefix, type SiteLocale } from "@/lib/site-config";
import { fetchCaseStudyCards, type CaseStudyCard } from "@/lib/api";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

export function CaseStudies({ lang, initialStudies }: { lang: string; initialStudies?: CaseStudyCard[] }) {
  const pathname = usePathname();
  const currentLang = pathname.startsWith("/ge") || pathname.startsWith("/de") ? "ge" : "en";
  const effectiveLang = lang || currentLang;

  const [studies, setStudies] = useState<CaseStudyCard[]>(initialStudies ?? []);
  const [loading, setLoading] = useState(!initialStudies || initialStudies.length === 0);

  const copy = getCopy(effectiveLang, "caseStudies");
  const urlSeg = localeUrlPrefix((effectiveLang === "ge" ? "ge" : "en") as SiteLocale);

  useEffect(() => {
    if (initialStudies && initialStudies.length > 0) return;
    setLoading(true);
    fetchCaseStudyCards(effectiveLang)
      .then((data) => {
        setStudies(Array.isArray(data) ? data : []);
      })
      .catch(() => setStudies([]))
      .finally(() => setLoading(false));
  }, [effectiveLang, initialStudies]);

  if (loading) {
    return (
      <section id="case-studies" className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-background">
        <div className={`container mx-auto ${SPACING.container}`}>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!studies.length) {
    return (
      <section id="case-studies" className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-background">
        <div className={`container mx-auto ${SPACING.container}`}>
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              {effectiveLang === "ge"
                ? "Keine Fallstudien verfügbar."
                : "No case studies available."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="case-studies"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-background"
    >
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/5 rounded-full blur-[100px] md:blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/5 rounded-full blur-[100px] md:blur-[150px]" />

      <div className={`container mx-auto ${SPACING.container} relative z-10`}>
        <div className="mb-12 sm:mb-16 lg:mb-20 text-left max-w-5xl">
          <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 shadow-[0_8px_24px_-6px_rgba(168,85,247,0.6)] border border-white/30 backdrop-blur-sm relative overflow-hidden animate-pulse">
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-50"></span>
            <span className="relative z-10">{copy.badge}</span>
          </span>
          <h2
            className="section-heading"
            dangerouslySetInnerHTML={{ __html: copy.heading }}
          />
          <p className="text-base sm:text-lg md:text-xl lg:text-xl text-muted-foreground max-w-4xl leading-relaxed dark:text-white/90">
            {copy.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {studies.filter(study => study.id != null && study.title).map((study, index) => (
            <Link
              key={`case-study-${study.id}-${index}`}
              href={`/${urlSeg}/case-study/${slugify(study.title)}-${study.id}`}
              className="group bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 w-full block"
            >
              <div className="relative h-44 sm:h-52 md:h-48 lg:h-56 overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.company}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {study.industry}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground mb-2 sm:mb-3">
                  <span>{study.company}</span>
                  <span>·</span>
                  <span>{study.stats?.timeframe}</span>
                </div>

                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {study.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                  {study.challenge}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="text-primary font-semibold">{study.stats?.costSaved}</span>
                    <span>{copy.labels.saved}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-primary font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                    <span className="hidden sm:inline">{copy.labels.viewFull}</span>
                    <span className="sm:hidden">{copy.labels.viewStudy}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            {effectiveLang === "ge"
              ? "Bereit, ähnliche Ergebnisse zu erzielen?"
              : "Ready to achieve similar results?"}
          </p>
          <Link
            href={localizedPath((effectiveLang === "ge" ? "ge" : "en") as SiteLocale, siteConfig.routes.bookMeeting)}
            className="inline-block w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl shadow-purple-500/50 hover:shadow-2xl text-center border-0"
          >
            <span className="hidden sm:inline">
              {effectiveLang === "ge" ? "Kostenlose Beratung buchen" : "Book a Free Consultation"}
            </span>
            <span className="sm:hidden">{effectiveLang === "ge" ? "Jetzt starten" : "Get Started"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
