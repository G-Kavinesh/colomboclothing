"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeGuide from "@/components/SizeGuide";
import AddToBag from "@/components/AddToBag";
import { useCart } from "@/lib/cart-context";
import { getProduct, formatPrice } from "@/lib/products";

export default function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { addItem } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!product) {
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
          <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "0.06em" }}>
            PRODUCT NOT FOUND
          </h1>
          <Link
            href="/shop"
            style={{
              marginTop: 24,
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--text)",
              borderBottom: "1px solid var(--text)",
              paddingBottom: 2,
            }}
          >
            BACK TO SHOP
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const imgs = product.images;
  const prev = () => setImageIndex((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setImageIndex((i) => (i + 1) % imgs.length);

  const addToBag = useCallback(() => {
    if (!selectedSize) {
      setStatus("SELECT A SIZE");
      return false;
    }
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0].src,
    });
    setStatus(`ADDED — SIZE ${selectedSize}`);
    return true;
  }, [selectedSize, addItem, product]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 20px 48px",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            marginBottom: 24,
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
          }}
        >
          <Link href="/shop" style={{ color: "var(--text-muted)" }}>
            SHOP
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--text)" }}>{product.name}</span>
        </div>

        {/* Image Carousel */}
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            display: "grid",
            gridTemplateColumns: "48px minmax(0, 1fr) 48px",
            alignItems: "center",
            gap: 16,
          }}
        >
          <button
            onClick={prev}
            aria-label="Previous image"
            style={{
              width: 48,
              height: 48,
              border: 0,
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderLeft: "2.5px solid var(--text)",
                borderBottom: "2.5px solid var(--text)",
                transform: "rotate(45deg)",
                marginLeft: 6,
              }}
            />
          </button>

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 620,
              aspectRatio: "1 / 1",
              justifySelf: "center",
              isolation: "isolate",
            }}
          >
            {imgs.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: imageIndex === idx ? 1 : 0,
                  transition: "opacity 0.3s",
                  pointerEvents: imageIndex === idx ? "auto" : "none",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  style={{ objectFit: "contain" }}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next image"
            style={{
              width: 48,
              height: 48,
              border: 0,
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRight: "2.5px solid var(--text)",
                borderTop: "2.5px solid var(--text)",
                transform: "rotate(45deg)",
                marginRight: 6,
              }}
            />
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          {imgs.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setImageIndex(idx)}
              aria-label={`Image ${idx + 1}`}
              style={{
                width: 7,
                height: 7,
                padding: 0,
                border: 0,
                borderRadius: "50%",
                cursor: "pointer",
                background: idx === imageIndex ? "var(--text)" : "var(--dot-inactive)",
              }}
            />
          ))}
        </div>

        <h1
          style={{
            margin: "56px 0 0",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          {product.name}
        </h1>

        <div style={{ marginTop: 28, fontSize: 18, fontWeight: 500 }}>
          {formatPrice(product.price)}
        </div>

        <p
          style={{
            marginTop: 20,
            maxWidth: 480,
            fontSize: 13,
            lineHeight: 1.7,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          {product.description}
        </p>

        {/* Size Selector */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 36,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {product.sizes.map((size) => {
            const isSelected = size === selectedSize;
            return (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setStatus("");
                }}
                style={{
                  minWidth: 48,
                  height: 44,
                  padding: "0 12px",
                  font: "500 13px 'IBM Plex Mono', monospace",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  border: isSelected ? "1px solid var(--btn-bg)" : "1px solid var(--border-light)",
                  background: isSelected ? "var(--btn-bg)" : "transparent",
                  color: isSelected ? "var(--btn-text)" : "var(--text)",
                }}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Size Guide Link */}
        <button
          onClick={() => setSizeGuideOpen(true)}
          style={{
            marginTop: 20,
            border: 0,
            background: "none",
            cursor: "pointer",
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            borderBottom: "1px solid var(--border-light)",
            paddingBottom: 2,
            font: "400 12px 'IBM Plex Mono', monospace",
          }}
        >
          SIZE GUIDE
        </button>

        <AddToBag onAdd={addToBag} statusText={status} />

        <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      </main>

      <Footer />
    </div>
  );
}
