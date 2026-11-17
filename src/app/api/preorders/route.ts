import { randomInt } from "node:crypto";
import { hasSession } from "@/lib/admin-session";
import { isValidEmail } from "@/lib/email-rules";
import { getProduct } from "@/lib/product-data";
import { PREORDER_STATUSES, type Preorder, type PreorderStatus } from "@/lib/preorders";
import { clientIp, hit, redis } from "@/lib/redis";

// Each pre-order is stored as JSON under preorder:<id>, and its id goes in a sorted
// set scored by order time so the admin list reads oldest first.
const KEY = "preorders";
const recordKey = (id: string) => `preorder:${id}`;

// Pre-orders allowed per visitor address. Generous because mobile networks put many
// customers behind one shared address; only complete pre-orders count, so typos don't.
const PREORDER_LIMIT = { max: 20, windowSeconds: 10 * 60 };

// No 0/O or 1/I/L, so an id read out over the phone can't be misheard
const ID_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function newId() {
  let id = "";
  for (let i = 0; i < 8; i++) id += ID_CHARS[randomInt(ID_CHARS.length)];
  return `UD-${id}`;
}

function reject(error: string, status = 400) {
  return Response.json({ error }, { status });
}

// Trimmed text no longer than `max`, or null when missing or too long
function text(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed && trimmed.length <= max ? trimmed : null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // Hidden field only bots fill in. They get a normal-looking reply and nothing is saved.
  if (body?.website) return Response.json({ id: newId() });

  // Product, price and options come from the server's list, never from the request
  const product = typeof body?.productSlug === "string" ? getProduct(body.productSlug) : undefined;
  if (!product?.preorder) return reject("This item isn't open for pre-order.");
  if (!product.sizes.includes(body.size)) return reject("Please choose a size.");
  if (product.colors && !product.colors.some((c) => c.name === body.color)) {
    return reject("Please choose a colour.");
  }

  const firstName = text(body.firstName, 60);
  const lastName = text(body.lastName, 60);
  const email = text(body.email, 254)?.toLowerCase();
  const phone = text(body.phone, 24);
  const address = text(body.address, 200);
  const city = text(body.city, 80);
  const postalCode = text(body.postalCode, 12);

  if (!firstName || !lastName) return reject("Please enter your first and last name.");
  if (!email || !isValidEmail(email)) return reject("That doesn't look like a valid email address.");
  if (!phone || !/^\+?[\d\s()-]{7,}$/.test(phone)) return reject("Please enter a valid phone number.");
  if (!address || !city || !postalCode) return reject("Please fill in your full shipping address.");

  try {
    const attempts = await hit(`ratelimit:preorder:${clientIp(request)}`, PREORDER_LIMIT.windowSeconds);
    if (attempts > PREORDER_LIMIT.max) {
      return reject("Too many pre-orders. Please wait a few minutes and try again.", 429);
    }
  } catch (err) {
    console.error("Pre-order rate limit check failed", err);
    return reject("Couldn't place your pre-order just now. Please try again.", 500);
  }

  const preorder: Preorder = {
    id: newId(),
    productSlug: product.slug,
    productName: product.name,
    ...(product.colors && { color: body.color }),
    size: body.size,
    price: product.price,
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    postalCode,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    await redis(
      ["SET", recordKey(preorder.id), JSON.stringify(preorder)],
      ["ZADD", KEY, Date.now(), preorder.id]
    );
    return Response.json({ id: preorder.id });
  } catch (err) {
    console.error("Saving pre-order failed", err);
    return reject("Couldn't place your pre-order just now. Please try again.", 500);
  }
}

// Listing pre-orders or changing their status needs an admin session (see
// app/api/admin/session). Each use renews it.
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
    const [ids] = (await redis(["ZRANGE", KEY, 0, -1])) as string[][];
    if (ids.length === 0) return Response.json({ preorders: [] });
    const [records] = (await redis(["MGET", ...ids.map(recordKey)])) as (string | null)[][];
    const preorders = records.filter((r): r is string => r !== null).map((r) => JSON.parse(r) as Preorder);
    return Response.json({ preorders });
  } catch (err) {
    console.error("Loading pre-orders failed", err);
    return reject("Could not load", 500);
  }
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status as PreorderStatus;
  if (!id || !PREORDER_STATUSES.includes(status)) return reject("Missing id or status");

  try {
    const [stored] = (await redis(["GET", recordKey(id)])) as (string | null)[];
    if (!stored) return reject("Pre-order not found", 404);
    const preorder: Preorder = { ...JSON.parse(stored), status };
    await redis(["SET", recordKey(id), JSON.stringify(preorder)]);
    return Response.json({ preorder });
  } catch (err) {
    console.error("Updating pre-order failed", err);
    return reject("Could not update", 500);
  }
}
