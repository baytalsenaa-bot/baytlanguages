import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Montserrat, Geist_Mono, Cairo, Noto_Sans_SC } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://baytlanguages.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bayt Languages — Certified Translation, Verified by Design",
  description:
    "Bayt Languages delivers certified, notarized, and specialist translations with a digitally verifiable certificate on every document.",
  openGraph: {
    siteName: "Bayt Languages",
    type: "website",
    images: [{ url: "/logo/bayt-languages-color.png", width: 1534, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo/bayt-languages-color.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Bayt Languages",
  url: siteUrl,
  logo: `${siteUrl}/logo/bayt-languages-color.png`,
  email: "info@baytlanguages.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "90th Street South, The Fifth Settlement",
    addressLocality: "New Cairo",
    addressCountry: "EG",
  },
  areaServed: "EG",
  priceRange: "$$",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${montserrat.variable} ${geistMono.variable} ${cairo.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body className="marketing-root min-h-full bg-brand-ink text-brand-parchment">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
