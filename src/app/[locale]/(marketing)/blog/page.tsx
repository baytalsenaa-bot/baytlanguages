import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { blogSlugs, type BlogPost } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.blog" });
  return {
    title: t("title"),
    description: t("description"),
    ...buildPageMetadata(locale, "/blog"),
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <>
      <SimpleHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {blogSlugs.map((slug) => {
            const post = t.raw(`posts.${slug}`) as BlogPost;
            return (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="group flex flex-col rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10 transition-colors hover:border-brand-gold/50"
              >
                <p className="text-xs font-medium uppercase tracking-widest text-brand-muted">
                  {dateFormatter.format(new Date(post.date))}
                </p>
                <h2 className="mt-2 text-lg font-bold text-brand-parchment">{post.title}</h2>
                <p className="mt-2 text-sm text-brand-muted">{post.excerpt}</p>
                <span className="mt-4 text-sm font-medium text-brand-gold transition-transform group-hover:translate-x-0.5">
                  {t("readMore")} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
