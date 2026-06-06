"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Award, Loader2, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useState, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { fetchWhyChooseUs } from "@/lib/api";
import { SPACING } from "@/lib/constants";
import { usePathname } from "next/navigation";

interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseUsData {
  badge: string;
  heading: string;
  description: string;
  items: WhyChooseUsItem[];
}

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || Award; // Fallback to Award if icon not found
};

export const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  
  const [whyChooseUsData, setWhyChooseUsData] = useState<WhyChooseUsData | null>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const currentLang = pathname.startsWith('/ge') || pathname.startsWith('/de') ? 'ge' : 'en';

  const isGe = currentLang === 'ge';

  const fallbackData: WhyChooseUsData = useMemo(() => isGe ? {
    badge: "Warum wir",
    heading: "Was uns <span class=\"text-[hsl(45,100%,60%)]\">auszeichnet</span>",
    description: "Premium Videobearbeitung, kreatives Storytelling, schnelle Lieferung und volle Zufriedenheitsgarantie.",
    items: [
      { icon: "Target", title: "Professionelle Videobearbeitung", description: "Hochwertige Schnitte und Bearbeitung, die perfekt auf Ihre Marke und Zielgruppe zugeschnitten sind." },
      { icon: "Shield", title: "Qualitätsgarantie", description: "Unbegrenzte Überarbeitungen bis Sie 100% zufrieden sind. Ihre Zufriedenheit ist unsere Priorität." },
      { icon: "Zap", title: "Schnelle Lieferung", description: "Erste Entwürfe innerhalb von 5-7 Tagen. Unser optimierter Prozess stellt sicher, dass Sie schnell liefern können." },
      { icon: "HeartHandshake", title: "Persönlicher Support", description: "Unser Video-Team ist immer verfügbar, um Ihre Vision zu verstehen und Anliegen zu klären." },
      { icon: "TrendingUp", title: "Conversion-Optimierung", description: "Wir optimieren Ihre Videos für maximale Zuschauerbindung und Conversion." },
      { icon: "Award", title: "Bewährte Erfolgsbilanz", description: "Von 200+ Unternehmen vertraut mit einer Kundenzufriedenheitsrate von 98%." },
    ]
  } : {
    badge: "Why Choose Us",
    heading: "What Makes Us <span class=\"text-[hsl(45,100%,60%)]\">Different</span>",
    description: "Premium video editing, creative storytelling, fast delivery, and full satisfaction guarantee.",
    items: [
      { icon: "Target", title: "Professional Video Editing", description: "High-quality cuts and edits perfectly tailored to your brand and target audience." },
      { icon: "Shield", title: "Quality Guarantee", description: "Unlimited revisions until you're 100% satisfied. Your satisfaction is our top priority." },
      { icon: "Zap", title: "Fast Delivery", description: "First drafts within 5-7 days. Our streamlined process ensures you launch quickly." },
      { icon: "HeartHandshake", title: "Personal Support", description: "Our video team is always available to understand your vision and address any concerns." },
      { icon: "TrendingUp", title: "Conversion Optimization", description: "We optimize your videos for maximum viewer engagement and conversion." },
      { icon: "Award", title: "Proven Track Record", description: "Trusted by 200+ businesses with a 98% client satisfaction rate." },
    ]
  }, [isGe]);

  // Fetch Why Choose Us data from API
  useEffect(() => {
    const fetchWhyChooseUsData = async () => {
      try {
        setLoading(true);
        const data = await fetchWhyChooseUs(currentLang);
        setWhyChooseUsData(data || fallbackData);
      } catch {
        setWhyChooseUsData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchWhyChooseUsData();
  }, [currentLang, fallbackData]);

  if (loading) {
    return (
      <section className="py-8 sm:py-10 md:py-14 lg:py-16 text-white z-30 overflow-hidden min-h-[500px]" style={{ background: 'linear-gradient(135deg, hsl(230 50% 8%) 0%, hsl(240 45% 12%) 50%, hsl(230 50% 10%) 100%)' }}>
        <div className={`container mx-auto ${SPACING.container}`}>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        </div>
      </section>
    );
  }

  if (!whyChooseUsData) return null;

  const badge = whyChooseUsData.badge;
  const heading = whyChooseUsData.heading;
  const description = whyChooseUsData.description;
  const items = whyChooseUsData.items;

  return (
    <motion.section 
      ref={ref}
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 overflow-hidden z-40"
      style={{ background: 'linear-gradient(135deg, hsl(230 50% 8%) 0%, hsl(240 45% 12%) 50%, hsl(230 50% 10%) 100%)' }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] z-0"
        style={{ y: springY }}
        animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[100px] z-0"
        style={{ y: springY }}
        animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        aria-hidden
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] z-0"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden
      />

      <div className={`container mx-auto ${SPACING.container} relative z-10`}>
        <motion.div 
          className="mb-10 sm:mb-12 md:mb-16 lg:mb-20 text-left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block mb-3 sm:mb-4 md:mb-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg shadow-purple-500/50 relative overflow-hidden animate-pulse"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-50"></span>
            <span className="relative z-10 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" />{badge}</span>
          </motion.div>
          <h2
            className="section-heading text-white dark:text-white px-2"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed px-2">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {items.map((item, index) => {
            const IconComponent = getIconComponent(item.icon);
            return (
            <motion.div 
              key={index}
              className="relative bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 hover:border-purple-500/50 hover:shadow-[0_25px_80px_-20px_rgba(168,85,247,0.4)] transition-all duration-700 group overflow-hidden"
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.6, -0.05, 0.01, 0.99] }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <motion.div 
                  className="mb-4 sm:mb-5 md:mb-6 inline-flex p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white group-hover:scale-110 transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.6)]"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-b-2 border-r-2 border-purple-500/0 group-hover:border-purple-400/50 rounded-br-xl sm:rounded-br-2xl transition-all duration-700" />
            </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};


