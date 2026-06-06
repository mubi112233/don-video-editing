import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingDynamic } from "@/components/PricingDynamic";
import { ToolsIntegration } from "@/components/ToolsIntegration";
import { CaseStudies } from "@/components/CaseStudies.client";
import { Blog } from "@/components/Blog";
import { FAQInteractive } from "@/components/FAQInteractive.client";
import { FinalCTA } from "@/components/FinalCTA.server";
import { SPACING } from "@/lib/constants";

export function HomeBelowFold({ lang, initialFaqs }: { lang: string; initialFaqs?: any[] }) {
  return (
    <>
      <div className={SPACING.container}>
        <HowItWorks />
        <Services />
        <PricingDynamic lang={lang} />
        <ToolsIntegration />
        <Testimonials />
        <Blog />
        <CaseStudies lang={lang} />
        <FAQInteractive faqs={initialFaqs ?? []} lang={lang} />
      </div>
      <FinalCTA lang={lang} />
    </>
  );
}
