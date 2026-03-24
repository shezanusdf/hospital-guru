"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhatsAppIcon } from "@/components/icons";

export default function StickyMobileCTA() {
  const { lang } = useLanguage();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex gap-2">
      <a
        href="https://wa.me/918800791204"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl py-3 transition-colors"
      >
        <WhatsAppIcon size={18} />
        WhatsApp
      </a>
      <Link
        href="/#inquiry"
        className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl py-3 transition-colors"
      >
        {lang === "ru" ? "Бесплатная консультация" : "Free Consultation"}
      </Link>
    </div>
  );
}
