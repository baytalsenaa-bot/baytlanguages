export const blogSlugs = [
  "certified-vs-notarized",
  "documents-that-need-certified-translation",
  "how-long-does-certified-translation-take",
  "choosing-a-translation-partner",
  "bilingual-contract-review",
  "signs-you-need-a-process-review",
  "localized-marketing-vs-translated-ads",
  "company-profile-vs-catalog",
  "subtitling-vs-dubbing",
  "multilingual-website-beyond-google-translate",
  "off-the-shelf-vs-custom-systems",
  "spreadsheets-to-dashboards",
  "business-tasks-worth-automating",
  "what-goes-into-a-company-profile",
  "china-market-entry-saudi-egypt",
] as const;

export type BlogSlug = (typeof blogSlugs)[number];

export type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  body: string[];
};
