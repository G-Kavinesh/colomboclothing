"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/lib/product-context";
import { formatPrice, imagesFor } from "@/lib/products";
import { placePreorder } from "@/lib/preorders";
import { BotTrap } from "@/components/SignupFields";

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

export default function PreorderForm({ slug }: { slug: string }) {
  const { getProduct } = useProducts();
  const product = getProduct(slug);
  const searchParams = useSearchParams();
  const size = searchParams.get("size") || "";
  const color = searchParams.get("color") || undefined;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [trap, setTrap] = useState("");

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.02em", color: "var(--text-muted)" }}>
            Product not found
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const image = imagesFor(product, color)[0];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const data = new FormData(e.currentTarget);

    const result = await placePreorder(
      {
        productSlug: product.slug,
        color,
        size,
        firstName: data.get("firstName") as string,
        lastName: data.get("lastName") as string,
        email: data.get("email") as string,
        phone: data.get("phone") as string,
        address: data.get("address") as string,
        city: data.get("city") as string,
        postalCode: data.get("postalCode") as string,
      },
      trap
    );

    if (result.ok) {
      router.push(`/preorder/success?id=${result.id}`);
      return;
    }
    setError(result.error);
    setSubmitting(false);
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
          padding: "40px 20px 48px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 500, letterSpacing: "0.02em" }}>
          Preorder
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
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>
              {product.name}
            </div>
            {color && (
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Colour: {color}
              </div>
            )}
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Size: {size}
            </div>
            <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4 }}>
              {formatPrice(product.price)}
            </div>
            {product.preorderNote && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
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
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.02em", marginBottom: 4 }}>
            Your details
          </div>

          <BotTrap value={trap} onChange={setTrap} />

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

          {/* Payment note */}
          <div
            style={{
              marginTop: 8,
              padding: "16px 0",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              fontSize: 12,
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
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text)" }} />
            </span>
            Cash on delivery — {formatPrice(product.price)}
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
            {submitting ? "Placing preorder..." : "CONFIRM PREORDER"}
          </button>

          {error && (
            <div role="alert" style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
              {error}
            </div>
          )}
        </form>
      </main>

      <Footer />
    </div>
  );
}
