import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/metadata";

// Page is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: NO_INDEX,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
