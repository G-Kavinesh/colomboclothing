import { NextResponse, type NextRequest } from "next/server";
import { COMING_SOON } from "@/lib/site";

// Until launch (COMING_SOON in lib/site.ts) the shop is closed to everyone. Its pages
// send visitors to the coming soon home page, and product photos and product share
// cards return 404, including when asked for through the image optimizer.
// Setting COMING_SOON to false opens everything again.

// Product photos in public/images. The coming soon page uses silhouette-01.png instead.
const PRODUCT_PHOTO = /^\/images\/(tee|cap|tote)-/;

function isProductPhoto(path: string) {
  try {
    path = decodeURIComponent(path);
  } catch {}
  return PRODUCT_PHOTO.test(path.toLowerCase());
}

function notFound() {
  return new NextResponse("Not found", { status: 404 });
}

export function proxy(request: NextRequest) {
  if (!COMING_SOON) return NextResponse.next();
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/_next/image") {
    const src = searchParams.get("url") ?? "";
    let path = src;
    try {
      path = new URL(src, request.url).pathname;
    } catch {}
    return isProductPhoto(path) ? notFound() : NextResponse.next();
  }

  if (pathname.startsWith("/images/")) {
    return isProductPhoto(pathname) ? notFound() : NextResponse.next();
  }

  if (pathname.startsWith("/shop/") && pathname.endsWith("/og.jpg")) return notFound();

  // Shop, product, pre-order, bag, checkout and order pages
  return NextResponse.redirect(new URL("/", request.url), 307);
}

export const config = {
  matcher: [
    "/shop/:path*",
    "/preorder/:path*",
    "/cart",
    "/checkout/:path*",
    "/order-status",
    "/images/:path*",
    "/_next/image",
  ],
};
