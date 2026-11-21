import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Undefined Department collects, uses and protects your personal data when you shop with us.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy policy">
      <Section title="What we collect">
        When you place an order, we collect your name, email, phone number, shipping address,
        and payment information. We also collect basic analytics data (pages visited, device type)
        to improve the shopping experience.
      </Section>
      <Section title="How we use it">
        Your information is used solely to process orders, ship products, and communicate with
        you about your purchase. We do not sell or share your personal data with third parties
        for marketing purposes.
      </Section>
      <Section title="Data storage">
        Your data is stored securely and retained only as long as necessary to fulfill your
        order and comply with legal obligations. Payment information is processed by our
        payment provider and is never stored on our servers.
      </Section>
      <Section title="Your rights">
        You may request access to, correction of, or deletion of your personal data at any
        time by contacting us at hello@colomboclothing.com.
      </Section>
    </InfoPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text)",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h2>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}
