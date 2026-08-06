export const blogSlugs = [
  "certified-vs-notarized",
  "documents-that-need-certified-translation",
  "how-long-does-certified-translation-take",
  "choosing-a-translation-partner",
] as const;

export type BlogSlug = (typeof blogSlugs)[number];

export type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  body: string[];
};
