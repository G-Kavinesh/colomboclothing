"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import { addSubscriber } from "@/lib/subscribers";

const HEADLINE = "COMING SOON";
const TICKER = "100% COTTON · ESSENTIALS · MADE IN COLOMBO · HEAVYWEIGHT · GARMENT-DYED · CLOTHING MADE SIMPLE · ";

export default function ComingSoon() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    setFailed(false);
    const saved = await addSubscriber(email);
    setSending(false);
    if (saved) setSubmitted(true);
    else setFailed(true);
  };

  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top bar */}
      <header
        className="header-nav"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 16,
          padding: "24px clamp(16px, 5vw, 64px)",
          fontSize: 13,
          letterSpacing: "0.08em",
        }}
      >
        {/* Empty left column keeps the brand centred */}
        <div className="header-nav-links" />

        <span className="header-brand" style={{ color: "var(--text)", fontWeight: 600, justifySelf: "center" }}>
          colomboclothing.com
        </span>

        <div className="header-right" style={{ justifySelf: "end", display: "flex", alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: 20,
              height: 20,
              padding: 0,
              border: "1.5px solid var(--text)",
              borderRadius: "50%",
              cursor: "pointer",
              background: theme === "dark" ? "var(--text)" : "transparent",
              transition: "background 0.2s",
            }}
          />
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px 56px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div className="cs-logo" style={{ width: "min(520px, 86vw)" }}>
          <Image
            src="/images/colombo-logo.png"
            alt="Colombo"
            width={2056}
            height={765}
            loading="eager"
            fetchPriority="high"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Headline */}
        <h1
          aria-label={HEADLINE}
          style={{
            margin: "40px 0 0",
            fontSize: "clamp(22px, 5vw, 34px)",
            fontWeight: 600,
            letterSpacing: "0.32em",
            marginRight: "-0.32em",
            color: "var(--text)",
          }}
        >
          {HEADLINE.split("").map((char, i) => (
            <span
              key={i}
              aria-hidden
              className="cs-char"
              style={{ animationDelay: `${0.4 + i * 0.06}s` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
          <span className="cs-cursor" aria-hidden />
        </h1>

        <p
          className="cs-fade"
          style={{
            margin: "20px 0 0",
            maxWidth: 420,
            fontSize: 12,
            lineHeight: 1.8,
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            animationDelay: "1.2s",
          }}
        >
          Essentials from Colombo that are built to last.
        </p>

        {/* Silhouette teaser */}
        <figure
          className="cs-fade"
          style={{ margin: "48px 0 0", width: "clamp(140px, 40vw, 200px)", animationDelay: "1.4s" }}
        >
          <div className="cs-silhouette" style={{ position: "relative", aspectRatio: "1 / 1" }}>
            <Image
              src="/images/tee-front.webp"
              alt="Upcoming piece"
              fill
              sizes="200px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <figcaption style={{ marginTop: 12, fontSize: 10, letterSpacing: "0.16em", color: "var(--text-muted)" }}>
            CMB-01 / ???
          </figcaption>
        </figure>

        {/* Signup */}
        <div className="cs-fade" style={{ marginTop: 48, width: "100%", maxWidth: 440, animationDelay: "1.6s" }}>
          {submitted ? (
            <div style={{ padding: "14px 0" }}>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text)" }}>
                YOU&apos;RE ON THE LIST
              </div>
              <div style={{ marginTop: 10, fontSize: 12, letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                We&apos;ll email you the moment Drop 01 goes live.
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 14, fontSize: 11, letterSpacing: "0.12em", color: "var(--text-muted)" }}>
                BE FIRST IN LINE
              </div>
              <form className="cs-form" onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  required
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 46,
                    padding: "0 14px",
                    border: "1px solid var(--border-light)",
                    borderRight: 0,
                    font: "400 13px 'IBM Plex Mono', monospace",
                    letterSpacing: "0.04em",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    height: 46,
                    padding: "0 22px",
                    border: 0,
                    background: "var(--btn-bg)",
                    color: "var(--btn-text)",
                    font: "500 12px 'IBM Plex Mono', monospace",
                    letterSpacing: "0.1em",
                    cursor: sending ? "wait" : "pointer",
                    opacity: sending ? 0.6 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {sending ? "SENDING…" : "NOTIFY ME"}
                </button>
              </form>
              {failed && (
                <div role="alert" style={{ marginTop: 12, fontSize: 11, letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                  Couldn&apos;t sign you up just now. Please try again.
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Ticker */}
      <div
        aria-hidden
        style={{
          borderTop: "2px solid var(--border)",
          borderBottom: "2px solid var(--border)",
          padding: "14px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: 12,
          letterSpacing: "0.14em",
          color: "var(--text-muted)",
        }}
      >
        <div className="cs-ticker">
          <span>{TICKER.repeat(4)}</span>
          <span>{TICKER.repeat(4)}</span>
        </div>
      </div>

      <footer
        className="footer-copy"
        style={{
          padding: "20px 16px 28px",
          display: "flex",
          justifyContent: "center",
          gap: 24,
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
        }}
      >
        <span>© {new Date().getFullYear()} COLOMBO CLOTHING</span>
      </footer>
    </div>
  );
}
