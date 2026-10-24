"use client";

import { useState, FormEvent } from "react";
import InfoPage from "@/components/InfoPage";

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

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.08em",
  color: "var(--text-muted)",
  marginBottom: 6,
  display: "block",
};

export default function OrderStatusPage() {
  const [searched, setSearched] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <InfoPage title="ORDER STATUS">
      <p style={{ marginTop: 0 }}>
        Enter your order number and email to check the status of your order.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 24,
        }}
      >
        <div>
          <label style={labelStyle}>ORDER NUMBER</label>
          <input
            type="text"
            name="orderNumber"
            required
            style={inputStyle}
            placeholder="CLB-XXXXXXX"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
              setSearched(false);
            }}
          />
        </div>
        <div>
          <label style={labelStyle}>EMAIL</label>
          <input
            type="email"
            name="email"
            required
            style={inputStyle}
            placeholder="you@email.com"
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            height: 48,
            border: 0,
            background: "var(--btn-bg)",
            color: "var(--btn-text)",
            font: "500 13px 'IBM Plex Mono', monospace",
            letterSpacing: "0.08em",
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          TRACK ORDER
        </button>
      </form>

      {searched && (
        <div
          style={{
            marginTop: 32,
            padding: 24,
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            ORDER {orderNumber.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StatusStep label="ORDER PLACED" done />
            <StatusStep label="PAYMENT CONFIRMED" done />
            <StatusStep label="PREPARING" done />
            <StatusStep label="SHIPPED" active />
            <StatusStep label="DELIVERED" />
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
            }}
          >
            Estimated delivery: 3–5 business days
          </div>
        </div>
      )}
    </InfoPage>
  );
}

function StatusStep({
  label,
  done,
  active,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: done || active ? "var(--text)" : "var(--border-light)",
          border: active ? "2px solid var(--text)" : "none",
          boxShadow: active ? "0 0 0 3px var(--overlay)" : "none",
        }}
      />
      <span
        style={{
          fontSize: 12,
          letterSpacing: "0.08em",
          color: done || active ? "var(--text)" : "var(--text-muted)",
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </span>
    </div>
  );
}
