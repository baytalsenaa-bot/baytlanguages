"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WhatsAppButton } from "./WhatsAppButton";
import { ShieldCheckIcon, ChevronDownIcon } from "./icons";
import { serviceCategorySlugs } from "@/lib/services";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const ts = useTranslations("services");
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const categories = ts.raw("categories") as Record<string, { title: string }>;
  const serviceLinks = [
    { href: "/services", label: ts("hero.eyebrow") },
    ...serviceCategorySlugs.map((slug) => ({
      href: `/services/${slug}`,
      label: categories[slug].title,
    })),
  ];

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/60 bg-brand-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center rounded-lg bg-white px-3 py-1.5 shadow-sm"
          aria-label={tc("brand")}
        >
          <Image
            src="/logo/bayt-languages-color.png"
            alt={tc("brand")}
            width={1534}
            height={512}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-brand-muted decoration-brand-gold underline-offset-8 transition-colors hover:text-brand-parchment hover:underline"
          >
            {t("home")}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-brand-muted decoration-brand-gold underline-offset-8 transition-colors hover:text-brand-parchment hover:underline"
          >
            {t("about")}
          </Link>

          <div className="group relative">
            <Link
              href="/services"
              className="flex items-center gap-1 text-sm font-medium text-brand-muted decoration-brand-gold underline-offset-8 transition-colors hover:text-brand-parchment hover:underline"
            >
              {t("services")}
              <ChevronDownIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>

            <div className="invisible absolute start-0 top-full z-50 w-72 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-brand-border bg-brand-ink shadow-xl shadow-black/30">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-parchment"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {links.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-muted decoration-brand-gold underline-offset-8 transition-colors hover:text-brand-parchment hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/verify"
            className="flex items-center gap-1.5 text-sm font-medium text-brand-gold transition-colors hover:text-brand-gold-soft"
          >
            <ShieldCheckIcon className="h-4 w-4" />
            {t("verify")}
          </Link>
          <LanguageSwitcher />
          <WhatsAppButton variant="outline" />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-border text-brand-parchment md:hidden"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-brand-border/60 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-brand-muted decoration-brand-gold underline-offset-8 transition-colors hover:text-brand-parchment hover:underline"
            >
              {t("home")}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-brand-muted decoration-brand-gold underline-offset-8 transition-colors hover:text-brand-parchment hover:underline"
            >
              {t("about")}
            </Link>

            <div>
              <button
                type="button"
                onClick={() => setIsServicesOpen((open) => !open)}
                aria-expanded={isServicesOpen}
                className="flex w-full items-center justify-between text-sm font-medium text-brand-muted transition-colors hover:text-brand-parchment"
              >
                {t("services")}
                <ChevronDownIcon
                  className={`h-3.5 w-3.5 transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isServicesOpen && (
                <div className="mt-3 flex flex-col gap-3 border-s border-brand-border ps-4">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-sm text-brand-muted transition-colors hover:text-brand-parchment"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {links.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-brand-muted decoration-brand-gold underline-offset-8 transition-colors hover:text-brand-parchment hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/verify"
            onClick={() => setIsOpen(false)}
            className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-gold"
          >
            <ShieldCheckIcon className="h-4 w-4" />
            {t("verify")}
          </Link>
          <div className="mt-4 flex items-center justify-between gap-4">
            <LanguageSwitcher />
          </div>
          <WhatsAppButton className="mt-4 w-full justify-center" />
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
