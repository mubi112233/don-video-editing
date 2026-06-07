import { Navbar } from "@/components/Navbar";
import BlogDetailClient from "./BlogDetailClient";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === "de" || rawLang === "ge" ? "ge" : "en";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogDetailClient slug={slug} lang={lang} />
    </div>
  );
}
