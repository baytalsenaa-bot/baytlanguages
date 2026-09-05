// Slugs for the expanded services offered alongside translation & localization
// (which keeps its own dedicated /services page). Shared by the dynamic
// category route (generateStaticParams) and the sitemap.
export const serviceCategorySlugs = [
  "legal-advisory",
  "business-consulting",
  "marketing-growth",
  "creative-design",
  "video-multimedia",
  "web-development",
  "business-systems",
  "data-analytics",
  "ai-automation",
  "corporate-documentation",
  "china-middle-east",
] as const;

export type ServiceCategorySlug = (typeof serviceCategorySlugs)[number];
