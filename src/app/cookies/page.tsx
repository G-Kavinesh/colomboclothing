import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Cookies",
  description: "How Colombo Clothing uses cookies and local storage to keep your bag and preferences between visits.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <InfoPage title="COOKIES">
      <p style={{ margin: "0 0 20px" }}>
        We use cookies and local storage to keep your shopping bag intact between visits
        and to remember basic site preferences. These are essential to the shopping experience
        and cannot be disabled without breaking core functionality.
      </p>
      <p style={{ margin: "0 0 20px" }}>
        We do not use third-party tracking cookies or advertising cookies. We may use
        minimal analytics to understand how visitors use the site — this data is anonymized
        and never sold.
      </p>
      <p style={{ margin: 0 }}>
        By using colomboclothing.com you consent to the use of these essential cookies.
        If you have questions, contact us at hello@colomboclothing.com.
      </p>
    </InfoPage>
  );
}
