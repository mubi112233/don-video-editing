import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingDynamic } from "@/components/PricingDynamic";
import { ToolsIntegration } from "@/components/ToolsIntegration";
import { CaseStudies } from "@/components/CaseStudies.server";
import { Blog } from "@/components/Blog";
import { FAQInteractive } from "@/components/FAQInteractive.client";
import { FinalCTA } from "@/components/FinalCTA.server";
import { SPACING } from "@/lib/constants";
import { fetchFAQ, fetchApiData, API_ENDPOINTS, normalizeLanguage, type PricingResponse } from "@/lib/api";

export async function HomeBelowFold({ lang, initialFaqs }: { lang: string; initialFaqs?: any[] }) {
  const normalizedLang = normalizeLanguage(lang);

  const [blogData, servicesData, pricingData, testimonialsData, howItWorksData, faqResult] = await Promise.all([
    fetchApiData<{ blogs: any[] }>(API_ENDPOINTS.BLOGS, normalizedLang),
    fetchApiData<{ services: any[] }>(API_ENDPOINTS.SERVICES, normalizedLang),
    fetchApiData<PricingResponse>(API_ENDPOINTS.PRICING, normalizedLang),
    fetchApiData<{ testimonials: any[] }>(API_ENDPOINTS.TESTIMONIALS, normalizedLang),
    fetchApiData<{ steps: any[] }>(API_ENDPOINTS.HOW_IT_WORKS, normalizedLang),
    initialFaqs ? Promise.resolve(null) : fetchFAQ(lang),
  ]);

  const faqData = initialFaqs ?? faqResult?.faqs ?? [];

  const initialPosts = Array.isArray((blogData as any)?.blogs)
    ? [...(blogData as any).blogs].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : [];

  const initialServices = Array.isArray((servicesData as any)?.services)
    ? [...(servicesData as any).services].sort((a: any, b: any) => a.order - b.order)
    : [];

  const planOrder = ['starter', 'professional', 'enterprise'];
  const initialPlans = Array.isArray(pricingData?.plans)
    ? [...pricingData.plans].sort((a, b) => planOrder.indexOf(a.planKey) - planOrder.indexOf(b.planKey))
    : undefined;

  const initialTestimonials = Array.isArray((testimonialsData as any)?.testimonials)
    ? [...(testimonialsData as any).testimonials].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const initialSteps = Array.isArray((howItWorksData as any)?.steps)
    ? [...(howItWorksData as any).steps].sort((a: any, b: any) => (a.stepNumber || 0) - (b.stepNumber || 0))
    : [];

  return (
    <>
      <div className={SPACING.container}>
        <HowItWorks initialSteps={initialSteps} />
        <Services initialServices={initialServices} />
        <PricingDynamic lang={lang} initialPlans={initialPlans} />
        <ToolsIntegration />
        <Testimonials initialTestimonials={initialTestimonials} />
        <Blog initialPosts={initialPosts} />
        <CaseStudies lang={lang} />
        <FAQInteractive faqs={faqData} lang={lang} />
      </div>
      <FinalCTA lang={lang} />
    </>
  );
}
