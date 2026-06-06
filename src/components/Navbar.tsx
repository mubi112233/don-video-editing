"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig, normalizeLocale, localizedPath, localeUrlPrefix } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const siteLocale = normalizeLocale(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < 10) {
        setTimeout(() => tryScroll(attempts + 1), 100);
      }
    };
    tryScroll();
  }, [pathname]);

  const getCurrentLang = () => {
    const match = pathname.match(/^\/(en|de|ge)\b/i);
    const raw = match?.[1]?.toLowerCase() || "en";
    return raw === "ge" ? "de" : raw;
  };
  const currentLang = getCurrentLang();

  const navItems = [
    { name: currentLang === "de" ? "Dienstleistungen" : "Services", href: "#services" },
    { name: currentLang === "de" ? "So funktioniert es" : "How It Works", href: "#how-it-works" },
    { name: currentLang === "de" ? "Preise" : "Pricing", href: "#pricing" },
    { name: currentLang === "de" ? "Kundenstimmen" : "Testimonials", href: "#testimonials" },
    { name: currentLang === "de" ? "Häufige Fragen" : "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  const switchLanguage = (lang: "en" | "de") => {
    const targetSeg = lang === "de" ? "de" : "en";
    const hasLangPrefix = /^\/(en|de|ge)(\/|$)/i.test(pathname);
    const finalPath = hasLangPrefix
      ? pathname.replace(/^\/(en|de|ge)(?=\/|$)/i, `/${targetSeg}`)
      : pathname === "/"
        ? `/${targetSeg}`
        : `/${targetSeg}${pathname}`;
    router.push(finalPath);
  };

  const isHomePage =
    pathname === "/en" || pathname === "/ge" || pathname === "/de" || pathname === "/";

  const handleNavClick = (hash: string) => {
    const id = hash.replace("#", "");
    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`${currentLang === "de" ? "/de" : "/en"}${hash}`);
    }
    setIsOpen(false);
  };

  const ThemeIcon = () => {
    if (!mounted) return <div className="w-5 h-5" />;
    const current = theme === "system" || !theme ? "light" : theme;
    return current === "light" ? (
      <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
    ) : (
      <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
    );
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 hero-section-bg",
        scrolled
          ? "backdrop-blur-2xl border-b border-border/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_-8px_rgba(147,51,234,0.15)]"
          : "backdrop-blur-xl"
      )}
      style={{ backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "blur(16px) saturate(150%)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-[72px] lg:h-20">
          {/* Logo */}
          <motion.button
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => router.push(`/${localeUrlPrefix(siteLocale)}`)}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <motion.div
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md shadow-purple-500/50 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-base sm:text-lg md:text-lg lg:text-xl">
                {siteConfig.brandMarkText}
              </span>
            </motion.div>
            <motion.span
              className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              {siteConfig.brandName}
            </motion.span>
          </motion.button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-3 lg:space-x-6 xl:space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                type="button"
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                onClick={() => handleNavClick(item.href)}
                className="relative text-foreground transition-all duration-200 font-semibold text-sm md:text-sm lg:text-base px-2 md:px-2.5 lg:px-3 py-2 rounded-lg hover:bg-foreground/5 dark:hover:bg-white/10 group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-blue))] w-0 group-hover:w-3/4 transition-all duration-300" />
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-2.5 lg:space-x-3 xl:space-x-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative hover:bg-gold/10 hover:text-gold w-9 h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 transition-all duration-300 hover:scale-110 overflow-hidden"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.5, rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ThemeIcon />
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchLanguage(currentLang === "en" ? "de" : "en")}
                className="text-sm md:text-sm lg:text-base px-3 py-2"
                aria-label="Change language"
              >
                {currentLang.toUpperCase()}
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.48 }}>
              <Link
                href={localizedPath(siteLocale, siteConfig.routes.contact)}
                className="text-sm md:text-sm lg:text-base px-3 md:px-4 py-2 border border-border rounded-md hover:bg-accent transition-all duration-300 font-medium whitespace-nowrap"
              >
                {currentLang === "de" ? "Kontakt" : "Contact"}
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <Link
                href={localizedPath(siteLocale, siteConfig.routes.bookMeeting)}
                className="text-sm md:text-sm lg:text-base px-4 md:px-4 lg:px-7 py-2 md:py-2 lg:py-2.5 font-semibold whitespace-nowrap rounded-md bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 dark:from-purple-500 dark:via-pink-400 dark:to-orange-400 dark:hover:from-purple-600 dark:hover:via-pink-500 dark:hover:to-orange-500 text-white border-0 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                {currentLang === "de" ? "Starten" : "Get Started"}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:hidden flex items-center space-x-2"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-gold/10 hover:text-gold w-9 h-9 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <ThemeIcon />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchLanguage(currentLang === "en" ? "de" : "en")}
              className="px-2 py-1"
              aria-label="Change language"
            >
              {currentLang.toUpperCase()}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-gold/10 hover:text-gold w-9 h-9 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden hero-section-bg backdrop-blur-xl border-t border-border/50 shadow-lg"
            >
              <div className="py-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.button
                    type="button"
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left text-foreground hover:text-[hsl(var(--brand-blue))] hover:bg-[hsl(var(--brand-blue))]/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg mx-2"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: navItems.length * 0.05 }}
                  className="pt-3 px-3 border-t border-border/50"
                >
                  <button
                    type="button"
                    onClick={() => { router.push(currentLang === "de" ? "/de/book-meeting" : "/en/book-meeting"); setIsOpen(false); }}
                    className="w-full text-base py-3 font-semibold rounded-lg bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white border-0 hover:shadow-lg transition-all duration-300"
                  >
                    {currentLang === "de" ? "Jetzt starten" : "Get Started"}
                  </button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: navItems.length * 0.05 + 0.05 }}
                  className="pt-2 px-3"
                >
                  <button
                    type="button"
                    onClick={() => { router.push(currentLang === "de" ? "/de/contact" : "/en/contact"); setIsOpen(false); }}
                    className="w-full text-base py-3 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-all duration-300"
                  >
                    {currentLang === "de" ? "Kontakt" : "Contact"}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
