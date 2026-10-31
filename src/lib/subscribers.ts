export type Subscriber = { email: string; joinedAt: number };

// Sends a signup to the server (see app/api/subscribers). Resolves false if it
// wasn't saved, so the form can ask the visitor to try again.
export async function addSubscriber(email: string): Promise<boolean> {
  try {
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
