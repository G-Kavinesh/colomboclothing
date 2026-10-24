"use client";

import { useState, FormEvent } from "react";
import InfoPage from "@/components/InfoPage";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 12px",
  border: "1px solid #d6d3cc",
  background: "transparent",
  font: "400 13px 'IBM Plex Mono', monospace",
  letterSpacing: "0.04em",
  color: "#111",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.08em",
  color: "#6b6b6b",
  marginBottom: 6,
  display: "block",
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <InfoPage title="CONTACT">
      <p style={{ marginTop: 0 }}>
        Have a question about your order, sizing, or anything else? Drop us a message and
        we&apos;ll get back to you within 24 hours.
      </p>

      <div style={{ marginTop: 8, marginBottom: 32 }}>
        <span style={{ fontWeight: 500, color: "#111" }}>Email: </span>
        hello@colomboclothing.com
      </div>

      {sent ? (
        <div
          style={{
            padding: "32px 0",
            textAlign: "center",
            fontSize: 13,
            letterSpacing: "0.08em",
            color: "#111",
            fontWeight: 500,
          }}
        >
          MESSAGE SENT — WE&apos;LL BE IN TOUCH
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <label style={labelStyle}>NAME</label>
            <input type="text" name="name" required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input type="email" name="email" required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>MESSAGE</label>
            <textarea
              name="message"
              required
              rows={5}
              style={{
                ...inputStyle,
                height: "auto",
                padding: "12px",
                resize: "vertical",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              height: 48,
              border: 0,
              background: "#111",
              color: "#fff",
              font: "500 13px 'IBM Plex Mono', monospace",
              letterSpacing: "0.08em",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            SEND MESSAGE
          </button>
        </form>
      )}
    </InfoPage>
  );
}
