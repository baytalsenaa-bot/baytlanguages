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
    <footer className="border-t border-brand-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-semibold text-brand-parchment">{tc("brand")}</p>
            <p className="mt-2 max-w-xs text-sm text-brand-muted">{tf("tagline")}</p>
            <p className="mt-3 max-w-xs text-xs text-brand-muted">{tContact("address")}</p>
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
