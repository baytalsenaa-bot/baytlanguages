import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WhatsAppIcon } from "./WhatsAppButton";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tf = useTranslations("footer");
  const tContact = useTranslations("contact");
  const tLegal = useTranslations("legal");
  const year = new Date().getFullYear();

  const sitemapLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  const importantLinks = [
    { href: "/verify", label: t("verify") },
    { href: "/legal/privacy", label: tLegal("privacy.navLabel") },
    { href: "/legal/terms", label: tLegal("terms.navLabel") },
    { href: "/legal/confidentiality", label: tLegal("confidentiality.navLabel") },
  ];

  const socialLinks = [
    { href: "https://www.facebook.com/baytlanguages", label: "Facebook", icon: FacebookIcon },
    {
      href: "https://www.linkedin.com/company/baytlanguages",
      label: "LinkedIn",
      icon: LinkedInIcon,
    },
    { href: getWhatsAppUrl(tc("whatsappMessage")), label: "WhatsApp", icon: WhatsAppIcon },
  ];

  return (
    <footer className="bg-brand-surface/40">
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 shadow-sm">
              <Image
                src="/logo/bayt-languages-color.png"
                alt={tc("brand")}
                width={1534}
                height={512}
                className="h-10 w-auto"
              />
            </div>
            <p className="mt-3 max-w-xs text-sm text-brand-muted">{tf("tagline")}</p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-gold">
              {tf("socialHeading")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-muted transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              {tf("sitemapHeading")}
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {sitemapLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-muted transition-colors hover:text-brand-parchment"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              {tf("linksHeading")}
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {importantLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-muted transition-colors hover:text-brand-parchment"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              {tf("contactHeading")}
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-brand-muted">
              <p>{tContact("address")}</p>
              <a
                href={`mailto:${tContact("email")}`}
                className="underline hover:text-brand-parchment"
              >
                {tContact("email")}
              </a>
              <p>{tContact("hours")}</p>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-brand-border/60 pt-6 text-xs text-brand-muted">
          © {year} {tc("brand")}. {tf("rights")}
        </p>
      </div>
    </footer>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.3-1.4 1.5-1.4h1.4V5.3c-.3 0-1.2-.1-2.2-.1-2.3 0-3.8 1.3-3.8 3.8V11H8v2.8h2.4V21h3.1Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 5.5 4ZM20 20h-2.88v-6.02c0-1.44-.52-2.43-1.82-2.43-.99 0-1.58.67-1.84 1.31-.1.23-.12.55-.12.87V20H10.5s.04-10.62 0-11.5h2.88v1.63c.38-.59 1.07-1.43 2.6-1.43 1.9 0 3.02 1.24 3.02 3.9V20Z" />
    </svg>
  );
}
