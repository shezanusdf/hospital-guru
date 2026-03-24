"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown, Globe } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "kk", label: "KK", flag: "🇰🇿" },
  { code: "uk", label: "UA", flag: "🇺🇦" },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  const current = LANGS.find((l) => l.code === lang)!;

  const navLinks = [
    { key: "nav_patients",   label: t("nav_patients"),   href: "/#inquiry"     },
    { key: "nav_hospitals",  label: t("nav_hospitals"),  href: "/hospitals"    },
    { key: "nav_doctors",    label: t("nav_doctors"),    href: "/doctors"      },
    { key: "nav_treatments", label: t("nav_treatments"), href: "/treatments"   },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col">
      {/* Announcement bar */}
      <div className="bg-blue-700 text-white text-xs px-4 py-1.5 text-center hidden sm:block">
        <span className="flex items-center justify-center gap-2">
          <Phone size={11} />
          {t("nav_top_bar")}
        </span>
      </div>

      {/* Main bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-black text-blue-700 leading-none">Hospital</span>
            <span className="text-2xl font-black text-teal-500 leading-none">Guru</span>
            <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0.5 ml-1 hidden sm:inline-flex">
              .com
            </Badge>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Globe size={14} className="text-gray-400" />
                <span>{current.flag}</span>
                <span>{current.label}</span>
                <ChevronDown size={12} className={cn("text-gray-400 transition-transform duration-200", langDropdown && "rotate-180")} />
              </button>

              {langDropdown && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setLangDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-1.5 min-w-[140px] z-50">
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangDropdown(false); }}
                        className={cn(
                          "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          lang === l.code
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span>{l.label}</span>
                        {lang === l.code && <span className="ml-auto text-xs opacity-80">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="#inquiry"
              className={cn(buttonVariants({ size: "sm" }), "bg-blue-600 hover:bg-blue-700 text-white font-semibold hidden md:flex")}
            >
              {t("nav_free_consult")}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-5 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              {/* Mobile language picker */}
              <div className="flex gap-2 flex-wrap">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors",
                      lang === l.code
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 text-gray-600 hover:border-blue-300"
                    )}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
              <Link
                href="#inquiry"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700 w-full font-semibold")}
              >
                {t("nav_free_consult")}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
