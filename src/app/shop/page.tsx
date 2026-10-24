import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = {
  title: "Shop — Colombo Clothing",
};

export default function ShopPage() {
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
          ALL PRODUCTS
        </h1>
        <div
          style={{
            marginTop: 48,
            width: "100%",
            maxWidth: products.length <= 2 ? 680 : 1100,
            display: products.length <= 2 ? "flex" : "grid",
            ...(products.length <= 2
              ? {
                  flexWrap: "wrap" as const,
                  justifyContent: "center",
                  gap: "48px 32px",
                }
              : {
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "48px 32px",
                }),
          }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="shop-product-card"
              style={{
                width: products.length <= 2 ? 280 : undefined,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
