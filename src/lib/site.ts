// Set to false on launch to bring back the original product grid home page.
// The home page share image follows this flag too.
export const COMING_SOON = true;

export const SITE_NAME = "Colombo Clothing";
export const SITE_TITLE = "Colombo Clothing — Heavyweight Oversize Essentials";
export const SITE_DESCRIPTION =
  "Oversize essentials from Colombo — heavyweight, garment-dyed, built to last. A worldwide department based in Sri Lanka.";

export const SITE_URL = "https://colomboclothing.com";

// Vercel sets this at build time. Only production builds are indexable, so local
// and preview builds never end up in search results.
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

export const SITE_OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Colombo Clothing — heavyweight oversize essentials from Sri Lanka",
};

// Child pages that set `openGraph` replace the parent's object wholesale, so they
// spread this in to keep the site name, type and fallback image.
export const OPEN_GRAPH_BASE = {
  type: "website" as const,
  siteName: SITE_NAME,
  locale: "en_US",
  images: [SITE_OG_IMAGE],
};
