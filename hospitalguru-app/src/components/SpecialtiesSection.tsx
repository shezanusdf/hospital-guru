"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const specialties = [
  { name: "Cardiology",       nameRu: "Кардиология",           nameKk: "Кардиология",       nameUk: "Кардіологія",         icon: "🫀", count: 42 },
  { name: "Oncology",         nameRu: "Онкология",             nameKk: "Онкология",          nameUk: "Онкологія",           icon: "🔬", count: 38 },
  { name: "Orthopedics",      nameRu: "Ортопедия",             nameKk: "Ортопедия",          nameUk: "Ортопедія",           icon: "🦴", count: 55 },
  { name: "Neurology",        nameRu: "Неврология",            nameKk: "Неврология",         nameUk: "Неврологія",          icon: "🧠", count: 31 },
  { name: "IVF & Fertility",  nameRu: "ЭКО и репродуктология", nameKk: "ЭКО",               nameUk: "ЕКЗ",                 icon: "👶", count: 28 },
  { name: "Transplants",      nameRu: "Трансплантология",       nameKk: "Трансплантология",   nameUk: "Трансплантологія",    icon: "🫁", count: 19 },
  { name: "Spine Surgery",    nameRu: "Хирургия позвоночника",  nameKk: "Омыртқа хирургиясы", nameUk: "Хірургія хребта",     icon: "🦾", count: 34 },
  { name: "Cosmetic Surgery", nameRu: "Пластическая хирургия",  nameKk: "Пластикалық хирургия", nameUk: "Пластична хірургія", icon: "✨", count: 47 },
  { name: "Ophthalmology",    nameRu: "Офтальмология",          nameKk: "Офтальмология",      nameUk: "Офтальмологія",       icon: "👁️", count: 39 },
  { name: "Dental",           nameRu: "Стоматология",           nameKk: "Стоматология",       nameUk: "Стоматологія",        icon: "🦷", count: 52 },
  { name: "Urology",          nameRu: "Урология",               nameKk: "Урология",           nameUk: "Урологія",            icon: "⚕️", count: 44 },
  { name: "Gastroenterology", nameRu: "Гастроэнтерология",      nameKk: "Гастроэнтерология",  nameUk: "Гастроентерологія",   icon: "🔩", count: 26 },
];

const nameKey: Record<string, keyof typeof specialties[0]> = {
  en: "name", ru: "nameRu", kk: "nameKk", uk: "nameUk",
};

export default function SpecialtiesSection() {
  const { t, lang } = useLanguage();
  const key = nameKey[lang] ?? "name";

  return (
    <section id="specialties" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 font-semibold tracking-wide uppercase text-[11px]">Medical Specialties</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{t("spec_title")}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t("spec_sub")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {specialties.map((s) => (
            <Link
              key={s.name}
              href={`#specialty-${s.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group bg-white rounded-xl p-4 text-center hover:shadow-md hover:border-blue-200 border border-transparent transition-all duration-200"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {s.icon}
              </div>
              <div className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 mb-0.5 leading-tight">
                {s[key] as string}
              </div>
              <div className="text-xs text-gray-400">{s.count} hospitals</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline">
            {t("spec_view_all")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
