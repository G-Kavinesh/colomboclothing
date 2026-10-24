import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Terms — Colombo Clothing" };

export default function TermsPage() {
  return (
    <InfoPage title="TERMS & CONDITIONS">
      <Section title="1. GENERAL">
        These terms govern your use of colomboclothing.com and any purchases made through it.
        By placing an order you agree to these terms in full.
      </Section>
      <Section title="2. ORDERS & PRICING">
        All prices are listed in Sri Lankan Rupees (LKR). We reserve the right to update prices
        at any time. Once an order is confirmed, the price at the time of purchase applies.
        Orders are subject to availability.
      </Section>
      <Section title="3. SHIPPING">
        We ship island-wide within Sri Lanka. Standard delivery takes 3–5 business days.
        Free shipping on all orders. International shipping is not currently available.
      </Section>
      <Section title="4. RETURNS & EXCHANGES">
        We accept returns and exchanges within 14 days of delivery. Items must be unworn,
        unwashed, and in original packaging. Contact us at hello@colomboclothing.com to
        initiate a return.
      </Section>
      <Section title="5. INTELLECTUAL PROPERTY">
        All content on this site — including logos, images, and copy — is the property of
        Colombo Clothing and may not be reproduced without written permission.
      </Section>
      <Section title="6. LIMITATION OF LIABILITY">
        Colombo Clothing is not liable for any indirect or consequential damages arising from
        the use of this site or our products, to the maximum extent permitted by law.
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
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: "#111",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h2>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}
