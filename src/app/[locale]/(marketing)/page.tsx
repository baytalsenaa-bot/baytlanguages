import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { VerificationTeaser } from "@/components/marketing/VerificationTeaser";
import { FinalCta } from "@/components/marketing/FinalCta";

type FeatureItem = { title: string; description: string };

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  const trustItems = t.raw("trust.items") as FeatureItem[];
  const serviceItems = t.raw("services.items") as FeatureItem[];
  const processSteps = t.raw("process.steps") as FeatureItem[];

  return (
    <>
      <Hero />
      <FeatureGrid
        eyebrow={t("trust.eyebrow")}
        title={t("trust.title")}
        items={trustItems}
        columns={2}
      />
      <FeatureGrid
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        items={serviceItems}
        columns={3}
      />
      <ProcessSteps
        eyebrow={t("process.eyebrow")}
        title={t("process.title")}
        steps={processSteps}
      />
      <VerificationTeaser />
      <FinalCta />
    </>
  );
}
