import { getTranslations, setRequestLocale } from "next-intl/server";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <>
      <SimpleHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />
      <section className="px-4 pb-24">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-10 text-center">
          <WhatsAppButton />
          <p className="text-sm text-brand-muted">{t("note")}</p>
        </div>
      </section>
    </>
  );
}
