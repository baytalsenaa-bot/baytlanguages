import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata, siteUrl } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { blogSlugs, type BlogPost, type BlogSlug } from "@/lib/blog";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogSlugs.map((slug) => ({ locale, slug })),
  );
}

function isBlogSlug(value: string): value is BlogSlug {
  return (blogSlugs as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isBlogSlug(slug)) return {};

  const t = await getTranslations({ locale, namespace: "blog" });
  const post = t.raw(`posts.${slug}`) as BlogPost;
  return {
    title: `${post.title} | Bayt Languages`,
    description: post.excerpt,
    ...buildPageMetadata(locale, `/blog/${slug}`),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isBlogSlug(slug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const post = t.raw(`posts.${slug}`) as BlogPost;
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Bayt Languages" },
    publisher: { "@type": "Organization", name: "Bayt Languages" },
    url: `${siteUrl}/${locale}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="px-4 pt-20 pb-24 md:pt-28">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-muted">
            {dateFormatter.format(new Date(post.date))}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-parchment md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-8 space-y-5">
            {post.body.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-brand-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/blog"
            className="mt-10 inline-block text-sm text-brand-gold underline-offset-4 hover:underline"
          >
            ← {t("backToBlog")}
          </Link>
        </div>
      </article>
    </>
  );
}
