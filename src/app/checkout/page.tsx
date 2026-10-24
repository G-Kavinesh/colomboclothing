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
  background: "transparent",
  font: "400 13px 'IBM Plex Mono', monospace",
  letterSpacing: "0.04em",
  color: "var(--text)",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.08em",
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

    // Simulate order processing
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
          <div style={{ fontSize: 13, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            NOTHING TO CHECKOUT
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
          padding: "48px 20px 48px",
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
          CHECKOUT
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 480,
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Contact */}
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 4 }}>
            CONTACT
          </div>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input type="email" name="email" required style={inputStyle} placeholder="you@email.com" />
          </div>
          <div>
            <label style={labelStyle}>PHONE</label>
            <input type="tel" name="phone" required style={inputStyle} placeholder="+94 7X XXX XXXX" />
          </div>

          {/* Shipping */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            SHIPPING ADDRESS
          </div>
          <div className="checkout-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>FIRST NAME</label>
              <input type="text" name="firstName" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>LAST NAME</label>
              <input type="text" name="lastName" required style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>ADDRESS</label>
            <input type="text" name="address" required style={inputStyle} />
          </div>
          <div className="checkout-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>CITY</label>
              <input type="text" name="city" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>POSTAL CODE</label>
              <input type="text" name="postalCode" required style={inputStyle} />
            </div>
          </div>

          {/* Payment */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            PAYMENT
          </div>
          <div>
            <label style={labelStyle}>CARD NUMBER</label>
            <input type="text" name="cardNumber" required style={inputStyle} placeholder="XXXX XXXX XXXX XXXX" />
          </div>
          <div className="checkout-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>EXPIRY</label>
              <input type="text" name="expiry" required style={inputStyle} placeholder="MM / YY" />
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input type="text" name="cvv" required style={inputStyle} placeholder="XXX" />
            </div>
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
                fontWeight: 600,
                letterSpacing: "0.06em",
                marginBottom: 16,
              }}
            >
              ORDER SUMMARY
            </div>
            {items.map((item) => (
              <div
                key={`${item.slug}-${item.size}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                <span>
                  {item.name} ({item.size}) &times; {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
              }}
            >
              <span>SHIPPING</span>
              <span>FREE</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.06em",
                marginTop: 16,
              }}
            >
              <span>TOTAL</span>
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
              background: submitting ? "var(--text-muted)" : "var(--btn-bg)",
              color: "var(--btn-text)",
              font: "500 13px 'IBM Plex Mono', monospace",
              letterSpacing: "0.08em",
              cursor: submitting ? "default" : "pointer",
              marginTop: 8,
            }}
          >
            {submitting ? "PROCESSING..." : "PLACE ORDER"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
