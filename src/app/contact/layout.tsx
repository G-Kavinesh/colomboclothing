import type { Metadata } from "next";

// Page is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about an order, sizing or anything else? Get in touch with Colombo Clothing — we reply within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
