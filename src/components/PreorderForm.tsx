"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/lib/product-context";
import { formatPrice } from "@/lib/products";
import { usePreorder } from "@/lib/preorder-context";

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

export default function PreorderForm({ slug }: { slug: string }) {
  const { getProduct } = useProducts();
  const product = getProduct(slug);
  const searchParams = useSearchParams();
  const size = searchParams.get("size") || "";
  const { addPreorder } = usePreorder();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            PRODUCT NOT FOUND
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const id = addPreorder({
      productSlug: product.slug,
      productName: product.name,
      size,
      price: product.price,
      firstName: data.get("firstName") as string,
      lastName: data.get("lastName") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      address: data.get("address") as string,
      city: data.get("city") as string,
      postalCode: data.get("postalCode") as string,
    });

    setTimeout(() => {
      router.push(`/preorder/success?id=${id}`);
    }, 800);
  };

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
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "0.08em" }}>
          PREORDER
        </h1>

        {/* Product summary */}
        <div
          style={{
            marginTop: 32,
            width: "100%",
            maxWidth: 480,
            display: "flex",
            gap: 20,
            padding: "20px 0",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em" }}>
              {product.name}
            </div>
            <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
              SIZE: {size}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>
              {formatPrice(product.price)}
            </div>
            {product.preorderNote && (
              <div style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--text-muted)", marginTop: 4 }}>
                {product.preorderNote}
              </div>
            )}
          </div>
        </div>

        {/* Preorder form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 480,
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 4 }}>
            YOUR DETAILS
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
            <label style={labelStyle}>EMAIL</label>
            <input type="email" name="email" required style={inputStyle} placeholder="you@email.com" />
          </div>

          <div>
            <label style={labelStyle}>PHONE</label>
            <input type="tel" name="phone" required style={inputStyle} placeholder="+94 7X XXX XXXX" />
          </div>

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

          {/* Payment note */}
          <div
            style={{
              marginTop: 8,
              padding: "16px 0",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              fontSize: 12,
              letterSpacing: "0.06em",
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
                border: "2px solid var(--text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text)" }} />
            </span>
            CASH ON DELIVERY — {formatPrice(product.price)}
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
            {submitting ? "PLACING PREORDER..." : "CONFIRM PREORDER"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
