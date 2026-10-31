import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Server-only. The admin dashboard has one password, ADMIN_PASSWORD in Vercel.
// Logging in sets a signed cookie that only the server can read; it lasts 30 minutes
// and renews while the dashboard is in use. Changing ADMIN_PASSWORD signs everyone out.

const COOKIE = "colombo_admin";
const SESSION_SECONDS = 30 * 60;

// Wrong passwords allowed per visitor before the login locks
export const LOGIN_LIMIT = { max: 10, windowSeconds: 15 * 60 };

function secret() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set");
  return password;
}

// Both sides are hashed first so the comparison takes the same time whatever the length
function sameText(a: string, b: string) {
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function passwordMatches(given: string) {
  return sameText(given, secret());
}

function sign(expiresAt: number) {
  return createHmac("sha256", secret()).update(`admin:${expiresAt}`).digest("base64url");
}

export async function startSession() {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  (await cookies()).set(COOKIE, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api",
    maxAge: SESSION_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/api" });
}

// Whether the request carries a live session. With `renew`, the 30 minutes restart.
export async function hasSession({ renew = false } = {}) {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  const expiry = Number(expiresAt);
  if (!expiry || expiry < Date.now() || !signature) return false;
  try {
    if (!sameText(signature, sign(expiry))) return false;
  } catch {
    return false;
  }
  if (renew) await startSession();
  return true;
}
