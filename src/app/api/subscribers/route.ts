import { createHash, timingSafeEqual } from "node:crypto";

// Signups live in a Redis sorted set (Upstash, from the Vercel Marketplace) scored
// by signup time, so the admin list reads oldest first and duplicates are ignored.
const KEY = "subscribers";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function redis(...command: (string | number)[]) {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis is not configured");

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  return (await res.json()).result;
}

// Reading or removing subscribers needs the ADMIN_PASSWORD set in Vercel. Both sides
// are hashed first so the comparison takes the same time whatever the input length.
function isAdmin(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const given = request.headers.get("x-admin-password");
  if (!expected || !given) return false;
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(given), hash(expected));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await redis("ZADD", KEY, "NX", Date.now(), email);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Saving subscriber failed", err);
    return Response.json({ error: "Could not save" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!isAdmin(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // WITHSCORES returns a flat [email, score, email, score, ...] list
    const flat: string[] = await redis("ZRANGE", KEY, 0, -1, "WITHSCORES");
    const subscribers = [];
    for (let i = 0; i < flat.length; i += 2) {
      subscribers.push({ email: flat[i], joinedAt: Number(flat[i + 1]) });
    }
    return Response.json({ subscribers });
  } catch (err) {
    console.error("Loading subscribers failed", err);
    return Response.json({ error: "Could not load" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const email = new URL(request.url).searchParams.get("email");
  if (!email) return Response.json({ error: "Missing email" }, { status: 400 });

  try {
    await redis("ZREM", KEY, email);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Removing subscriber failed", err);
    return Response.json({ error: "Could not remove" }, { status: 500 });
  }
}
