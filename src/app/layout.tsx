import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme-context";
import EmailPopup from "@/components/EmailPopup";
import { IS_PRODUCTION, OPEN_GRAPH_BASE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: OPEN_GRAPH_BASE,
  twitter: { card: "summary_large_image" },
  appleWebApp: { title: SITE_NAME },
  formatDetection: { telephone: false },
  robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className={ibmPlexMono.className}>
        <ThemeProvider>
          <CartProvider>
            {children}
            <EmailPopup />
          </CartProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
