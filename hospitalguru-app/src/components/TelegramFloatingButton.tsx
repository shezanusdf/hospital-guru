"use client";

import { TelegramIcon } from "@/components/icons";
import { useLanguage } from "@/contexts/LanguageContext";

// Replace with your Telegram username or phone: https://t.me/yourusername
const TELEGRAM_URL = "https://t.me/hospitalguru";

export default function TelegramFloatingButton() {
  const { lang } = useLanguage();
  const label =
    lang === "ru" ? "Написать в Telegram" :
    lang === "kk" ? "Telegram-да жазу" :
    lang === "uk" ? "Написати в Telegram" :
    "Chat on Telegram";

  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        fixed z-50
        bottom-22 right-4
        md:bottom-8 md:right-6
        flex items-center gap-2
        bg-[#0088cc] hover:bg-[#0077b5]
        text-white font-semibold text-sm
        rounded-full shadow-lg hover:shadow-xl
        transition-all duration-200 hover:scale-105
        px-4 py-3 md:px-5 md:py-3.5
        group
      "
    >
      <TelegramIcon size={20} />
      <span className="hidden md:inline whitespace-nowrap">{label}</span>
    </a>
  );
}
