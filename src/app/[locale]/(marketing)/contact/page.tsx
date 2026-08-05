import { getTranslations, setRequestLocale } from "next-intl/server";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";

const MAPS_URL = "https://maps.app.goo.gl/JBj84RG7jz9eY7aH8?g_st=ic";

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
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-10 text-center">
            <WhatsAppButton />
            <p className="text-sm text-brand-muted">{t("note")}</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-brand-border bg-brand-surface p-10 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-brand-gold">
              {t("addressLabel")}
            </p>
            <p className="text-brand-parchment">{t("address")}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-brand-muted underline hover:text-brand-parchment"
            >
              {t("mapCta")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
