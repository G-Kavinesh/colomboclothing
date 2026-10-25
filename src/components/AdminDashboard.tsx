"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePreorder, PreorderStatus } from "@/lib/preorder-context";
import { useProducts } from "@/lib/product-context";
import { Product, formatPrice } from "@/lib/products";
import {
  verifyPassword,
  isSessionValid,
  refreshSession,
  logout,
  isLockedOut,
  getRemainingAttempts,
} from "@/lib/admin-auth";

type Tab = "overview" | "preorders" | "products" | "subscribers";

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

const statusColors: Record<PreorderStatus, string> = {
  pending: "#e2a832",
  verified: "#34a853",
  cancelled: "#ea4335",
};

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  // Check existing session on mount
  useEffect(() => {
    if (isSessionValid()) {
      setAuthenticated(true);
      refreshSession();
    }
    setLoading(false);
  }, []);

  // Session refresh on activity
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        setAuthenticated(false);
        setError("SESSION EXPIRED");
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await verifyPassword(password);
    if (result.success) {
      setAuthenticated(true);
      setPassword("");
    } else {
      setError(result.error || "INCORRECT PASSWORD");
      setPassword("");
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setPassword("");
    setError("");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            LOADING...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen password={password} setPassword={setPassword} error={error} onSubmit={handleLogin} />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px 48px" }}>
        {/* Top bar */}
        <div style={{ width: "100%", maxWidth: 900, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "0.08em" }}>
            DASHBOARD
          </h1>
          <button onClick={handleLogout} style={{ padding: "6px 16px", border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-muted)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
            LOGOUT
          </button>
        </div>

        {/* Tabs */}
        <div style={{ width: "100%", maxWidth: 900, display: "flex", gap: 0, marginTop: 28, borderBottom: "1px solid var(--border)" }}>
          {(["overview", "preorders", "products", "subscribers"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); refreshSession(); }}
              style={{
                padding: "12px 24px",
                border: 0,
                borderBottom: tab === t ? "2px solid var(--text)" : "2px solid transparent",
                background: "transparent",
                color: tab === t ? "var(--text)" : "var(--text-muted)",
                font: "500 12px 'IBM Plex Mono', monospace",
                letterSpacing: "0.08em",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ width: "100%", maxWidth: 900, marginTop: 24 }}>
          {tab === "overview" && <OverviewTab />}
          {tab === "preorders" && <PreordersTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "subscribers" && <SubscribersTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ─── Login Screen ─── */
function LoginScreen({ password, setPassword, error, onSubmit }: {
  password: string;
  setPassword: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const lockout = isLockedOut();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!lockout.locked) return;
    setCountdown(Math.ceil(lockout.remainingMs / 1000));
    const interval = setInterval(() => {
      const check = isLockedOut();
      if (!check.locked) {
        setCountdown(0);
        clearInterval(interval);
      } else {
        setCountdown(Math.ceil(check.remainingMs / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockout.locked, lockout.remainingMs]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid var(--text)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={lockout.locked}
            style={{ ...inputStyle, opacity: lockout.locked ? 0.5 : 1 }}
          />
          <button
            type="submit"
            disabled={lockout.locked}
            style={{
              width: "100%",
              height: 44,
              border: 0,
              background: lockout.locked ? "var(--text-muted)" : "var(--btn-bg)",
              color: "var(--btn-text)",
              font: "500 13px 'IBM Plex Mono', monospace",
              letterSpacing: "0.08em",
              cursor: lockout.locked ? "default" : "pointer",
            }}
          >
            {lockout.locked ? `LOCKED (${countdown}s)` : "ENTER"}
          </button>
          {error && (
            <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#ea4335", textAlign: "center" }}>
              {error}
            </div>
          )}
          {!lockout.locked && getRemainingAttempts() < MAX_DISPLAY_ATTEMPTS && (
            <div style={{ fontSize: 10, letterSpacing: "0.06em", color: "var(--text-muted)", textAlign: "center" }}>
              {getRemainingAttempts()} ATTEMPTS REMAINING
            </div>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}

const MAX_DISPLAY_ATTEMPTS = 5;

/* ─── Overview Tab ─── */
function OverviewTab() {
  const { preorders } = usePreorder();
  const { products } = useProducts();

  const pending = preorders.filter((p) => p.status === "pending").length;
  const verified = preorders.filter((p) => p.status === "verified").length;
  const cancelled = preorders.filter((p) => p.status === "cancelled").length;
  const totalRevenue = preorders
    .filter((p) => p.status === "verified")
    .reduce((sum, p) => sum + p.price, 0);
  const pendingRevenue = preorders
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.price, 0);

  const recentOrders = preorders.slice().reverse().slice(0, 5);

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        <StatCard label="TOTAL PREORDERS" value={preorders.length.toString()} />
        <StatCard label="PENDING" value={pending.toString()} color="#e2a832" />
        <StatCard label="VERIFIED" value={verified.toString()} color="#34a853" />
        <StatCard label="CANCELLED" value={cancelled.toString()} color="#ea4335" />
        <StatCard label="VERIFIED REVENUE" value={formatPrice(totalRevenue)} color="#34a853" />
        <StatCard label="PENDING REVENUE" value={formatPrice(pendingRevenue)} color="#e2a832" />
        <StatCard label="TOTAL PRODUCTS" value={products.length.toString()} />
        <StatCard label="PREORDER ITEMS" value={products.filter((p) => p.preorder).length.toString()} />
      </div>

      {/* Recent orders */}
      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 16 }}>
          RECENT PREORDERS
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ padding: "24px 0", fontSize: 12, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            NO PREORDERS YET
          </div>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order.id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                fontSize: 12,
                letterSpacing: "0.04em",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600 }}>{order.id}</span>
                <span style={{ color: "var(--text-muted)" }}>{order.firstName} {order.lastName}</span>
                <span style={{ color: "var(--text-muted)" }}>{order.productName} / {order.size}</span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: statusColors[order.status],
                  padding: "3px 8px",
                  border: `1px solid ${statusColors[order.status]}`,
                }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: "20px 16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "var(--text-muted)" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.04em", color: color || "var(--text)" }}>{value}</div>
    </div>
  );
}

