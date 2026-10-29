import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import Shop from "./shop/page";
import { COMING_SOON } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return COMING_SOON ? <ComingSoon /> : <Shop />;
}
