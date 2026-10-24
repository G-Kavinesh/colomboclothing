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
          padding: "48px 20px 96px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            marginTop: 40,
            maxWidth: 600,
            width: "100%",
            fontSize: 13,
            lineHeight: 1.8,
            color: "#6b6b6b",
          }}
        >
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
