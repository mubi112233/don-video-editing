"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { SPACING } from "@/lib/constants";

const tools = [
  { name: "Adobe Creative Suite", category: "Design Software" },
  { name: "Figma", category: "UI/UX Design" },
  { name: "Sketch", category: "UI/UX Design" },
  { name: "Adobe Illustrator", category: "Vector Graphics" },
  { name: "Adobe Photoshop", category: "Photo Editing" },
  { name: "Adobe InDesign", category: "Print Design" },
  { name: "Canva", category: "Design Platform" },
  { name: "Blender", category: "3D Design" },
  { name: "After Effects", category: "Motion Graphics" },
  { name: "Premiere Pro", category: "Video Editing" },
  { name: "Webflow", category: "Web Design" },
  { name: "Framer", category: "Prototyping" },
];

const categoryLabels: Record<string, { en: string; ge: string }> = {
  "Design Software":    { en: "Design Software",     ge: "Design-Software" },
  "UI/UX Design":       { en: "UI/UX Design",       ge: "UI/UX Design" },
  "Vector Graphics":    { en: "Vector Graphics",    ge: "Vektorgrafik" },
  "Photo Editing":      { en: "Photo Editing",      ge: "Bildbearbeitung" },
  "Print Design":       { en: "Print Design",       ge: "Print-Design" },
  "Design Platform":    { en: "Design Platform",    ge: "Design-Plattform" },
  "3D Design":          { en: "3D Design",          ge: "3D-Design" },
  "Motion Graphics":    { en: "Motion Graphics",    ge: "Motion Graphics" },
  "Video Editing":      { en: "Video Editing",      ge: "Video-Bearbeitung" },
  "Web Design":         { en: "Web Design",         ge: "Webdesign" },
  "Prototyping":        { en: "Prototyping",         ge: "Prototyping" },
};

export const ToolsIntegration = () => {
  const pathname = usePathname();
  const isGe = pathname.startsWith("/ge") || pathname.startsWith("/de");

  const getCategory = (category: string) =>
    categoryLabels[category]?.[isGe ? "ge" : "en"] ?? category;

  return (
    <motion.section
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-background"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className={`container mx-auto ${SPACING.container}`}>
        {/* Header */}
        <motion.div
          className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 shadow-[0_8px_24px_-6px_rgba(168,85,247,0.6)] border border-white/30 backdrop-blur-sm relative overflow-hidden animate-pulse"
            whileHover={{ scale: 1.05 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-50"></span>
            <span className="relative z-10">{isGe ? "Unsere Tools" : "Our Tools"}</span>
          </motion.span>
          <h2 className="section-heading">
            {isGe ? (
              <>Expertise in führenden <span className="gradient-heading">Design-Tools</span></>
            ) : (
              <>Expertise in Leading <span className="gradient-heading">Design Tools</span></>
            )}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl dark:text-white/90">
            {isGe
              ? "Unser Team beherrscht alle gängigen Design-Software und liefert in jedem Format, das Sie benötigen."
              : "Our team masters all popular design software and delivers in any format you need."}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Tools grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                className="relative bg-card/80 backdrop-blur-sm border border-border rounded-xl p-3 sm:p-4 text-center hover:border-[hsl(var(--brand-blue))]/40 hover:shadow-[0_12px_35px_-10px_hsl(217_91%_60%/0.15)] transition-all duration-300 group overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                whileHover={{ y: -4, scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand-blue))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="text-sm sm:text-base font-bold text-foreground dark:text-white transition-colors relative z-10">
                  {tool.name}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-[hsl(var(--brand-blue))]/10 to-[hsl(var(--brand-blue))]/10 text-[hsl(var(--brand-blue))] rounded-full border border-[hsl(var(--brand-blue))]/20 relative z-10">
                  {getCategory(tool.category)}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Callout */}
          <motion.div
            className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 md:p-10 text-center overflow-hidden group hover:border-[hsl(var(--brand-blue))]/40 hover:shadow-[0_20px_50px_-15px_hsl(217_91%_60%/0.15)] transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand-blue))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--brand-blue))]/30 to-transparent"></div>
            <p className="text-base sm:text-lg md:text-xl font-bold text-foreground dark:text-white mb-3 sm:mb-4 relative z-10">
              <span className="bg-gradient-to-r from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-blue))] bg-clip-text text-transparent">
                {isGe ? "Benötigen Sie ein spezielles Format?" : "Need a specific file format?"}
              </span>{" "}{isGe ? "Einfach fragen." : "Just ask."}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground dark:text-white/90 leading-relaxed relative z-10">
              {isGe
                ? "Wir liefern in jedem Format – von druckfertigen PDFs bis zu web-optimierten Assets."
                : "We deliver in any format — from print-ready PDFs to web-optimized assets."}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};


