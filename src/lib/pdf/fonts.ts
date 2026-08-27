import path from "node:path";
import { Font } from "@react-pdf/renderer";

// Helvetica (the react-pdf default) only has Latin glyphs — Arabic text in a
// document title/description/client name would otherwise render as garbage
// characters. Almarai covers Arabic + Latin, so it's registered as the one
// font for the whole document rather than switching per field.
Font.register({
  family: "Almarai",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/Almarai-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(process.cwd(), "public/fonts/Almarai-Bold.ttf"), fontWeight: "bold" },
  ],
});

// Almarai has no CJK glyphs, so a document with Chinese text (title, client
// name, description) needs Noto Sans SC registered as a separate family and
// selected at render time — see resolveFontFamily below.
Font.register({
  family: "NotoSansSC",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/NotoSansSC-Regular.otf"), fontWeight: "normal" },
    { src: path.join(process.cwd(), "public/fonts/NotoSansSC-Bold.otf"), fontWeight: "bold" },
  ],
});

const CJK_RANGE = /[一-鿿㐀-䶿豈-﫿]/;

export function resolveFontFamily(...text: (string | null | undefined)[]): "Almarai" | "NotoSansSC" {
  const combined = text.join(" ");
  return CJK_RANGE.test(combined) ? "NotoSansSC" : "Almarai";
}
