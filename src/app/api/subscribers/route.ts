import { Resolver } from "node:dns/promises";
import { hasSession } from "@/lib/admin-session";
import { isDisposable, isValidEmail, KNOWN_PROVIDERS, normalizeEmail, suggestCorrection } from "@/lib/email-rules";
import { clientIp, hit, redis } from "@/lib/redis";

// Signups live in a Redis sorted set scored by signup time, so the admin list reads
// oldest first and duplicates are ignored.
const KEY = "subscribers";

// Signup attempts allowed per visitor
const SIGNUP_LIMIT = { max: 10, windowSeconds: 10 * 60 };

const mailResolver = new Resolver({ timeout: 3000, tries: 1 });

// Whether the domain has somewhere to deliver mail. Only a definite "no such domain"
// or "no mail server" answer turns a signup away, never a slow or failed lookup.
async function domainAcceptsMail(domain: string) {
  if (KNOWN_PROVIDERS.has(domain)) return true;
  try {
    const records = await mailResolver.resolveMx(domain);
    // A lone "." record (RFC 7505) means the domain says it takes no mail
    return records.some((r) => r.exchange && r.exchange !== ".");
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND") return false;
    if (code === "ENODATA") {
      // No MX record: mail falls back to the domain's own address
      return mailResolver.resolve4(domain).then((ips) => ips.length > 0, () => false);
    }
    return true;
  }
}

function reject(error: string, status = 400, extra?: Record<string, string>) {
  return Response.json({ error, ...extra }, { status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // Hidden field only bots fill in. They get a normal-looking reply and nothing is saved.
  if (body?.website) return Response.json({ ok: true, already: false });

  try {
    const attempts = await hit(`ratelimit:signup:${clientIp(request)}`, SIGNUP_LIMIT.windowSeconds);
    if (attempts > SIGNUP_LIMIT.max) {
      return reject("Too many tries. Please wait a few minutes and try again.", 429);
    }
  } catch (err) {
    console.error("Signup rate limit check failed", err);
    return reject("Couldn't sign you up just now. Please try again.", 500);
  }

  const typed = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(typed)) return reject("That doesn't look like a valid email address.");

  const suggestion = suggestCorrection(typed);
  if (suggestion) return reject(`Did you mean ${suggestion}?`, 400, { suggestion });

  if (isDisposable(typed)) return reject("Please use a permanent email address, not a temporary one.");

  const email = normalizeEmail(typed);
  if (!(await domainAcceptsMail(email.slice(email.lastIndexOf("@") + 1)))) {
    return reject("That email domain can't receive mail. Please check the spelling.");
  }

  try {
    // NX keeps the original signup time; it returns 0 when the email is already listed
    const [added] = await redis(["ZADD", KEY, "NX", Date.now(), email]);
    return Response.json({ ok: true, already: added === 0 });
  } catch (err) {
    console.error("Saving subscriber failed", err);
    return reject("Couldn't sign you up just now. Please try again.", 500);
  }
}

// Reading or removing subscribers needs an admin session (see app/api/admin/session).
// Each use renews it, so it doesn't run out while you're working through the list.
async function requireAdmin() {
  try {
    if (await hasSession({ renew: true })) return null;
  } catch (err) {
    console.error("Admin session check failed", err);
    return reject("Could not check session", 500);
  }
  return reject("Unauthorized", 401);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    // WITHSCORES returns a flat [email, score, email, score, ...] list
    const [flat] = (await redis(["ZRANGE", KEY, 0, -1, "WITHSCORES"])) as string[][];
    const subscribers = [];
    for (let i = 0; i < flat.length; i += 2) {
      subscribers.push({ email: flat[i], joinedAt: Number(flat[i + 1]) });
    }
    return Response.json({ subscribers });
  } catch (err) {
    console.error("Loading subscribers failed", err);
    return reject("Could not load", 500);
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const email = new URL(request.url).searchParams.get("email");
  if (!email) return reject("Missing email");

  try {
    await redis(["ZREM", KEY, email]);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Removing subscriber failed", err);
    return reject("Could not remove", 500);
  }
}
