"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { lookupPreorder, type PreorderLookup } from "@/lib/preorders";
import { formatPrice } from "@/lib/products";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 12px",
  border: "1px solid var(--border-light)",
  borderRadius: 6,
  background: "transparent",
  font: "400 13px 'IBM Plex Mono', monospace",
  color: "var(--text)",
  boxSizing: "border-box",
};

const statusColors: Record<string, string> = {
  pending: "#c49a2a",
  verified: "#2d8a4e",
  cancelled: "#c0392b",
};

export default function PreorderStatusPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PreorderLookup | null>(null);
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    const found = await lookupPreorder(query.trim());
    setChecking(false);
    if (found === "not-found" || found === "error") {
      setResult(null);
      setMessage(found === "not-found" ? "No preorder found" : "Couldn\u2019t check right now. Try again");
      return;
    }
    setResult(found);
    setMessage("");
  };

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
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 500, letterSpacing: "0.02em" }}>
          Preorder status
        </h1>

        <form
          onSubmit={handleSearch}
          style={{
            marginTop: 36,
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Enter your preorder ID
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="UD-XXXXXXXX"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={checking}
            style={{
              width: "100%",
              height: 44,
              border: 0,
              borderRadius: 6,
              background: "var(--btn-bg)",
              color: "var(--btn-text)",
              font: "500 13px 'IBM Plex Mono', monospace",
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "opacity 0.15s",
              opacity: checking ? 0.6 : 1,
            }}
          >
            {checking ? "Checking..." : "CHECK STATUS"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: 36,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            {message}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 36,
              width: "100%",
              maxWidth: 480,
              padding: "24px 0",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                {result.id}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: statusColors[result.status],
                  padding: "3px 8px",
                  border: `1px solid ${statusColors[result.status]}`,
                  borderRadius: 4,
                }}
              >
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </span>
            </div>

            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 24px",
                fontSize: 12,
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)" }}>Product </span>
                <span>{result.productName}</span>
              </div>
              {result.color && (
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Colour </span>
                  <span>{result.color}</span>
                </div>
              )}
              <div>
                <span style={{ color: "var(--text-muted)" }}>Size </span>
                <span>{result.size}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Name </span>
                <span>{result.firstName}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Price </span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatPrice(result.price)}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Date </span>
                <span>{new Date(result.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: "16px 0",
                borderTop: "1px solid var(--border)",
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              {result.status === "pending" &&
                "Your preorder is being reviewed. We\u2019ll reach out via email or phone to confirm."}
              {result.status === "verified" &&
                "Your preorder has been verified. We\u2019ll dispatch your order and contact you with delivery details."}
              {result.status === "cancelled" &&
                "This preorder has been cancelled. Contact us if you believe this is an error."}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
