"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeGuide from "@/components/SizeGuide";
import AddToBag from "@/components/AddToBag";
import { useCart } from "@/lib/cart-context";
import { useProducts } from "@/lib/product-context";
import { formatPrice, imagesFor } from "@/lib/products";

export default function ProductDetail({ slug, featured = false }: { slug: string; featured?: boolean }) {
  const { getProduct } = useProducts();
  const product = getProduct(slug);
  const { addItem } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(product?.colors?.[0].name);
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
          <h1 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "0.02em" }}>
            Product not found
          </h1>
          <Link
            href="/"
            style={{
              marginTop: 24,
              fontSize: 13,
              letterSpacing: "0.02em",
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: 2,
            }}
          >
            Back to home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const imgs = imagesFor(product, color);
  const prev = () => setImageIndex((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setImageIndex((i) => (i + 1) % imgs.length);

  const addToBag = useCallback(() => {
    if (!selectedSize) {
      setStatus("Select a size");
      return false;
    }
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: imgs[0].src,
    });
    setStatus(`Added — size ${selectedSize}`);
    return true;
  }, [selectedSize, addItem, product, imgs]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Breadcrumb */}
        {!featured && (
          <div
            style={{
              width: "100%",
              maxWidth: 1100,
              padding: "0 20px",
              marginBottom: 8,
              fontSize: 12,
              letterSpacing: "0.02em",
              color: "var(--text-muted)",
            }}
          >
            <Link href="/" style={{ color: "var(--text-muted)" }}>
              Home
            </Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--text)" }}>{product.name}</span>
          </div>
        )}

        <div className="product-detail-grid">
          {/* Left column: image carousel */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "44px minmax(0, 1fr) 44px",
                alignItems: "center",
                gap: 8,
              }}
            >
              <button
                onClick={prev}
                aria-label="Previous image"
                style={{
                  width: 44,
                  height: 44,
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
                    width: 10,
                    height: 10,
                    borderLeft: "1.5px solid var(--text-muted)",
                    borderBottom: "1.5px solid var(--text-muted)",
                    transform: "rotate(45deg)",
                    marginLeft: 4,
                  }}
                />
              </button>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: product.imageRatio ? 460 : 620,
                  aspectRatio: product.imageRatio ?? "1 / 1",
                  justifySelf: "center",
                  isolation: "isolate",
                }}
              >
                {imgs.map((img, idx) => (
                  <div
                    key={img.src}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: imageIndex === idx ? 1 : 0,
                      transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
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
                  width: 44,
                  height: 44,
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
                    width: 10,
                    height: 10,
                    borderRight: "1.5px solid var(--text-muted)",
                    borderTop: "1.5px solid var(--text-muted)",
                    transform: "rotate(45deg)",
                    marginRight: 4,
                  }}
                />
              </button>
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              {imgs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  aria-label={`Image ${idx + 1}`}
                  style={{
                    width: 6,
                    height: 6,
                    padding: 0,
                    border: 0,
                    borderRadius: "50%",
                    cursor: "pointer",
                    background: idx === imageIndex ? "var(--text)" : "var(--dot-inactive)",
                    transition: "background 0.15s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right column: product info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              paddingTop: 8,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              {product.name}
            </h1>

            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 400 }}>
              {formatPrice(product.price)}
            </div>

            <p
              style={{
                marginTop: 20,
                maxWidth: 400,
                fontSize: 13,
                lineHeight: 1.7,
                color: "var(--text-muted)",
              }}
            >
              {product.description}
            </p>

            {/* Colour Selector */}
            {product.colors && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
                <div style={{ fontSize: 12, letterSpacing: "0.02em", color: "var(--text-muted)" }}>
                  Colour — <span style={{ color: "var(--text)" }}>{color}</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  {product.colors.map((c) => {
                    const isSelected = c.name === color;
                    return (
                      <button
                        key={c.name}
                        onClick={() => {
                          setColor(c.name);
                          setImageIndex(0);
                        }}
                        aria-label={c.name}
                        aria-pressed={isSelected}
                        style={{
                          width: 32,
                          height: 32,
                          padding: 3,
                          borderRadius: "50%",
                          cursor: "pointer",
                          background: "transparent",
                          border: isSelected ? "1.5px solid var(--text)" : "1.5px solid transparent",
                          transition: "border-color 0.15s",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: c.swatch,
                            boxShadow: "inset 0 0 0 1px var(--border-light)",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: product.colors ? 24 : 32,
                flexWrap: "wrap",
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
                      font: "400 13px 'IBM Plex Mono', monospace",
                      letterSpacing: "0.02em",
                      cursor: "pointer",
                      borderRadius: 6,
                      border: isSelected ? "1px solid var(--text)" : "1px solid var(--border-light)",
                      background: isSelected ? "var(--btn-bg)" : "transparent",
                      color: isSelected ? "var(--btn-text)" : "var(--text)",
                      transition: "background 0.15s, border-color 0.15s, color 0.15s",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Size Guide Link */}
            {product.category === "TEES" && (
              <button
                onClick={() => setSizeGuideOpen(true)}
                style={{
                  marginTop: 16,
                  border: 0,
                  background: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.02em",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--border-light)",
                  paddingBottom: 2,
                  font: "400 12px 'IBM Plex Mono', monospace",
                }}
              >
                Size guide
              </button>
            )}

            {product.preorder ? (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 24, width: "100%" }}>
                {product.preorderNote && (
                  <div style={{ fontSize: 12, letterSpacing: "0.02em", color: "var(--text-muted)", marginBottom: 16 }}>
                    {product.preorderNote}
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!selectedSize) {
                      setStatus("Select a size");
                      return;
                    }
                    const params = new URLSearchParams({ size: selectedSize, ...(color && { color }) });
                    router.push(`/preorder/${product.slug}?${params}`);
                  }}
                  style={{
                    width: "100%",
                    maxWidth: 280,
                    height: 48,
                    border: 0,
                    borderRadius: 6,
                    background: "var(--btn-bg)",
                    color: "var(--btn-text)",
                    font: "500 13px 'IBM Plex Mono', monospace",
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    transition: "opacity 0.15s",
                  }}
                >
                  PREORDER
                </button>
                <div
                  style={{
                    minHeight: status ? 18 : 0,
                    marginTop: status ? 8 : 0,
                    fontSize: 12,
                    letterSpacing: "0.02em",
                    color: "var(--text-muted)",
                  }}
                >
                  {status}
                </div>
              </div>
            ) : (
              <AddToBag onAdd={addToBag} statusText={status} />
            )}
          </div>
        </div>

        <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      </main>

      <Footer />
    </div>
  );
}
