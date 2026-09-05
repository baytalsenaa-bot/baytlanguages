import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { serviceCategorySlugs } from "@/lib/services";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { ServiceCategoriesGrid } from "@/components/marketing/ServiceCategoriesGrid";
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
  const categoryCards = serviceCategorySlugs.map((slug) => ({
    slug,
    title: categories[slug].title,
    shortDescription: categories[slug].shortDescription,
  }));

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

      <ServiceCategoriesGrid
        eyebrow={t("moreServices.eyebrow")}
        title={t("moreServices.title")}
        subtitle={t("moreServices.subtitle")}
        cta={t("moreServices.cta")}
        categories={categoryCards}
      />

      <FinalCta />
    </>
  );
}
