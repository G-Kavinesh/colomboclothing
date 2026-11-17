// Pre-orders live on the server (see app/api/preorders) so they reach the admin
// dashboard. Types and browser-side helpers, safe for any page.

export type PreorderStatus = "pending" | "verified" | "cancelled";

export const PREORDER_STATUSES: PreorderStatus[] = ["pending", "verified", "cancelled"];

export type Preorder = {
  id: string;
  productSlug: string;
  productName: string;
  color?: string;
  size: string;
  price: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  status: PreorderStatus;
  createdAt: string;
};

// What the public status page may see: no contact or address details
export type PreorderLookup = Pick<
  Preorder,
  "id" | "productName" | "color" | "size" | "price" | "firstName" | "status" | "createdAt"
>;

export type PreorderDetails = Pick<
  Preorder,
  "productSlug" | "color" | "size" | "firstName" | "lastName" | "email" | "phone" | "address" | "city" | "postalCode"
>;

const FALLBACK_ERROR = "Couldn't place your pre-order just now. Please try again.";

// `trap` is the hidden field only bots fill in
export async function placePreorder(
  details: PreorderDetails,
  trap = ""
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/preorders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...details, website: trap }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.id) return { ok: true, id: data.id };
    return { ok: false, error: data.error ?? FALLBACK_ERROR };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}

export async function lookupPreorder(id: string): Promise<PreorderLookup | "not-found" | "error"> {
  try {
    const res = await fetch(`/api/preorders/status?id=${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.status === 404) return "not-found";
    if (!res.ok) return "error";
    return (await res.json()).preorder;
  } catch {
    return "error";
  }
}
