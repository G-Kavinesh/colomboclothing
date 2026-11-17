import type { Preorder, PreorderLookup } from "@/lib/preorders";
import { clientIp, hit, redis } from "@/lib/redis";

// Public status check by pre-order id. Ids are random, and lookups are rate limited
// so they can't be guessed; the reply leaves out contact and address details. The
// limit allows for many customers sharing one mobile network address.
const LOOKUP_LIMIT = { max: 60, windowSeconds: 10 * 60 };

export async function GET(request: Request) {
  const id = (new URL(request.url).searchParams.get("id") ?? "").trim().toUpperCase();
  if (!/^UD-[A-Z0-9]{8}$/.test(id)) return Response.json({ error: "Not found" }, { status: 404 });

  try {
    const attempts = await hit(`ratelimit:preorder-status:${clientIp(request)}`, LOOKUP_LIMIT.windowSeconds);
    if (attempts > LOOKUP_LIMIT.max) {
      return Response.json({ error: "Too many tries. Please wait a few minutes." }, { status: 429 });
    }

    const [stored] = (await redis(["GET", `preorder:${id}`])) as (string | null)[];
    if (!stored) return Response.json({ error: "Not found" }, { status: 404 });

    const { productName, color, size, price, firstName, status, createdAt }: Preorder = JSON.parse(stored);
    const preorder: PreorderLookup = { id, productName, color, size, price, firstName, status, createdAt };
    return Response.json({ preorder });
  } catch (err) {
    console.error("Pre-order lookup failed", err);
    return Response.json({ error: "Could not check" }, { status: 500 });
  }
}
