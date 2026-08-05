import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { routing } from "@/i18n/routing";

// Deterministic for a given code — the QR just encodes a URL, so this is safe to
// cache aggressively rather than pre-generating and storing it in Storage.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const normalizedCode = code.trim().toUpperCase();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const verifyUrl = `${siteUrl}/${routing.defaultLocale}/verify/${normalizedCode}`;

  const png = await QRCode.toBuffer(verifyUrl, {
    type: "png",
    width: 320,
    margin: 1,
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
