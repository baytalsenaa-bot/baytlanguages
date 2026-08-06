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
  const t = await getTranslations({ locale, namespace: "legal.confidentiality" });
  return {
    title: t("title"),
    description: t("intro"),
    ...buildPageMetadata(locale, "/legal/confidentiality"),
  };
}

type LegalSection = { heading: string; body: string };

export default async function ConfidentialityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal.confidentiality");
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
