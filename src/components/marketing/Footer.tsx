import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tf = useTranslations("footer");
  const tContact = useTranslations("contact");
  const year = new Date().getFullYear();

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <footer className="bg-brand-surface/40">
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
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
            <p className="mt-3 max-w-xs text-xs text-brand-muted">{tContact("address")}</p>
            <a
              href={`mailto:${tContact("email")}`}
              className="mt-1 block text-xs text-brand-muted underline hover:text-brand-parchment"
            >
              {tContact("email")}
            </a>
          </div>

          <nav className="flex flex-wrap gap-6">
            {links.map((link) => (
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

        <p className="mt-10 text-xs text-brand-muted">
          © {year} {tc("brand")}. {tf("rights")}
        </p>
      </div>
    </footer>
  );
}
