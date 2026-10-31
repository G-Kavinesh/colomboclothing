import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme-context";
import { PreorderProvider } from "@/lib/preorder-context";
import { ProductProvider } from "@/lib/product-context";
import EmailPopup from "@/components/EmailPopup";
import { IS_PRODUCTION, OPEN_GRAPH_BASE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

// Open Graph and Twitter title/description are left unset here so every page's own
// title and description flow into its share preview.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: OPEN_GRAPH_BASE,
  twitter: { card: "summary_large_image" },
  appleWebApp: { title: SITE_NAME },
  formatDetection: { telephone: false },
  // Only production builds are indexable (see IS_PRODUCTION).
  robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable} suppressHydrationWarning>
      <body className={ibmPlexMono.className}>
        <ThemeProvider>
          <ProductProvider>
            <PreorderProvider>
              <CartProvider>
                {children}
                <EmailPopup />
              </CartProvider>
            </PreorderProvider>
          </ProductProvider>
        </ThemeProvider>
        {/* Cookieless page-view counts, shown under Analytics in the Vercel dashboard */}
        <Analytics />
      </body>
    </html>
  );
}
