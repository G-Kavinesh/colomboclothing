import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Everything but the admin stays crawlable: the WhatsApp, Facebook, X and LinkedIn
// link-preview bots skip any page robots.txt blocks.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/manage-cb26" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
