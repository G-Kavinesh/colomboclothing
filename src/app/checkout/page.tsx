"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 12px",
  border: "1px solid var(--border-light)",
  borderRadius: 6,
  background: "transparent",
  font: "400 13px 'IBM Plex Mono', monospace",
  color: "var(--text)",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: "0.02em",
  color: "var(--text-muted)",
  marginBottom: 6,
  display: "block",
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      clearCart();
      router.push("/checkout/success");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 20px",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Nothing to checkout
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px 48px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 480,
            marginTop: 36,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.02em", marginBottom: 4 }}>
            Contact
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" required style={inputStyle} placeholder="you@email.com" />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type="tel" name="phone" required style={inputStyle} placeholder="+94 7X XXX XXXX" />
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.02em",
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            Shipping address
          </div>
          <div className="checkout-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>First name</label>
              <input type="text" name="firstName" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last name</label>
              <input type="text" name="lastName" required style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Address</label>
            <input type="text" name="address" required style={inputStyle} />
          </div>
          <div className="checkout-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>City</label>
              <input type="text" name="city" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Postal code</label>
              <input type="text" name="postalCode" required style={inputStyle} />
            </div>
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.02em",
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            Payment
          </div>
          <div
            style={{
              padding: "16px 0",
              fontSize: 13,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "1.5px solid var(--text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--text)",
                }}
              />
            </span>
            Cash on delivery
          </div>

          {/* Order Summary */}
          <div
            style={{
              marginTop: 16,
              padding: "24px 0",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.02em",
                marginBottom: 16,
              }}
            >
              Order summary
            </div>
            {items.map((item) => (
              <div
                key={`${item.slug}-${item.size}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                <span>
                  {item.name} ({item.size}) &times; {item.quantity}
                </span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
              }}
            >
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 15,
                fontWeight: 500,
                marginTop: 16,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              height: 48,
              border: 0,
              borderRadius: 6,
              background: submitting ? "var(--text-muted)" : "var(--btn-bg)",
              color: "var(--btn-text)",
              font: "500 13px 'IBM Plex Mono', monospace",
              letterSpacing: "0.04em",
              cursor: submitting ? "default" : "pointer",
              marginTop: 8,
              transition: "background 0.15s",
            }}
          >
            {submitting ? "Processing..." : "PLACE ORDER"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
