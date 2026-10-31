export type Subscriber = { email: string; joinedAt: number };

export type SignupResult =
  | { ok: true; already: boolean }
  | { ok: false; error: string; suggestion?: string };

const FALLBACK_ERROR = "Couldn't sign you up just now. Please try again.";

// Sends a signup to the server (see app/api/subscribers), which checks the address
// and says whether it was already on the list. `trap` is the hidden bot field;
// `keep` skips the typo suggestion after the visitor chose to keep their spelling.
export async function addSubscriber(email: string, trap = "", keep = false): Promise<SignupResult> {
  try {
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website: trap, keep }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, already: Boolean(data.already) };
    return { ok: false, error: data.error ?? FALLBACK_ERROR, suggestion: data.suggestion };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}
