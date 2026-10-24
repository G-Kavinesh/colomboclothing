"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 16,
        padding: "24px clamp(20px, 5vw, 64px)",
        fontSize: 13,
        letterSpacing: "0.08em",
      }}
    >
      <div style={{ justifySelf: "start", display: "flex", gap: 20 }}>
        <Link href="/shop" style={{ color: "#111", fontWeight: 400 }}>
          shop
        </Link>
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#111", fontWeight: 400 }}
        >
          instagram
        </a>
        <a
          href="https://tiktok.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#111", fontWeight: 400 }}
        >
          tiktok
        </a>
      </div>
      <Link href="/" style={{ color: "#111", fontWeight: 600 }}>
        colomboclothing.com
      </Link>
      <Link
        href="/cart"
        style={{
          color: "#111",
          justifySelf: "end",
          textDecoration: "none",
        }}
      >
        BAG ({totalItems})
      </Link>
    </header>
  );
}
