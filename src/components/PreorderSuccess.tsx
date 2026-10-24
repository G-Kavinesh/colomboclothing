"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PreorderSuccess() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "2.5px solid var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              display: "block",
              width: 14,
              height: 24,
              borderRight: "2.5px solid var(--text)",
              borderBottom: "2.5px solid var(--text)",
              transform: "rotate(45deg) translate(-2px, -2px)",
            }}
          />
        </div>

        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "0.08em" }}>
          PREORDER PLACED
        </h1>

        <div
          style={{
            marginTop: 16,
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
          }}
        >
          PREORDER #{id}
        </div>

        <p
          style={{
            marginTop: 24,
            maxWidth: 420,
            fontSize: 13,
            lineHeight: 1.7,
            color: "var(--text-muted)",
          }}
        >
          Your preorder has been received. We&apos;ll verify your order and
          reach out via email or phone to confirm. Pay on delivery.
        </p>

        <div
          style={{
            marginTop: 32,
            padding: "16px 24px",
            border: "1px solid var(--border)",
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Save your preorder ID to track status
        </div>

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Link
            href="/preorder/status"
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--text)",
              borderBottom: "1px solid var(--text)",
              paddingBottom: 2,
            }}
          >
            CHECK STATUS
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: 2,
            }}
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
