import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { formatPrice, products, type Product } from "@/lib/products";
import { COMING_SOON } from "@/lib/site";

// Share images for link previews (WhatsApp, iMessage, Instagram, Facebook, X, LinkedIn,
// Slack, Discord, Telegram). Rendered at build time to 1200×630 — the ratio every
// platform shows as a large card — then re-encoded as JPEG so they stay well under
// WhatsApp's ~300KB preview limit.
//
// Served from og.jpg route handlers rather than the opengraph-image convention:
// static export writes those without a file extension, and some crawlers (X in
// particular) reject an image that isn't served with an image content type.

export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#f3f4f6";
const TEXT = "#111";
const MUTED = "#6b6b6b";
const BORDER = "#d6d3cc";
const DOMAIN = "colomboclothing.com";

const root = process.cwd();

async function fonts() {
  const [medium, semibold] = await Promise.all([
    readFile(join(root, "src/assets/fonts/IBMPlexMono-Medium.woff")),
    readFile(join(root, "src/assets/fonts/IBMPlexMono-SemiBold.woff")),
  ]);
  return [
    { name: "IBM Plex Mono", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "IBM Plex Mono", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

// Satori can't decode WebP, so every public image goes through sharp first.
async function publicImage(src: string, maxSize: number) {
  const png = await sharp(join(root, "public", src))
    .resize(maxSize, maxSize, { fit: "inside" })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

async function toJpeg(image: ImageResponse) {
  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
}

export async function siteOgImage() {
  return COMING_SOON ? comingSoonOgImage() : collectionOgImage();
}

async function comingSoonOgImage() {
  const logo = await publicImage("/images/colombo-logo.png", 1280);

  return toJpeg(
    new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: BG,
            color: TEXT,
            fontFamily: "IBM Plex Mono",
            padding: "44px 64px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 600, letterSpacing: "0.08em" }}>
            <span>{DOMAIN}</span>
            <span style={{ color: MUTED, fontWeight: 500 }}>SRI LANKA</span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={logo} width={640} height={238} />
            <div style={{ marginTop: 36, fontSize: 34, fontWeight: 600, letterSpacing: "0.32em", marginRight: "-0.32em" }}>
              COMING SOON
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              borderTop: `1px solid ${BORDER}`,
              paddingTop: 24,
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: MUTED,
            }}
          >
            100% COTTON · HEAVYWEIGHT · GARMENT-DYED · MADE IN COLOMBO
          </div>
        </div>
      ),
      { ...OG_SIZE, fonts: await fonts() }
    )
  );
}

// Launch card: logo above the product line-up
async function collectionOgImage() {
  const lineup = products.slice(0, 4);
  const [logo, ...photos] = await Promise.all([
    publicImage("/images/colombo-logo.png", 820),
    ...lineup.map((p) => publicImage(p.shareImage ?? p.images[0].src, 480)),
  ]);
  const tileWidth = Math.floor((1200 - 128 - 24 * (lineup.length - 1)) / lineup.length);

  return toJpeg(
    new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: BG,
            color: TEXT,
            fontFamily: "IBM Plex Mono",
            padding: "40px 64px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 600, letterSpacing: "0.08em" }}>
            <span>{DOMAIN}</span>
            <span style={{ letterSpacing: "0.16em" }}>SHOP NOW</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={logo} width={410} height={153} />
          </div>

          <div style={{ flex: 1, display: "flex", gap: 24, marginTop: 20, marginBottom: 22 }}>
            {lineup.map((p, i) => (
              <div
                key={p.slug}
                style={{
                  width: tileWidth,
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                  padding: "16px 16px 12px",
                }}
              >
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                  <img src={photos[i]} style={{ maxWidth: "100%", maxHeight: 190, objectFit: "contain" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 16, fontWeight: 600, letterSpacing: "0.04em" }}>
                  <span>{p.name.replace(/^CMB-\d+ /, "")}</span>
                  <span style={{ fontWeight: 500, color: MUTED }}>{formatPrice(p.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              borderTop: `1px solid ${BORDER}`,
              paddingTop: 18,
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: MUTED,
            }}
          >
            100% COTTON · HEAVYWEIGHT · GARMENT-DYED · MADE IN COLOMBO
          </div>
        </div>
      ),
      { ...OG_SIZE, fonts: await fonts() }
    )
  );
}

export async function productOgImage(product: Product) {
  const [photo, logo] = await Promise.all([
    publicImage(product.shareImage ?? product.images[0].src, 1040),
    publicImage("/images/colombo-logo.png", 560),
  ]);
  const photoMeta = await sharp(join(root, "public", product.shareImage ?? product.images[0].src)).metadata();
  // Fit the photo inside a 520×520 box, keeping its aspect ratio
  const scale = Math.min(520 / photoMeta.width!, 520 / photoMeta.height!);

  return toJpeg(
    new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: BG,
            color: TEXT,
            fontFamily: "IBM Plex Mono",
          }}
        >
          <div
            style={{
              width: 600,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              src={photo}
              width={Math.round(photoMeta.width! * scale)}
              height={Math.round(photoMeta.height! * scale)}
            />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "52px 56px 44px",
              borderLeft: `1px solid ${BORDER}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={logo} width={240} height={89} />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "0.12em", color: MUTED }}>
                {product.category}
              </div>
              <div style={{ marginTop: 12, fontSize: 46, fontWeight: 600, lineHeight: 1.15, letterSpacing: "0.02em" }}>
                {product.name}
              </div>
              <div style={{ marginTop: 20, fontSize: 32, fontWeight: 500 }}>{formatPrice(product.price)}</div>
              {product.preorder && (
                <div style={{ display: "flex", marginTop: 28 }}>
                  <div
                    style={{
                      display: "flex",
                      padding: "10px 18px",
                      background: TEXT,
                      color: BG,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                    }}
                  >
                    PRE-ORDER NOW
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.08em" }}>{DOMAIN}</div>
          </div>
        </div>
      ),
      { ...OG_SIZE, fonts: await fonts() }
    )
  );
}
