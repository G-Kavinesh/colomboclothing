import { endSession, hasSession, LOGIN_LIMIT, passwordMatches, startSession } from "@/lib/admin-session";
import { clientIp, hit, redis } from "@/lib/redis";

// Admin login. GET says whether you're signed in (and renews the session when asked),
// POST signs in with ADMIN_PASSWORD, DELETE signs out.

export async function GET(request: Request) {
  const renew = new URL(request.url).searchParams.has("renew");
  return Response.json({ authenticated: await hasSession({ renew }) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const key = `ratelimit:admin:${clientIp(request)}`;

  try {
    const [failures, ttl] = await redis(["GET", key], ["TTL", key]);
    if (Number(failures) >= LOGIN_LIMIT.max) {
      const retryAfter = Math.max(Number(ttl), 1);
      return Response.json(
        { error: `TOO MANY ATTEMPTS. TRY AGAIN IN ${Math.ceil(retryAfter / 60)} MIN`, retryAfter },
        { status: 429 }
      );
    }

    if (password && passwordMatches(password)) {
      await redis(["DEL", key]);
      await startSession();
      return Response.json({ ok: true });
    }

    const count = await hit(key, LOGIN_LIMIT.windowSeconds);
    const left = LOGIN_LIMIT.max - count;
    if (left <= 0) {
      return Response.json(
        { error: `TOO MANY ATTEMPTS. LOCKED FOR ${LOGIN_LIMIT.windowSeconds / 60} MINUTES`, retryAfter: LOGIN_LIMIT.windowSeconds },
        { status: 429 }
      );
    }
    return Response.json(
      { error: `INCORRECT PASSWORD (${left} ATTEMPT${left === 1 ? "" : "S"} LEFT)` },
      { status: 401 }
    );
  } catch (err) {
    console.error("Admin login failed", err);
    return Response.json({ error: "COULDN'T SIGN IN. TRY AGAIN" }, { status: 500 });
  }
}

export async function DELETE() {
  await endSession();
  return Response.json({ ok: true });
}
