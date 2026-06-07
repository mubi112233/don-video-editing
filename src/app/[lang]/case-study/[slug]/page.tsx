import { Navbar } from "@/components/Navbar";
import CaseStudyDetailClient from "./CaseStudyDetailClient";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === "de" || rawLang === "ge" ? "ge" : "en";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CaseStudyDetailClient slug={slug} lang={lang} />
    </div>
  );
}
