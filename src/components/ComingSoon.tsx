"use client";

import { useState } from "react";
import Image from "next/image";
import { addSubscriber, type SignupResult } from "@/lib/subscribers";
import { BotTrap, SignupError } from "@/components/SignupFields";

const HEADLINE = "COMING SOON";
const TICKER = "PREMIUM COTTON · ESSENTIALS · MADE IN COLOMBO · HEAVYWEIGHT · GARMENT-DYED · CLOTHING MADE SIMPLE · ";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState<"new" | "already" | null>(null);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<Extract<SignupResult, { ok: false }> | null>(null);
  const [trap, setTrap] = useState("");

  const submit = async (value: string, keep = false) => {
    if (!value.trim() || sending) return;
    setSending(true);
    setFailure(null);
    const result = await addSubscriber(value, trap, keep);
    setSending(false);
    if (result.ok) setSubmitted(result.already ? "already" : "new");
    else setFailure(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(email);
  };

  const applySuggestion = (fixed: string) => {
    setEmail(fixed);
    submit(fixed);
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
          padding: "20px clamp(16px, 5vw, 48px)",
          fontSize: 13,
          letterSpacing: "0.02em",
        }}
      >
        <div className="header-nav-links" />

        <span className="header-brand" style={{ color: "var(--text)", fontWeight: 500, justifySelf: "center" }}>
          undefineddept.com
        </span>

        <div className="header-right" style={{ justifySelf: "end" }} />
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px 48px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div className="cs-logo" style={{ width: "min(560px, 88vw)" }}>
          <Image
            src="/images/undefined-dept-logo.png"
            alt="Undefined Department"
            width={1920}
            height={300}
            loading="eager"
            fetchPriority="high"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Headline */}
        <h1
          aria-label={HEADLINE}
          style={{
            margin: "36px 0 0",
            fontSize: "clamp(20px, 4.5vw, 32px)",
            fontWeight: 500,
            letterSpacing: "0.2em",
            marginRight: "-0.2em",
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
              {char === " " ? " " : char}
            </span>
          ))}
          <span className="cs-cursor" aria-hidden />
        </h1>

        <p
          className="cs-fade"
          style={{
            margin: "20px 0 0",
            maxWidth: 400,
            fontSize: 13,
            lineHeight: 1.7,
            color: "var(--text-muted)",
            animationDelay: "1.2s",
          }}
        >
          Essentials from Colombo that are built to last.
        </p>

        {/* Silhouette teaser */}
        <figure
          className="cs-fade"
          style={{ margin: "40px 0 0", width: "clamp(140px, 36vw, 200px)", animationDelay: "1.4s" }}
        >
          <div className="cs-silhouette" style={{ position: "relative", aspectRatio: "1 / 1" }}>
            <Image
              src="/images/silhouette-01.png"
              alt="Upcoming piece"
              fill
              sizes="200px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <figcaption style={{ marginTop: 12, fontSize: 11, letterSpacing: "0.04em", color: "var(--text-muted)" }}>
            UD-01 / ???
          </figcaption>
        </figure>

        {/* Signup */}
        <div className="cs-fade" style={{ marginTop: 40, width: "100%", maxWidth: 420, animationDelay: "1.6s" }}>
          {submitted ? (
            <div style={{ padding: "14px 0" }}>
              <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.02em", color: "var(--text)" }}>
                {submitted === "already" ? <>You&apos;re already on the list</> : <>You&apos;re on the list</>}
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
                We&apos;ll email you the moment Drop 01 goes live.
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 12, fontSize: 12, letterSpacing: "0.04em", color: "var(--text-muted)" }}>
                Be first in line
              </div>
              <form className="cs-form" onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
                <BotTrap value={trap} onChange={setTrap} />
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
                    height: 44,
                    padding: "0 14px",
                    border: "1px solid var(--border-light)",
                    borderRight: 0,
                    borderRadius: "6px 0 0 6px",
                    font: "400 13px 'IBM Plex Mono', monospace",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    height: 44,
                    padding: "0 20px",
                    border: 0,
                    borderRadius: "0 6px 6px 0",
                    background: "var(--btn-bg)",
                    color: "var(--btn-text)",
                    font: "500 12px 'IBM Plex Mono', monospace",
                    letterSpacing: "0.04em",
                    cursor: sending ? "wait" : "pointer",
                    opacity: sending ? 0.6 : 1,
                    whiteSpace: "nowrap",
                    transition: "opacity 0.15s",
                  }}
                >
                  {sending ? "Sending..." : "NOTIFY ME"}
                </button>
              </form>
              {failure && (
                <SignupError
                  error={failure.error}
                  suggestion={failure.suggestion}
                  onUseSuggestion={applySuggestion}
                  onKeep={() => submit(email, true)}
                  style={{ marginTop: 12 }}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Ticker */}
      <div
        aria-hidden
        style={{
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
          padding: "12px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: 11,
          letterSpacing: "0.08em",
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
          padding: "16px 16px 24px",
          display: "flex",
          justifyContent: "center",
          gap: 24,
          fontSize: 11,
          letterSpacing: "0.02em",
          color: "var(--text-muted)",
        }}
      >
        <span>&copy; {new Date().getFullYear()} Undefined Department</span>
      </footer>
    </div>
  );
}
