"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WhatsAppButton } from "./WhatsAppButton";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/60 bg-brand-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center" aria-label={tc("brand")}>
          <Image
            src="/logo/bayt-languages-header.png"
            alt={tc("brand")}
            width={162}
            height={45}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
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
            {links.map((link) => (
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
