import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { SimpleHero } from "@/components/marketing/SimpleHero";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";

const MAPS_URL = "https://maps.app.goo.gl/JBj84RG7jz9eY7aH8?g_st=ic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.contact" });
  return {
    title: t("title"),
    description: t("description"),
    ...buildPageMetadata(locale, "/contact"),
  };
}

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
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-10 text-center transition-colors hover:border-brand-gold/40">
            <WhatsAppButton />
            <p className="text-sm text-brand-muted">{t("note")}</p>
            <p className="text-xs uppercase tracking-widest text-brand-gold">
              {t("replyNote")}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-brand-border bg-brand-surface p-10 text-center transition-colors hover:border-brand-gold/40">
            <p className="text-sm font-medium uppercase tracking-widest text-brand-gold">
              {t("addressLabel")}
            </p>
            <p className="text-brand-parchment">{t("address")}</p>
            <p className="mt-4 text-sm font-medium uppercase tracking-widest text-brand-gold">
              {t("hoursLabel")}
            </p>
            <p className="text-brand-muted">{t("hours")}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm text-brand-parchment underline hover:text-brand-gold"
            >
              {t("mapCta")}
            </a>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-10 text-center transition-colors hover:border-brand-gold/40">
            <p className="text-sm font-medium uppercase tracking-widest text-brand-gold">
              {t("emailLabel")}
            </p>
            <p className="text-brand-parchment">{t("email")}</p>
            <a
              href={`mailto:${t("email")}`}
              className="mt-2 inline-flex items-center justify-center rounded-full border border-brand-gold/50 px-6 py-2 text-sm font-medium text-brand-parchment transition-colors hover:bg-brand-gold hover:text-brand-ink"
            >
              {t("emailCta")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
