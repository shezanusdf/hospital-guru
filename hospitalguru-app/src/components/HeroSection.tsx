"use client";

import { useState } from "react";
import { Search, MapPin, Stethoscope, ChevronDown, ArrowRight, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage, translations } from "@/contexts/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";

const treatments = [
  "Knee Replacement", "Heart Bypass Surgery", "Cancer Treatment",
  "IVF / Fertility", "Liver Transplant", "Spinal Surgery",
  "Hip Replacement", "Neurosurgery", "Cosmetic Surgery", "Bone Marrow Transplant",
];

const cities = ["All India", "Mumbai", "Delhi / NCR", "Chennai", "Bangalore", "Hyderabad", "Pune", "Kolkata"];

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
        ? treatments.filter((t) => t.toLowerCase().includes(val.toLowerCase())).slice(0, 5)
        : []
    );
  };

  const stats = [
    { value: "50,000+", key: "hero_stat_patients"  as const },
    { value: "200+",    key: "hero_stat_hospitals" as const },
    { value: "1,500+",  key: "hero_stat_doctors"   as const },
    { value: "15+",     key: "hero_stat_countries" as const },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
        <div className="max-w-3xl">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span>{t("hero_sub")}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            {t("hero_headline")}
            {" "}
            <span className="text-teal-300">{t("hero_headline_accent")}</span>
          </h1>

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 mb-8">
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
                    {(suggestions.length > 0 ? suggestions : treatments.slice(0, 6)).map((s) => (
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
              <div className="flex items-center gap-2 px-4 py-3 min-w-[160px]">
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

          {/* Or + chat CTA */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-blue-200 text-sm">{t("hero_or")}</span>
            <Link
              href="#chatbot"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }),
                "bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm")}
            >
              💬 {t("hero_chat_btn")}
            </Link>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-blue-200 text-sm mr-1">Popular:</span>
            {tags.slice(0, 5).map((tag) => (
              <button key={tag} onClick={() => {
                setTreatment(tag);
                window.dispatchEvent(new CustomEvent("prefill-inquiry", { detail: { treatment: tag } }));
                document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
              }}
                className="text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.key} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-4 text-center">
              <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
              <div className="text-blue-200 text-sm mt-0.5">{t(stat.key)}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2 text-blue-200 text-sm">
          <ArrowRight size={16} />
          <span>Scroll to explore hospitals, doctors, and treatment costs</span>
        </div>
      </div>
    </section>
  );
}
