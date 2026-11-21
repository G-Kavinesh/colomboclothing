"use client";

import { useEffect, useRef } from "react";

const MEASUREMENTS = [
  { size: "S", chest: "106", length: "70", shoulder: "54" },
  { size: "M", chest: "112", length: "72", shoulder: "56" },
  { size: "L", chest: "118", length: "74", shoulder: "58" },
  { size: "XL", chest: "124", length: "76", shoulder: "60" },
  { size: "XXL", chest: "130", length: "78", shoulder: "62" },
];

const cellStyle: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "center",
  fontSize: 13,
  fontVariantNumeric: "tabular-nums",
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 500,
  color: "var(--text)",
  borderBottom: "1px solid var(--text)",
};

const bodyCellStyle: React.CSSProperties = {
  ...cellStyle,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
};

export default function SizeGuide({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "var(--overlay)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="size-guide-modal"
        style={{
          background: "var(--modal-bg)",
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflow: "auto",
          padding: "40px 32px",
          position: "relative",
          border: "1px solid var(--border-light)",
          borderRadius: 12,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close size guide"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
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
              position: "absolute",
              width: 16,
              height: 1.5,
              background: "var(--text-muted)",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              position: "absolute",
              width: 16,
              height: 1.5,
              background: "var(--text-muted)",
              transform: "rotate(-45deg)",
            }}
          />
        </button>

        <h2
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.02em",
            textAlign: "center",
          }}
        >
          Size guide
        </h2>

        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          All measurements in centimetres. Oversize fit — if between sizes, size down for
          a less relaxed look.
        </p>

        {/* Table */}
        <table
          style={{
            width: "100%",
            marginTop: 24,
            borderCollapse: "collapse",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>Size</th>
              <th style={headerCellStyle}>Chest</th>
              <th style={headerCellStyle}>Length</th>
              <th style={headerCellStyle}>Shoulder</th>
            </tr>
          </thead>
          <tbody>
            {MEASUREMENTS.map((row) => (
              <tr key={row.size}>
                <td style={{ ...bodyCellStyle, fontWeight: 500, color: "var(--text)" }}>
                  {row.size}
                </td>
                <td style={bodyCellStyle}>{row.chest}</td>
                <td style={bodyCellStyle}>{row.length}</td>
                <td style={bodyCellStyle}>{row.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* How to measure */}
        <div style={{ marginTop: 24 }}>
          <h3
            style={{
              margin: "0 0 12px",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "var(--text)",
            }}
          >
            How to measure
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 12,
              lineHeight: 1.6,
              color: "var(--text-muted)",
            }}
          >
            <div>
              <span style={{ fontWeight: 500, color: "var(--text)" }}>Chest</span> — Lay the garment
              flat. Measure across the chest, 2.5 cm below the armhole seam. Double for full
              circumference.
            </div>
            <div>
              <span style={{ fontWeight: 500, color: "var(--text)" }}>Length</span> — From the
              highest point of the shoulder seam straight down to the hem.
            </div>
            <div>
              <span style={{ fontWeight: 500, color: "var(--text)" }}>Shoulder</span> — Seam to seam
              across the back, measured flat.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
