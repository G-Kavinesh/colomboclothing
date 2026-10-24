"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { products as defaultProducts, Product } from "./products";

type ProductContextType = {
  products: Product[];
  updateProduct: (slug: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (slug: string) => void;
  getProduct: (slug: string) => Product | undefined;
  resetProducts: () => void;
};

const ProductContext = createContext<ProductContextType | null>(null);

const STORAGE_KEY = "colombo-products";

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        // Merge: use stored data but ensure default products exist
        const merged = defaultProducts.map((dp) => {
          const override = parsed.find((p) => p.slug === dp.slug);
          return override || dp;
        });
        // Add any extra products that were added via admin
        const extras = parsed.filter(
          (p) => !defaultProducts.some((dp) => dp.slug === p.slug)
        );
        setProducts([...merged, ...extras]);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, loaded]);

  const updateProduct = useCallback((slug: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, ...updates } : p))
    );
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      if (prev.some((p) => p.slug === product.slug)) return prev;
      return [...prev, product];
    });
  }, []);

  const deleteProduct = useCallback((slug: string) => {
    setProducts((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const getProduct = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const resetProducts = useCallback(() => {
    setProducts(defaultProducts);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ProductContext.Provider value={{ products, updateProduct, addProduct, deleteProduct, getProduct, resetProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
