// Server-only helpers for the Upstash Redis store (from the Vercel Marketplace),
// which holds the subscriber list and the per-visitor attempt counters.

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis is not configured");
  return { url, token };
}

// Runs one or more commands in a single round trip and returns each result
export async function redis(...commands: (string | number)[][]) {
  const { url, token } = redisConfig();
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  const replies: { result?: unknown; error?: string }[] = await res.json();
  const failed = replies.find((r) => r.error);
  if (failed) throw new Error(`Redis error: ${failed.error}`);
  return replies.map((r) => r.result);
}

export function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

// Counts a hit against a fixed window that starts on the first hit, and returns
// the count so far
export async function hit(key: string, windowSeconds: number) {
  const [, count] = await redis(["SET", key, 0, "EX", windowSeconds, "NX"], ["INCR", key]);
  return Number(count);
}
