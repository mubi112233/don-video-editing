import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { DesignSystemProvider } from "@/components/DesignSystemProvider";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";
   
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
}); 

const poppins = Poppins({
  subsets:    ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1433" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "don-video-editing - Premium Video Editing Services",
    template: "%s | don-video-editing",
  },
  description:
    "Professional video editing services. High-quality cuts, color grading, motion graphics, and post-production. Trusted by 250+ clients. Fast turnaround, guaranteed satisfaction. Book your free consultation today.",
  keywords: [
    "video editing service",
    "professional video editor",
    "video post-production",
    "color grading",
    "motion graphics",
    "video production",
    "youtube video editing",
    "social media video editing",
    "corporate video editing",
    "don-video-editing",
  ],
  authors: [{ name: "don-video-editing", url: SITE_URL }],
  creator: "don-video-editing",
  publisher: "don-video-editing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "NilMqJxre6z_IfCF2MhSaELbgq16YxDG_WzE6e36ChU",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "don-video-editing",
    title: "don-video-editing - Premium Video Editing Services",
    description:
      "Professional video editing services. High-quality cuts, color grading, motion graphics, and post-production. Fast turnaround, guaranteed satisfaction.",
    url: absoluteUrl("/en"),
    locale: "en_US",
    alternateLocale: ["de_DE"],
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "don-video-editing — Premium Video Editing Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "don-video-editing - Premium Video Editing Services",
    description:
      "Professional video editing services. High-quality cuts, color grading, motion graphics, and post-production. Fast turnaround, guaranteed satisfaction.",
    images: [absoluteUrl("/opengraph-image")],
  },
  // Per-page alternates are set in each route's generateMetadata.
  // Root layout does NOT set alternates to avoid overriding page-level hreflang.
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "don-video-editing",
  url: SITE_URL,
  logo: absoluteUrl("/opengraph-image"),
  description:
    "Professional video editing agency specializing in post-production, color grading, motion graphics, and video content for businesses worldwide.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "German"],
  },
  areaServed: [
    { "@type": "Country", name: "Germany" },
    { "@type": "Country", name: "Austria" },
    { "@type": "Country", name: "Switzerland" },
    { "@type": "Place", name: "Worldwide" },
  ],
  sameAs: ["https://linkedin.com/company/don-video-editing", "https://twitter.com/don-video-editing", "https://instagram.com/don-video-editing"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "don-video-editing",
  url: SITE_URL,
  inLanguage: ["en-US", "de-DE"],
  publisher: { "@type": "Organization", name: "don-video-editing" },
};

// Service schema for video editing services
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Video Editing Services",
  provider: {
    "@type": "Organization",
    name: "don-video-editing",
    url: SITE_URL,
  },
  areaServed: [
    { "@type": "Country", name: "Germany" },
    { "@type": "Country", name: "Austria" },
    { "@type": "Country", name: "Switzerland" },
    { "@type": "Place", name: "Worldwide" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Video Editing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Professional Video Editing",
          description: "High-quality cuts and edits tailored to your brand",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Color Grading",
          description: "Cinematic color grading for a professional look",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Motion Graphics",
          description: "Engaging animations and motion graphics for your videos",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Social Media Video Editing",
          description: "Short-form videos optimized for YouTube, Instagram, TikTok",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Corporate Video Production",
          description: "Professional videos for business, training, and marketing",
        },
      },
    ],
  },
};

// LocalBusiness schema for Video Editing Agency
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "don-video-editing",
  url: SITE_URL,
  logo: absoluteUrl("/opengraph-image"),
  image: absoluteUrl("/opengraph-image"),
  description: "Professional video editing agency specializing in post-production, color grading, motion graphics, and video content",
  sameAs: [
    "https://linkedin.com/company/don-video-editing",
    "https://twitter.com/don-video-editing",
    "https://instagram.com/don-video-editing",
  ],
  priceRange: "€€",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const htmlLang = headersList.get("x-html-lang") || "en";

  return (
    <html lang={htmlLang} suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Performance: Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G7B48DKJTC" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-G7B48DKJTC');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <DesignSystemProvider defaultTheme="gold">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </DesignSystemProvider>
      </body>
    </html>
  );
}


