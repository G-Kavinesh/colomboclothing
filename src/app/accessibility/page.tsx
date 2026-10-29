import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Our commitment to making colomboclothing.com accessible to everyone, following WCAG 2.1 AA.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <InfoPage title="ACCESSIBILITY">
      <p style={{ margin: "0 0 20px" }}>
        Colombo Clothing is committed to making our website accessible to everyone.
        We follow WCAG 2.1 Level AA guidelines and continuously work to improve the
        experience for all users.
      </p>
      <p style={{ margin: "0 0 20px" }}>
        Our site is built with semantic HTML, supports keyboard navigation, and uses
        sufficient color contrast throughout. All images include descriptive alt text,
        and interactive elements are properly labeled.
      </p>
      <p style={{ margin: 0 }}>
        If you encounter any accessibility barriers or have suggestions for improvement,
        please contact us at hello@colomboclothing.com. We take all feedback seriously and
        will do our best to accommodate your needs.
      </p>
    </InfoPage>
  );
}
