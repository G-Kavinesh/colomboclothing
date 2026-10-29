import type { Metadata } from "next";
import { Suspense } from "react";
import PreorderSuccess from "@/components/PreorderSuccess";
import { NO_INDEX } from "@/lib/metadata";

export const metadata: Metadata = { title: "Pre-order Confirmed", robots: NO_INDEX };

export default function PreorderSuccessPage() {
  return (
    <Suspense>
      <PreorderSuccess />
    </Suspense>
  );
}
