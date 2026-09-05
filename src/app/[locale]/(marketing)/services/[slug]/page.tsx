import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { serviceCategorySlugs, type ServiceCategorySlug } from "@/lib/services";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { ServiceChecklist } from "@/components/marketing/ServiceChecklist";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";
import { FinalCta } from "@/components/marketing/FinalCta";

type CategoryData = {
  title: string;
  shortDescription: string;
  description: string;
  items: string[];
  note?: string;
};

function isValidSlug(slug: string): slug is ServiceCategorySlug {
  return (serviceCategorySlugs as readonly string[]).includes(slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceCategorySlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isValidSlug(slug)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "services" });
  const category = t.raw(`categories.${slug}`) as CategoryData;

  return {
    title: `${category.title} | Bayt Languages`,
    description: category.description,
    ...buildPageMetadata(locale, `/services/${slug}`),
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isValidSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("services");
  const category = t.raw(`categories.${slug}`) as CategoryData;

  return (
    <>
      <div className="px-4 pt-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/services"
            className="text-sm text-brand-muted underline-offset-4 hover:text-brand-parchment hover:underline"
          >
            ← {t("categoryHero.backLabel")}
          </Link>
        </div>
      </div>

      <SimpleHero
        eyebrow={t("hero.eyebrow")}
        title={category.title}
        subtitle={category.description}
      />

      <section className="px-4 pb-12">
        <ServiceChecklist items={category.items} />

        {category.note && (
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-brand-muted">
            {category.note}
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <WhatsAppButton />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
