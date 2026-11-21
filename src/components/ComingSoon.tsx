"use client";

import Image from "next/image";
import SilkBackground from "@/components/SilkBackground";

const HEADLINE = "COMING SOON";

export default function ComingSoon() {
  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <SilkBackground />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px 180px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div className="cs-logo" style={{ width: "min(800px, 92vw)" }}>
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
            margin: "4px 0 0",
            fontSize: "clamp(18px, 3.5vw, 24px)",
            fontWeight: 400,
            letterSpacing: "0.3em",
            marginRight: "-0.3em",
            color: "#1a1714",
            textShadow: "0 1px 3px rgba(255,255,255,0.4)",
          }}
        >
          {HEADLINE.split("").map((char, i) => (
            <span
              key={i}
              aria-hidden
              className="cs-char"
              style={{ animationDelay: `${0.4 + i * 0.06}s` }}
            >
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
          <span className="cs-cursor" aria-hidden />
        </h1>

      </main>

      <footer
        className="footer-copy"
        style={{
          position: "relative",
          zIndex: 1,
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
