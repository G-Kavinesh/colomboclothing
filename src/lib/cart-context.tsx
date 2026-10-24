"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "colombo-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.slug === item.slug && i.size === item.size);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const updateQuantity = useCallback((slug: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.slug === slug && i.size === size ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
