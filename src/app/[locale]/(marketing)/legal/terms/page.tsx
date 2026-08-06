import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { LegalPageBody } from "@/components/marketing/LegalPageBody";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.terms" });
  return {
    title: t("title"),
    description: t("intro"),
    ...buildPageMetadata(locale, "/legal/terms"),
  };
}

type LegalSection = { heading: string; body: string };

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal.terms");
  const sections = t.raw("sections") as LegalSection[];

  return (
    <LegalPageBody
      title={t("title")}
      updated={t("updated")}
      intro={t("intro")}
      sections={sections}
    />
  );
}
