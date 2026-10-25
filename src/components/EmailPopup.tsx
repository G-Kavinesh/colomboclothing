"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "colombo-email-popup";
const SUBSCRIBERS_KEY = "colombo-subscribers";
const DELAY_MS = 4000; // show after 4 seconds

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) return;
    } catch {}

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {}
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Store subscriber
    try {
      const stored = localStorage.getItem(SUBSCRIBERS_KEY);
      const subscribers: string[] = stored ? JSON.parse(stored) : [];
      if (!subscribers.includes(email.toLowerCase())) {
        subscribers.push(email.toLowerCase());
        localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
      }
    } catch {}

    setSubmitted(true);
    setTimeout(close, 2000);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        opacity: closing ? 0 : 1,
        transition: "opacity 0.3s",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          transform: closing ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.3s",
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            border: 0,
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            fontSize: 18,
            font: "400 18px 'IBM Plex Mono', monospace",
          }}
        >
          ✕
        </button>

        {submitted ? (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "var(--text)",
              }}
            >
              YOU&apos;RE IN
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              We&apos;ll keep you posted on new drops.
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              COLOMBO CLOTHING
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--text)",
                lineHeight: 1.4,
              }}
            >
              GET EARLY ACCESS
            </div>
            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 12,
                lineHeight: 1.7,
                color: "var(--text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              Be the first to know about new drops, restocks, and exclusive releases. No spam — just the good stuff.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: 28,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 12px",
                  border: "1px solid var(--border-light)",
                  background: "transparent",
                  font: "400 13px 'IBM Plex Mono', monospace",
                  letterSpacing: "0.04em",
                  color: "var(--text)",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  height: 44,
                  border: 0,
                  background: "var(--btn-bg)",
                  color: "var(--btn-text)",
                  font: "500 12px 'IBM Plex Mono', monospace",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                JOIN THE LIST
              </button>
            </form>

            <button
              onClick={close}
              style={{
                marginTop: 20,
                border: 0,
                background: "none",
                cursor: "pointer",
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                font: "400 11px 'IBM Plex Mono', monospace",
              }}
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
