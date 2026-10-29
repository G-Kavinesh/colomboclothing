import type { Metadata } from "next";

// Keep the admin out of search results and away from crawlers entirely
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
