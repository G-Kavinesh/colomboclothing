export const SUBSCRIBERS_KEY = "colombo-subscribers";

export function addSubscriber(email: string) {
  try {
    const stored = localStorage.getItem(SUBSCRIBERS_KEY);
    const subscribers: string[] = stored ? JSON.parse(stored) : [];
    const normalized = email.trim().toLowerCase();
    if (!subscribers.includes(normalized)) {
      subscribers.push(normalized);
      localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
    }
  } catch {}
}