/* ─── Preorders Tab ─── */
function PreordersTab() {
  const { preorders, updateStatus } = usePreorder();
  const [filter, setFilter] = useState<PreorderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = (filter === "all" ? preorders : preorders.filter((p) => p.status === filter))
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    });

  const counts = {
    all: preorders.length,
    pending: preorders.filter((p) => p.status === "pending").length,
    verified: preorders.filter((p) => p.status === "verified").length,
    cancelled: preorders.filter((p) => p.status === "cancelled").length,
  };

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, phone, or ID..."
        style={{ ...inputStyle, maxWidth: 400, marginBottom: 20 }}
      />

      {/* Filter buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {(["all", "pending", "verified", "cancelled"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: "8px 16px",
              border: filter === key ? "1px solid var(--text)" : "1px solid var(--border-light)",
              background: filter === key ? "var(--btn-bg)" : "transparent",
              color: filter === key ? "var(--btn-text)" : "var(--text-muted)",
              font: "500 11px 'IBM Plex Mono', monospace",
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            {key.toUpperCase()} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Preorder list */}
      {filtered.length === 0 ? (
        <div style={{ padding: "48px 0", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          NO PREORDERS FOUND
        </div>
      ) : (
        filtered
          .slice()
          .reverse()
          .map((order) => (
            <div key={order.id} style={{ padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em" }}>{order.id}</div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: statusColors[order.status],
                    padding: "4px 10px",
                    border: `1px solid ${statusColors[order.status]}`,
                  }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", fontSize: 12, letterSpacing: "0.04em" }}>
                <div><span style={{ color: "var(--text-muted)" }}>PRODUCT </span><span>{order.productName}</span></div>
                <div><span style={{ color: "var(--text-muted)" }}>SIZE </span><span>{order.size}</span></div>
                <div><span style={{ color: "var(--text-muted)" }}>NAME </span><span>{order.firstName} {order.lastName}</span></div>
                <div><span style={{ color: "var(--text-muted)" }}>PRICE </span><span>{formatPrice(order.price)}</span></div>
                <div><span style={{ color: "var(--text-muted)" }}>EMAIL </span><span>{order.email}</span></div>
                <div><span style={{ color: "var(--text-muted)" }}>PHONE </span><span>{order.phone}</span></div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ color: "var(--text-muted)" }}>ADDRESS </span>
                  <span>{order.address}, {order.city} {order.postalCode}</span>
                </div>
                <div><span style={{ color: "var(--text-muted)" }}>DATE </span><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
              </div>

              {order.status === "pending" && (
                <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                  <button onClick={() => updateStatus(order.id, "verified")} style={{ padding: "8px 20px", border: 0, background: "#34a853", color: "#fff", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
                    VERIFY
                  </button>
                  <button onClick={() => updateStatus(order.id, "cancelled")} style={{ padding: "8px 20px", border: "1px solid #ea4335", background: "transparent", color: "#ea4335", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
                    CANCEL
                  </button>
                </div>
              )}
              {order.status === "cancelled" && (
                <div style={{ marginTop: 16 }}>
                  <button onClick={() => updateStatus(order.id, "pending")} style={{ padding: "8px 20px", border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-muted)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
                    RESTORE
                  </button>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab() {
  const { products, updateProduct, deleteProduct } = useProducts();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 24 }}>
        {products.length} PRODUCT{products.length !== 1 ? "S" : ""}
      </div>

      {products.map((product) => (
        <div key={product.slug} style={{ padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
          {editingSlug === product.slug ? (
            <ProductEditor
              product={product}
              onSave={(updates) => {
                updateProduct(product.slug, updates);
                setEditingSlug(null);
              }}
              onCancel={() => setEditingSlug(null)}
            />
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em" }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.04em", marginTop: 4 }}>
                    /{product.slug}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {product.preorder && (
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#e2a832", padding: "3px 8px", border: "1px solid #e2a832" }}>
                      PREORDER
                    </span>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{formatPrice(product.price)}</span>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontSize: 12, letterSpacing: "0.04em" }}>
                <div><span style={{ color: "var(--text-muted)" }}>CATEGORY </span>{product.category}</div>
                <div><span style={{ color: "var(--text-muted)" }}>SIZES </span>{product.sizes.join(", ")}</div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ color: "var(--text-muted)" }}>DESCRIPTION </span>
                  <span>{product.description.length > 100 ? product.description.slice(0, 100) + "..." : product.description}</span>
                </div>
                {product.preorderNote && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ color: "var(--text-muted)" }}>PREORDER NOTE </span>{product.preorderNote}
                  </div>
                )}
                <div><span style={{ color: "var(--text-muted)" }}>IMAGES </span>{product.images.length}</div>
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button
                  onClick={() => setEditingSlug(product.slug)}
                  style={{ padding: "8px 20px", border: "1px solid var(--text)", background: "transparent", color: "var(--text)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}
                >
                  EDIT
                </button>
                <button
                  onClick={() => updateProduct(product.slug, { preorder: !product.preorder })}
                  style={{ padding: "8px 20px", border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-muted)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}
                >
                  {product.preorder ? "DISABLE PREORDER" : "ENABLE PREORDER"}
                </button>
                {confirmDelete === product.slug ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#ea4335", letterSpacing: "0.06em" }}>CONFIRM?</span>
                    <button onClick={() => { deleteProduct(product.slug); setConfirmDelete(null); }} style={{ padding: "8px 16px", border: 0, background: "#ea4335", color: "#fff", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
                      YES
                    </button>
                    <button onClick={() => setConfirmDelete(null)} style={{ padding: "8px 16px", border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-muted)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
                      NO
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(product.slug)} style={{ padding: "8px 20px", border: "1px solid #ea4335", background: "transparent", color: "#ea4335", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
                    DELETE
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Product Editor ─── */
function ProductEditor({ product, onSave, onCancel }: {
  product: Product;
  onSave: (updates: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [sizes, setSizes] = useState(product.sizes.join(", "));
  const [preorder, setPreorder] = useState(product.preorder || false);
  const [preorderNote, setPreorderNote] = useState(product.preorderNote || "");

  const handleSave = () => {
    onSave({
      name,
      price: parseInt(price) || product.price,
      category,
      description,
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      preorder,
      preorderNote: preorderNote || undefined,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>
        EDITING: {product.slug}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>NAME</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>PRICE (LKR)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>CATEGORY</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>SIZES (comma separated)</label>
          <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, height: "auto", padding: "12px", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <label style={{ ...labelStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={preorder}
            onChange={(e) => setPreorder(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "var(--text)" }}
          />
          PREORDER MODE
        </label>
      </div>

      {preorder && (
        <div>
          <label style={labelStyle}>PREORDER NOTE</label>
          <input
            type="text"
            value={preorderNote}
            onChange={(e) => setPreorderNote(e.target.value)}
            placeholder="e.g. Expected dispatch: 2-3 weeks"
            style={inputStyle}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={handleSave} style={{ padding: "8px 24px", border: 0, background: "var(--btn-bg)", color: "var(--btn-text)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
          SAVE CHANGES
        </button>
        <button onClick={onCancel} style={{ padding: "8px 24px", border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-muted)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}

/* ─── Subscribers Tab ─── */
function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("colombo-subscribers");
      if (stored) setSubscribers(JSON.parse(stored));
    } catch {}
  }, []);

  const copyAll = () => {
    const text = subscribers.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const removeSubscriber = (email: string) => {
    const updated = subscribers.filter((s) => s !== email);
    setSubscribers(updated);
    localStorage.setItem("colombo-subscribers", JSON.stringify(updated));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--text-muted)" }}>
          {subscribers.length} SUBSCRIBER{subscribers.length !== 1 ? "S" : ""}
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={copyAll}
            style={{ padding: "8px 16px", border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-muted)", font: "500 11px 'IBM Plex Mono', monospace", letterSpacing: "0.08em", cursor: "pointer" }}
          >
            {copied ? "COPIED" : "COPY ALL EMAILS"}
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div style={{ padding: "48px 0", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          NO SUBSCRIBERS YET
        </div>
      ) : (
        subscribers.map((email) => (
          <div
            key={email}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              letterSpacing: "0.04em",
            }}
          >
            <span>{email}</span>
            <button
              onClick={() => removeSubscriber(email)}
              style={{ border: 0, background: "none", color: "var(--text-muted)", font: "400 11px 'IBM Plex Mono', monospace", cursor: "pointer", letterSpacing: "0.06em" }}
            >
              REMOVE
            </button>
          </div>
        ))
      )}
    </div>
  );
}
