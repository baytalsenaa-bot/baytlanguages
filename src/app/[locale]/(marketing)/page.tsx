import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { Hero } from "@/components/marketing/Hero";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { VerificationTeaser } from "@/components/marketing/VerificationTeaser";
import { SectorsMarquee } from "@/components/marketing/SectorsMarquee";
import { ServiceShowcase, type ShowcaseItem } from "@/components/marketing/ServiceShowcase";
import { serviceCategorySlugs } from "@/lib/services";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FinalCta } from "@/components/marketing/FinalCta";
import {
  StampIcon,
  UsersIcon,
  QrCodeIcon,
  LockIcon,
  ScaleIcon,
  StethoscopeIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  IdCardIcon,
  LanguagesIcon,
  MegaphoneIcon,
  PaletteIcon,
  FilmIcon,
  CodeIcon,
  GearIcon,
  ChartBarIcon,
  SparkleIcon,
  FolderDocIcon,
  GlobeIcon,
} from "@/components/marketing/icons";

type FeatureItem = { title: string; description: string };

const trustIcons = [<StampIcon key="a" />, <UsersIcon key="b" />, <QrCodeIcon key="c" />, <LockIcon key="d" />];
const serviceIcons = [
  <ScaleIcon key="a" />,
  <StethoscopeIcon key="b" />,
  <GraduationCapIcon key="c" />,
  <BriefcaseIcon key="d" />,
  <IdCardIcon key="e" />,
  <StampIcon key="f" />,
];

const categoryIcons: Record<string, React.ReactNode> = {
  "legal-advisory": <ScaleIcon className="h-7 w-7" />,
  "business-consulting": <BriefcaseIcon className="h-7 w-7" />,
  "marketing-growth": <MegaphoneIcon className="h-7 w-7" />,
  "creative-design": <PaletteIcon className="h-7 w-7" />,
  "video-multimedia": <FilmIcon className="h-7 w-7" />,
  "web-development": <CodeIcon className="h-7 w-7" />,
  "business-systems": <GearIcon className="h-7 w-7" />,
  "data-analytics": <ChartBarIcon className="h-7 w-7" />,
  "ai-automation": <SparkleIcon className="h-7 w-7" />,
  "corporate-documentation": <FolderDocIcon className="h-7 w-7" />,
  "china-middle-east": <GlobeIcon className="h-7 w-7" />,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  return {
    title: t("title"),
    description: t("description"),
    ...buildPageMetadata(locale, ""),
  };
}

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
  const faqItems = t.raw("faq.items") as { question: string; answer: string }[];

  const ts = await getTranslations("services");
  const categories = ts.raw("categories") as Record<
    string,
    { title: string; shortDescription: string }
  >;

  const showcaseItems: ShowcaseItem[] = [
    {
      slug: null,
      title: ts("translationLabel"),
      description: t("serviceShowcase.translationDescription"),
      icon: <LanguagesIcon className="h-7 w-7" />,
    },
    ...serviceCategorySlugs.map((slug) => ({
      slug,
      title: categories[slug].title,
      description: categories[slug].shortDescription,
      icon: categoryIcons[slug],
    })),
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <FeatureGrid
        eyebrow={t("trust.eyebrow")}
        title={t("trust.title")}
        items={trustItems}
        icons={trustIcons}
        columns={2}
        tone="surface"
      />
      <SectorsMarquee
        eyebrow={t("sectors.eyebrow")}
        title={t("sectors.title")}
        items={t.raw("sectors.items") as string[]}
      />
      <FeatureGrid
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        items={serviceItems}
        icons={serviceIcons}
        columns={3}
        tone="surface"
      />
      <ServiceShowcase
        eyebrow={t("serviceShowcase.eyebrow")}
        title={t("serviceShowcase.title")}
        subtitle={t("serviceShowcase.subtitle")}
        cta={t("serviceShowcase.cta")}
        items={showcaseItems}
      />
      <ProcessSteps
        eyebrow={t("process.eyebrow")}
        title={t("process.title")}
        steps={processSteps}
      />
      <VerificationTeaser />
      <FaqAccordion eyebrow={t("faq.eyebrow")} title={t("faq.title")} items={faqItems} />
      <FinalCta />
    </>
  );
}
