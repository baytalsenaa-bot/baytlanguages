import { getTranslations, setRequestLocale } from "next-intl/server";
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

const serviceIcons = [
  <ScaleIcon key="a" />,
  <StethoscopeIcon key="b" />,
  <GraduationCapIcon key="c" />,
  <BriefcaseIcon key="d" />,
  <IdCardIcon key="e" />,
  <StampIcon key="f" />,
];

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
      <FinalCta />
    </>
  );
}
