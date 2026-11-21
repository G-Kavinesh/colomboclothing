import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function InfoPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px 48px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            marginTop: 36,
            maxWidth: 600,
            width: "100%",
            fontSize: 13,
            lineHeight: 1.8,
            color: "var(--text-muted)",
          }}
        >
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
