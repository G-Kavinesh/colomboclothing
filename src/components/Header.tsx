"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { totalItems } = useCart();
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
        padding: "20px clamp(16px, 5vw, 48px)",
        fontSize: 13,
        letterSpacing: "0.02em",
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
          style={{ color: "var(--text-muted)", fontWeight: 400 }}
        >
          Instagram
        </a>
        <a
          href="https://tiktok.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text-muted)", fontWeight: 400 }}
        >
          TikTok
        </a>
      </div>

      {/* Mobile: hidden placeholder to keep grid intact */}
      <div
        className="header-nav-links-mobile"
        style={{ justifySelf: "start", display: "none" }}
      />

      <Link
        href="/"
        className="header-brand"
        style={{ color: "var(--text)", fontWeight: 500, justifySelf: "center" }}
      >
        undefineddept.com
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
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Bag ({totalItems})
        </Link>
      </div>
    </header>
  );
}
