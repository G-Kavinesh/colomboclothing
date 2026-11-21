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
          padding: "48px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "2px solid var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              display: "block",
              width: 12,
              height: 22,
              borderRight: "2px solid var(--text)",
              borderBottom: "2px solid var(--text)",
              transform: "rotate(45deg) translate(-2px, -2px)",
            }}
          />
        </div>

        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 500, letterSpacing: "0.02em" }}>
          Preorder placed
        </h1>

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            letterSpacing: "0.04em",
            color: "var(--text-muted)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Preorder #{id}
        </div>

        <p
          style={{
            marginTop: 24,
            maxWidth: 400,
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
            padding: "14px 20px",
            border: "1px solid var(--border-light)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Save your preorder ID to track status
        </div>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Link
            href="/preorder/status"
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "var(--text)",
              borderBottom: "1px solid var(--text)",
              paddingBottom: 2,
            }}
          >
            Check status
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: 2,
            }}
          >
            Continue shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
