"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SuccessPage() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    setOrderNumber(`CLB-${Date.now().toString(36).toUpperCase()}`);
  }, []);

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

        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          Order confirmed
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
          Order #{orderNumber}
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
          Thank you for your order. We&apos;ll send you a confirmation email with tracking
          details once your items have shipped.
        </p>

        <Link
          href="/"
          style={{
            marginTop: 36,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: "var(--text)",
            borderBottom: "1px solid var(--text)",
            paddingBottom: 2,
          }}
        >
          Continue shopping
        </Link>
      </main>

      <Footer />
    </div>
  );
}
