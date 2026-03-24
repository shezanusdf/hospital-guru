"use client";

import { useState } from "react";
import { Search, MapPin, Stethoscope, ChevronDown, Shield, Clock, Globe, Building2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage, translations } from "@/contexts/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";

const treatmentsList = [
  "Knee Replacement", "Heart Bypass Surgery", "Cancer Treatment",
  "IVF / Fertility", "Liver Transplant", "Spinal Surgery",
  "Hip Replacement", "Neurosurgery", "Cosmetic Surgery", "Bone Marrow Transplant",
];

const cities = ["All India", "Mumbai", "Delhi / NCR", "Chennai", "Bangalore", "Hyderabad", "Pune", "Kolkata"];

const stats = [
  { value: "300+",  icon: Building2, label: { en: "Accredited Hospitals", ru: "Аккредитованных больниц", kk: "Аккредитацияланған аурухана", uk: "Акредитованих лікарень" } },
  { value: "80%",   icon: Shield,    label: { en: "Cost Savings", ru: "Экономия", kk: "Үнемдеу", uk: "Економія" } },
  { value: "4",     icon: Globe,     label: { en: "Languages", ru: "Языка", kk: "Тіл", uk: "Мови" } },
  { value: "24hr",  icon: Clock,     label: { en: "Response Time", ru: "Время ответа", kk: "Жауап уақыты", uk: "Час відповіді" } },
];

export default function HeroSection() {
  const { t, lang } = useLanguage();
  const [treatment, setTreatment]           = useState("");
  const [city, setCity]                     = useState("All India");
  const [treatmentFocus, setTreatmentFocus] = useState(false);
  const [suggestions, setSuggestions]       = useState<string[]>([]);

  const tags = translations[lang].hero_tags as unknown as string[];

  const handleChange = (val: string) => {
    setTreatment(val);
    setSuggestions(
      val.length > 1
        ? treatmentsList.filter((t) => t.toLowerCase().includes(val.toLowerCase())).slice(0, 5)
        : []
    );
  };

  return (
    <section className="relative bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Shield size={14} />
            <span>{t("hero_sub")}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
            {t("hero_headline")}
            <br />
            <span className="text-teal-600">{t("hero_headline_accent")}</span>
          </h1>

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 mb-8">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Treatment */}
              <div className="relative flex-1">
                <div className="flex items-center gap-2 px-4 py-3">
                  <Stethoscope size={18} className="text-blue-500 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-0.5">Treatment / Condition</div>
                    <input
                      type="text"
                      placeholder={t("hero_search_ph")}
                      value={treatment}
                      onChange={(e) => handleChange(e.target.value)}
                      onFocus={() => setTreatmentFocus(true)}
                      onBlur={() => setTimeout(() => setTreatmentFocus(false), 200)}
                      className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                    />
                  </div>
                </div>
                {treatmentFocus && (suggestions.length > 0 || treatment.length === 0) && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 mt-1">
                    {treatment.length === 0 && <div className="px-4 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Popular</div>}
                    {(suggestions.length > 0 ? suggestions : treatmentsList.slice(0, 6)).map((s) => (
                      <button key={s} onMouseDown={() => { setTreatment(s); setSuggestions([]); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden md:block w-px bg-gray-200 my-2" />

              {/* City */}
              <div className="flex items-center gap-2 px-4 py-3 min-w-40">
                <MapPin size={18} className="text-teal-500 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-0.5">City</div>
                  <div className="relative">
                    <select value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full text-sm text-gray-800 outline-none bg-transparent appearance-none cursor-pointer pr-4">
                      {cities.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("prefill-inquiry", { detail: { treatment } }));
                  document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-xl h-auto py-3">
                <Search size={18} />
                {t("hero_search_btn")}
              </Button>
            </div>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-gray-400 text-sm mr-1">Popular:</span>
            {tags.slice(0, 5).map((tag) => (
              <button key={tag} onClick={() => {
                setTreatment(tag);
                window.dispatchEvent(new CustomEvent("prefill-inquiry", { detail: { treatment: tag } }));
                document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
              }}
                className="text-sm bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-3 py-1 rounded-full transition-colors">
                {tag}
              </button>
            ))}
          </div>

          {/* Chat CTA */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="text-gray-400 text-sm">{t("hero_or")}</span>
            <Link
              href="#chatbot"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }),
                "text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200")}
            >
              💬 {t("hero_chat_btn")}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.value} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-center">
                <Icon size={20} className="text-teal-500 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-0.5">{stat.label[lang]}</div>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
          <span>Trusted by patients from:</span>
          <span className="flex items-center gap-1.5">🇷🇺 Russia</span>
          <span className="flex items-center gap-1.5">🇰🇿 Kazakhstan</span>
          <span className="flex items-center gap-1.5">🇺🇦 Ukraine</span>
          <span className="flex items-center gap-1.5">🇺🇿 Uzbekistan</span>
          <span className="flex items-center gap-1.5">🇧🇾 Belarus</span>
          <span className="mx-2 text-gray-200">|</span>
          <span className="font-semibold text-gray-600">JCI ✓</span>
          <span className="font-semibold text-gray-600">NABH ✓</span>
        </div>
      </div>
    </section>
  );
}
