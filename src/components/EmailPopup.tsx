"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { addSubscriber, type SignupResult } from "@/lib/subscribers";
import { BotTrap, SignupError } from "@/components/SignupFields";
import { COMING_SOON } from "@/lib/site";

const STORAGE_KEY = "colombo-email-popup";
const DELAY_MS = 4000;

export default function EmailPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState<"new" | "already" | null>(null);
  const [closing, setClosing] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<Extract<SignupResult, { ok: false }> | null>(null);
  const [trap, setTrap] = useState("");

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) return;
    } catch {}

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {}
    }, 300);
  };

  const submit = async (value: string, keep = false) => {
    if (!value.trim() || sending) return;

    setSending(true);
    setFailure(null);
    const result = await addSubscriber(value, trap, keep);
    setSending(false);
    if (!result.ok) {
      setFailure(result);
      return;
    }

    setSubmitted(result.already ? "already" : "new");
    setTimeout(close, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(email);
  };

  const applySuggestion = (fixed: string) => {
    setEmail(fixed);
    submit(fixed);
  };

  if (!visible || (COMING_SOON && pathname === "/")) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--overlay)",
        backdropFilter: "blur(4px)",
        opacity: closing ? 0 : 1,
        transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--modal-bg)",
          border: "1px solid var(--border-light)",
          borderRadius: 12,
          padding: "44px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          transform: closing ? "scale(0.97)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            border: 0,
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            fontSize: 16,
            font: "400 16px 'IBM Plex Mono', monospace",
          }}
        >
          ✕
        </button>

        {submitted ? (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.02em",
                color: "var(--text)",
              }}
            >
              {submitted === "already" ? <>You&apos;re already in</> : <>You&apos;re in</>}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              We&apos;ll let you know when new pieces drop.
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              UDFDPT.
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.4,
              }}
            >
              Drops, restocks, nothing else
            </div>
            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 13,
                lineHeight: 1.7,
                color: "var(--text-muted)",
              }}
            >
              One email per drop. Unsubscribe anytime.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: 24,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <BotTrap value={trap} onChange={setTrap} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 12px",
                  border: "1px solid var(--border-light)",
                  borderRadius: 6,
                  background: "transparent",
                  font: "400 13px 'IBM Plex Mono', monospace",
                  color: "var(--text)",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              />
              <button
                type="submit"
                disabled={sending}
                style={{
                  width: "100%",
                  height: 44,
                  border: 0,
                  borderRadius: 6,
                  background: "var(--btn-bg)",
                  color: "var(--btn-text)",
                  font: "500 13px 'IBM Plex Mono', monospace",
                  letterSpacing: "0.04em",
                  cursor: sending ? "wait" : "pointer",
                  opacity: sending ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {sending ? "Sending..." : "JOIN THE LIST"}
              </button>
              {failure && (
                <SignupError error={failure.error} suggestion={failure.suggestion} onUseSuggestion={applySuggestion} onKeep={() => submit(email, true)} />
              )}
            </form>

            <button
              onClick={close}
              style={{
                marginTop: 20,
                border: 0,
                background: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "var(--text-muted)",
                font: "400 12px 'IBM Plex Mono', monospace",
              }}
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
