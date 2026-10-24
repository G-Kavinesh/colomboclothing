"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type PreorderStatus = "pending" | "verified" | "cancelled";

export type PreorderEntry = {
  id: string;
  productSlug: string;
  productName: string;
  size: string;
  price: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  status: PreorderStatus;
  createdAt: string;
};

type PreorderContextType = {
  preorders: PreorderEntry[];
  addPreorder: (entry: Omit<PreorderEntry, "id" | "status" | "createdAt">) => string;
  updateStatus: (id: string, status: PreorderStatus) => void;
  getPreorder: (id: string) => PreorderEntry | undefined;
  getPreordersByEmail: (email: string) => PreorderEntry[];
};

const PreorderContext = createContext<PreorderContextType | null>(null);

const STORAGE_KEY = "colombo-preorders";

function generateId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `PRE-${ts}-${rand}`;
}

export function PreorderProvider({ children }: { children: ReactNode }) {
  const [preorders, setPreorders] = useState<PreorderEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPreorders(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preorders));
    }
  }, [preorders, loaded]);

  const addPreorder = useCallback((entry: Omit<PreorderEntry, "id" | "status" | "createdAt">) => {
    const id = generateId();
    const newEntry: PreorderEntry = {
      ...entry,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setPreorders((prev) => [...prev, newEntry]);
    return id;
  }, []);

  const updateStatus = useCallback((id: string, status: PreorderStatus) => {
    setPreorders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }, []);

  const getPreorder = useCallback(
    (id: string) => preorders.find((p) => p.id === id),
    [preorders]
  );

  const getPreordersByEmail = useCallback(
    (email: string) => preorders.filter((p) => p.email.toLowerCase() === email.toLowerCase()),
    [preorders]
  );

  return (
    <PreorderContext.Provider value={{ preorders, addPreorder, updateStatus, getPreorder, getPreordersByEmail }}>
      {children}
    </PreorderContext.Provider>
  );
}

export function usePreorder() {
  const ctx = useContext(PreorderContext);
  if (!ctx) throw new Error("usePreorder must be used within PreorderProvider");
  return ctx;
}
