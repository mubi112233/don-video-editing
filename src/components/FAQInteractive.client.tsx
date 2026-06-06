"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap } from "lucide-react";
import { getCopy } from "@/lib/copy";
import { fetchApiDataClient, API_ENDPOINTS, normalizeLanguage, type FAQItem, type FAQResponse } from "@/lib/api";

export function FAQInteractive({ faqs: initialFaqs, lang }: { faqs: FAQItem[]; lang: string }) {
  const copy = getCopy(lang, "faq");
  const [openItem, setOpenItem] = useState<string>("");
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs ?? []);

  useEffect(() => {
    // Only fetch client-side if server didn't provide data
    if (initialFaqs && initialFaqs.length > 0) return;
    fetchApiDataClient<FAQResponse>(API_ENDPOINTS.FAQ, normalizeLanguage(lang))
      .then((data) => {
        if (data?.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs.slice(0, 10));
        }
      })
      .catch(() => {/* silent — no data to show */});
  }, [lang, initialFaqs]);

  return (
    <section
      id="faq"
      className="relative py-4 sm:py-6 md:py-8 lg:py-10 z-40 overflow-hidden bg-background text-foreground"
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 shadow-[0_8px_24px_-6px_rgba(168,85,247,0.6)] border border-white/30 backdrop-blur-sm relative overflow-hidden animate-pulse"
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-50"></span>
              <span className="relative z-10">Got Questions?</span>
            </motion.span>

            <h2 className="section-heading">
              {copy.title || "Frequently Asked Questions"}
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-muted-foreground max-w-2xl mx-auto dark:text-white/90">
              {copy.description || "Everything you need to know about our services. Can't find the answer you're looking for? Reach out to our team."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Accordion
              type="single"
              collapsible
              value={openItem}
              onValueChange={setOpenItem}
              className="space-y-3 sm:space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq._id || String(faq.order)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-base sm:text-lg md:text-xl font-semibold text-foreground hover:text-primary py-5 sm:py-6 hover:no-underline transition-colors [&[data-state=open]>span>span:first-child]:bg-primary [&[data-state=open]>span>span:first-child]:text-primary-foreground">
                      <span className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold mt-0.5 transition-colors">
                          {index + 1}
                        </span>
                        <span className="flex-1">{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="p-5 sm:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border-2 border-primary/20 rounded-xl sm:rounded-2xl group hover:border-primary/40 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                    {copy.qualityCardTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{copy.qualityCardText}</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border-2 border-primary/20 rounded-xl sm:rounded-2xl group hover:border-primary/40 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                    {copy.toolsCardTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{copy.toolsCardText}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-10 md:mt-12 p-6 sm:p-8 bg-card border-2 border-primary/20 rounded-xl sm:rounded-2xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground pr-4">
              {copy.stillHaveQuestionsTitle}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5">
              {copy.stillHaveQuestionsText}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105"
              >
                {copy.contactSupport}
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-primary/30 text-foreground font-semibold rounded-xl hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                {copy.viewPricing}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


