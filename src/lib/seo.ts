import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://baytlanguages.com";

export function buildLanguageAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
  );
}

export function buildPageMetadata(locale: string, path: string) {
  return {
    alternates: {
      canonical: `${siteUrl}/${locale}${path}`,
      languages: buildLanguageAlternates(path),
    },
  };
}

export { siteUrl };
