import { getTranslations, setRequestLocale } from "next-intl/server";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { FinalCta } from "@/components/marketing/FinalCta";

type FeatureItem = { title: string; description: string };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const values = t.raw("values.items") as FeatureItem[];

  return (
    <>
      <SimpleHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />
      <FeatureGrid title={t("values.title")} items={values} columns={3} />
      <FinalCta />
    </>
  );
}
