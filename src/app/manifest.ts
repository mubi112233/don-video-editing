import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "don-video-editing - Premium Video Editing Services",
    short_name: "don-video-editing",
    description: "Professional video editing services. High-quality cuts, color grading, motion graphics, and post-production. Fast turnaround, guaranteed satisfaction.",
    start_url: "/",
    display: "standalone",
    background_color: "#3D2817",
    theme_color: "#FFBC42",
    icons: [  
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    orientation: "portrait",
    scope: "/",
    lang: "en",
    categories: ["video", "business", "productivity", "media"],
  };
}


