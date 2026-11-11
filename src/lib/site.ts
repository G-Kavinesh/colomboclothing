// Set to false on launch to bring back the original product grid home page.
// The home page share image follows this flag too.
export const COMING_SOON = true;

export const SITE_NAME = "Undefined Department";
// Short form for tight spots: phone home-screen label, small print
export const SITE_SHORT_NAME = "UDFDPT.";
export const SITE_TITLE = "Undefined Department - Worldwide, Based in Sri Lanka";
export const SITE_DESCRIPTION =
  "Soft, Heavy and Easy to Wear. Everyday clothing made in Colombo and shipped worldwide.";

export const SITE_URL = "https://colomboclothing.com";

// Vercel sets this at build time. Only production builds are indexable, so local
// and preview builds never end up in search results.
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

// WhatsApp, iMessage, Slack, Discord and Telegram cache share images by URL, so
// share image URLs carry a version: it changes with the launch flag, and
// OG_VERSION is bumped whenever the card design or branding changes. Otherwise
// people would keep seeing the old card.
export const OG_VERSION = 2;

export const SITE_OG_IMAGE = {
  url: `/og.jpg?v=${OG_VERSION}-${COMING_SOON ? "soon" : "live"}`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Undefined Department — heavyweight oversize essentials from Sri Lanka",
};

// Child pages that set `openGraph` replace the parent's object wholesale, so they
// spread this in to keep the site name, type and fallback image.
export const OPEN_GRAPH_BASE = {
  type: "website" as const,
  siteName: SITE_NAME,
  locale: "en_US",
  images: [SITE_OG_IMAGE],
};
