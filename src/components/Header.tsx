"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";

export default function Header() {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [bumping, setBumping] = useState(false);
  const bagRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleAdded = () => {
      setBumping(true);
      setTimeout(() => setBumping(false), 500);
    };
    window.addEventListener("bag-item-added", handleAdded);
    return () => window.removeEventListener("bag-item-added", handleAdded);
  }, []);

  return (
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
      {/* Desktop nav links */}
      <div
        className="header-nav-links"
        style={{ justifySelf: "start", display: "flex", gap: 20 }}
      >
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text)", fontWeight: 400 }}
        >
          instagram
        </a>
        <a
          href="https://tiktok.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text)", fontWeight: 400 }}
        >
          tiktok
        </a>
      </div>

      {/* Mobile: hidden placeholder to keep grid intact — shop moved to right side */}
      <div
        className="header-nav-links-mobile"
        style={{ justifySelf: "start", display: "none" }}
      />

      <Link
        href="/"
        className="header-brand"
        style={{ color: "var(--text)", fontWeight: 600, justifySelf: "center" }}
      >
        colomboclothing.com
      </Link>

      <div
        className="header-right"
        style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}
      >
        <Link
          ref={bagRef}
          href="/cart"
          className={bumping ? "bag-bump" : ""}
          style={{
            color: "var(--text)",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          bag ({totalItems})
        </Link>
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
            flexShrink: 0,
          }}
        />
      </div>
    </header>
  );
}
