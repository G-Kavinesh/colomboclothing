"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePreorder, PreorderEntry } from "@/lib/preorder-context";
import { formatPrice } from "@/lib/products";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 12px",
  border: "1px solid var(--border-light)",
  background: "transparent",
  font: "400 13px 'IBM Plex Mono', monospace",
  letterSpacing: "0.04em",
  color: "var(--text)",
  boxSizing: "border-box",
};

const statusColors: Record<string, string> = {
  pending: "#e2a832",
  verified: "#34a853",
  cancelled: "#ea4335",
};

export default function PreorderStatusPage() {
  const { getPreorder } = usePreorder();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PreorderEntry | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    const found = getPreorder(trimmed);
    setResult(found || null);
    setSearched(true);
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
          padding: "48px 20px 48px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "0.08em" }}>
          PREORDER STATUS
        </h1>

        <form
          onSubmit={handleSearch}
          style={{
            marginTop: 40,
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            ENTER YOUR PREORDER ID
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="PRE-XXXXX-XXX"
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              height: 44,
              border: 0,
              background: "var(--btn-bg)",
              color: "var(--btn-text)",
              font: "500 13px 'IBM Plex Mono', monospace",
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            CHECK STATUS
          </button>
        </form>

        {searched && !result && (
          <div
            style={{
              marginTop: 40,
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
            }}
          >
            NO PREORDER FOUND
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 40,
              width: "100%",
              maxWidth: 480,
              padding: "24px 0",
              borderTop: "1px solid var(--border)",
            }}
          >
            {/* Status badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em" }}>
                {result.id}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: statusColors[result.status],
                  padding: "4px 10px",
                  border: `1px solid ${statusColors[result.status]}`,
                }}
              >
                {result.status.toUpperCase()}
              </span>
            </div>

            {/* Details */}
            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 24px",
                fontSize: 12,
                letterSpacing: "0.04em",
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)" }}>PRODUCT </span>
                <span>{result.productName}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>SIZE </span>
                <span>{result.size}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>NAME </span>
                <span>{result.firstName} {result.lastName}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>PRICE </span>
                <span>{formatPrice(result.price)}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>DATE </span>
                <span>{new Date(result.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status explanation */}
            <div
              style={{
                marginTop: 24,
                padding: "16px 0",
                borderTop: "1px solid var(--border)",
                fontSize: 12,
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              {result.status === "pending" &&
                "Your preorder is being reviewed. We'll reach out via email or phone to confirm."}
              {result.status === "verified" &&
                "Your preorder has been verified. We'll dispatch your order and contact you with delivery details."}
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
