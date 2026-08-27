import fs from "node:fs";
import path from "node:path";

// @react-pdf/renderer's local-path image resolution is unreliable on this
// setup (fails silently, producing a blank image) — reading the file into a
// buffer ourselves and passing { data, format } sidesteps its path/fetch
// resolver entirely.
function loadImage(relativePath: string) {
  return {
    data: fs.readFileSync(path.join(process.cwd(), relativePath)),
    format: "png" as const,
  };
}

// The official company letterhead (logo, bilingual title, divider, watermark,
// and contact footer) is used as-is as the page background for every
// generated PDF — certificates and receipts alike.
export const LETTERHEAD = loadImage("public/logo/certificate-letterhead.png");

// Shared vertical landmarks of the letterhead background, in PDF points on
// an A4 page — the header divider sits ~191pt from the top, the footer
// contact bar starts ~50pt from the bottom.
export const LETTERHEAD_HEADER_CLEARANCE = 208;
export const LETTERHEAD_FOOTER_CLEARANCE = 66;
export const LETTERHEAD_SUBTITLE_TOP = 152;
