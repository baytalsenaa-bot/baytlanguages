import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { buildLanguageAlternates, siteUrl } from "@/lib/seo";
import { blogSlugs } from "@/lib/blog";

const pages = [
  "",
  "/about",
  "/services",
  "/contact",
  "/verify",
  "/blog",
  ...blogSlugs.map((slug) => `/blog/${slug}`),
  "/legal/privacy",
  "/legal/terms",
  "/legal/confidentiality",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      alternates: { languages: buildLanguageAlternates(page) },
    })),
  );
}
