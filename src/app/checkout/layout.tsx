import type { Metadata } from "next";
import { NO_INDEX, TITLE_TEMPLATE } from "@/lib/metadata";

// Page is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: { default: "Checkout", template: TITLE_TEMPLATE },
  robots: NO_INDEX,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
