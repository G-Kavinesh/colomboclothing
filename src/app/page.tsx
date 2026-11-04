import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ComingSoon from "@/components/ComingSoon";
import { COMING_SOON } from "@/lib/site";
import { siteJsonLd } from "@/lib/metadata";

// Loaded only when rendered, so the shop and its product data stay out of the
// coming soon page until launch
const LaunchHome = dynamic(() => import("./launch-home"));

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()).replace(/</g, "\\u003c") }}
      />
      {COMING_SOON ? <ComingSoon /> : <LaunchHome />}
    </>
  );
}
