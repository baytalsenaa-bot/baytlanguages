import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { buildLanguageAlternates, siteUrl } from "@/lib/seo";

const pages = ["", "/about", "/services", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      alternates: { languages: buildLanguageAlternates(page) },
    })),
  );
}
