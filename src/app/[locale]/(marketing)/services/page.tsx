import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { serviceCategorySlugs } from "@/lib/services";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { FinalCta } from "@/components/marketing/FinalCta";
import {
  ScaleIcon,
  StethoscopeIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  IdCardIcon,
  StampIcon,
} from "@/components/marketing/icons";

type FeatureItem = { title: string; description: string };
type CategoryCard = { title: string; shortDescription: string };

const serviceIcons = [
  <ScaleIcon key="a" />,
  <StethoscopeIcon key="b" />,
  <GraduationCapIcon key="c" />,
  <BriefcaseIcon key="d" />,
  <IdCardIcon key="e" />,
  <StampIcon key="f" />,
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.services" });
  return {
    title: t("title"),
    description: t("description"),
    ...buildPageMetadata(locale, "/services"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");
  const home = await getTranslations("home");
  const items = home.raw("services.items") as FeatureItem[];
  const categories = t.raw("categories") as Record<string, CategoryCard>;

  return (
    <>
      <SimpleHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />
      <FeatureGrid
        title={home("services.title")}
        items={items}
        icons={serviceIcons}
        columns={3}
      />

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              {t("moreServices.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-parchment md:text-4xl">
              {t("moreServices.title")}
            </h2>
            <p className="mt-4 text-brand-muted">{t("moreServices.subtitle")}</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategorySlugs.map((slug) => {
              const category = categories[slug];
              return (
                <Link
                  key={slug}
                  href={`/services/${slug}`}
                  className="group rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10 transition-colors hover:border-brand-gold/50"
                >
                  <h3 className="text-lg font-bold text-brand-parchment">{category.title}</h3>
                  <p className="mt-2 text-sm text-brand-muted">{category.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold">
                    {t("moreServices.cta")}
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
