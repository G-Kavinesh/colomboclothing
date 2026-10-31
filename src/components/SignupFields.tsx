"use client";

// Shared pieces of the coming soon and popup signup forms

// Hidden from people and screen readers; bots that fill in every field give
// themselves away (the server drops those signups).
export function BotTrap({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden
      style={{ position: "absolute", left: -10000, width: 1, height: 1, opacity: 0 }}
    />
  );
}

// The server's reason a signup didn't go through. For a likely typo (gmali.com) it
// offers the fix, or "keep mine" for someone whose address really is spelled that way.
export function SignupError({
  error,
  suggestion,
  onUseSuggestion,
  onKeep,
  style,
}: {
  error: string;
  suggestion?: string;
  onUseSuggestion: (email: string) => void;
  onKeep: () => void;
  style?: React.CSSProperties;
}) {
  const linkStyle: React.CSSProperties = {
    padding: 0,
    border: 0,
    background: "none",
    color: "var(--text)",
    font: "inherit",
    letterSpacing: "inherit",
    textDecoration: "underline",
    cursor: "pointer",
  };

  return (
    <div role="alert" style={{ fontSize: 11, lineHeight: 1.6, letterSpacing: "0.06em", color: "var(--text-muted)", ...style }}>
      {suggestion ? (
        <>
          Did you mean{" "}
          <button type="button" onClick={() => onUseSuggestion(suggestion)} style={linkStyle}>
            {suggestion}
          </button>
          ?{" "}
          <button type="button" onClick={onKeep} style={{ ...linkStyle, color: "var(--text-muted)" }}>
            Keep mine
          </button>
        </>
      ) : (
        error
      )}
    </div>
  );
}
