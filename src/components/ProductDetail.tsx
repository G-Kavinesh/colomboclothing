"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeGuide from "@/components/SizeGuide";
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
              color: "#111",
              borderBottom: "1px solid #111",
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

  const addToBag = () => {
    if (!selectedSize) {
      setStatus("SELECT A SIZE");
      return;
    }
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0].src,
    });
    setStatus(`ADDED — SIZE ${selectedSize}`);
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
          padding: "24px 20px 96px",
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
            color: "#6b6b6b",
          }}
        >
          <Link href="/shop" style={{ color: "#6b6b6b" }}>
            SHOP
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#111" }}>{product.name}</span>
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
                borderLeft: "2.5px solid #111",
                borderBottom: "2.5px solid #111",
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
              mixBlendMode: "multiply",
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
                  filter: "brightness(1.06)",
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
                borderRight: "2.5px solid #111",
                borderTop: "2.5px solid #111",
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
                background: idx === imageIndex ? "#111" : "#cfcfcf",
              }}
            />
          ))}
        </div>

        <h1
          style={{
            margin: "44px 0 0",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          {product.name}
        </h1>

        <div style={{ marginTop: 20, fontSize: 18, fontWeight: 500 }}>
          {formatPrice(product.price)}
        </div>

        <p
          style={{
            marginTop: 20,
            maxWidth: 480,
            fontSize: 13,
            lineHeight: 1.7,
            color: "#6b6b6b",
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
            marginTop: 28,
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
                  border: `1px solid ${isSelected ? "#111" : "#d6d3cc"}`,
                  background: isSelected ? "#111" : "transparent",
                  color: isSelected ? "#fff" : "#111",
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
            marginTop: 12,
            border: 0,
            background: "none",
            cursor: "pointer",
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "#6b6b6b",
            borderBottom: "1px solid #d6d3cc",
            paddingBottom: 2,
            font: "400 12px 'IBM Plex Mono', monospace",
          }}
        >
          SIZE GUIDE
        </button>

        {/* Add to Bag */}
        <button
          onClick={addToBag}
          aria-label="Add to bag"
          style={{
            marginTop: 24,
            width: 56,
            height: 56,
            border: 0,
            background: "none",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 30,
              height: 2.5,
              background: "#111",
              transform: "translate(-50%, -50%)",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 2.5,
              height: 30,
              background: "#111",
              transform: "translate(-50%, -50%)",
            }}
          />
        </button>

        <div
          style={{
            height: 20,
            marginTop: 6,
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "#6b6b6b",
          }}
        >
          {status}
        </div>

        <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      </main>

      <Footer />
    </div>
  );
}
