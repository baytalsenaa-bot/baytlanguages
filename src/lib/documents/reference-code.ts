// Crockford-Base32-ish alphabet: excludes ambiguous 0/O and 1/I/L so codes printed on
// a certificate or read off a QR scan are unambiguous to type by hand.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 8;

export function generateReferenceCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  let code = "";
  for (const byte of bytes) {
    code += ALPHABET[byte % ALPHABET.length];
  }
  return `BL-${code}`;
}

export function normalizeReferenceCode(input: string): string {
  return input.trim().toUpperCase();
}
