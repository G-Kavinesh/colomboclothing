import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import Shop from "./shop/page";
import { COMING_SOON } from "@/lib/site";
import { siteJsonLd } from "@/lib/metadata";

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
      {COMING_SOON ? <ComingSoon /> : <Shop />}
    </>
  );
}
