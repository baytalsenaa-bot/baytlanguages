import sharp from "sharp";
import path from "path";

const root = process.cwd();
const badgePath = path.join(root, "public/logo/bayt-languages-badge.png");
const outPath = path.join(root, "public/og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;
const NAVY = "#0d1b3d";
const GOLD = "#d4af37";

async function main() {
  const badgeSize = 460;
  const radius = 40;
  const roundedMask = Buffer.from(
    `<svg width="${badgeSize}" height="${badgeSize}"><rect x="0" y="0" width="${badgeSize}" height="${badgeSize}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  );

  const badge = await sharp(badgePath)
    .resize(badgeSize, badgeSize, { fit: "cover" })
    .composite([{ input: roundedMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const background = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.22" />
          <stop offset="100%" stop-color="${GOLD}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}" />
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
    </svg>
  `;

  await sharp(Buffer.from(background))
    .composite([
      {
        input: badge,
        left: Math.round((WIDTH - badgeSize) / 2),
        top: Math.round((HEIGHT - badgeSize) / 2),
      },
    ])
    .png()
    .toFile(outPath);

  console.log("Wrote", outPath);
}

main();
