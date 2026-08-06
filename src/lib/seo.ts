import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://baytlanguages.com";

export function buildLanguageAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
  );
}

export { siteUrl };
