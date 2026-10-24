"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 20px 96px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          YOUR BAG
        </h1>

        {items.length === 0 ? (
          <div
            style={{
              marginTop: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ fontSize: 13, letterSpacing: "0.08em", color: "#6b6b6b" }}>
              YOUR BAG IS EMPTY
            </div>
            <Link
              href="/shop"
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "#111",
                borderBottom: "1px solid #111",
                paddingBottom: 2,
              }}
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: 680, marginTop: 40 }}>
            {/* Items */}
            {items.map((item) => (
              <div
                key={`${item.slug}-${item.size}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: 20,
                  padding: "24px 0",
                  borderBottom: "1px solid #ebe7de",
                  alignItems: "start",
                }}
              >
                {/* Image */}
                <Link href={`/shop/${item.slug}`}>
                  <div
                    style={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      mixBlendMode: "multiply",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain", filter: "brightness(1.06)" }}
                    />
                  </div>
                </Link>

                {/* Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Link
                    href={`/shop/${item.slug}`}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      color: "#111",
                    }}
                  >
                    {item.name}
                  </Link>
                  <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "#6b6b6b" }}>
                    SIZE: {item.size}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <button
                      onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid #d6d3cc",
                        background: "none",
                        cursor: "pointer",
                        font: "500 14px 'IBM Plex Mono', monospace",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      &minus;
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 500, minWidth: 20, textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid #d6d3cc",
                        background: "none",
                        cursor: "pointer",
                        font: "500 14px 'IBM Plex Mono', monospace",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.slug, item.size)}
                      style={{
                        border: 0,
                        background: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        color: "#6b6b6b",
                        marginLeft: 8,
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ fontSize: 13, fontWeight: 500, textAlign: "right" }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}

            {/* Totals */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "32px 0",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              <span>TOTAL</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Link
                href="/checkout"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: 400,
                  height: 48,
                  background: "#111",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                }}
              >
                CHECKOUT
              </Link>
              <Link
                href="/shop"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  color: "#6b6b6b",
                  borderBottom: "1px solid #d6d3cc",
                  paddingBottom: 2,
                }}
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
