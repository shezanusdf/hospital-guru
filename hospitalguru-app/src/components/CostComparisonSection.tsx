"use client";

import Link from "next/link";
import { TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const treatments = [
  { name: "Knee Replacement", nameRu: "Замена коленного сустава", india: 4500, russia: 28000, saving: 84 },
  { name: "Heart Bypass (CABG)", nameRu: "Аортокоронарное шунтирование", india: 5500, russia: 35000, saving: 84 },
  { name: "Liver Transplant", nameRu: "Трансплантация печени", india: 28000, russia: 150000, saving: 81 },
  { name: "IVF Treatment", nameRu: "ЭКО", india: 2800, russia: 12000, saving: 77 },
  { name: "Spinal Fusion", nameRu: "Спондилодез", india: 5000, russia: 30000, saving: 83 },
  { name: "Bone Marrow Transplant", nameRu: "Трансплантация костного мозга", india: 18000, russia: 100000, saving: 82 },
  { name: "Hip Replacement", nameRu: "Замена тазобедренного сустава", india: 5000, russia: 25000, saving: 80 },
  { name: "Cochlear Implant", nameRu: "Кохлеарный имплант", india: 12000, russia: 55000, saving: 78 },
];

function formatUSD(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

const sectionText = {
  en: { badge: "Cost Savings", title: "Save Up to 84% on Treatment Cost", sub: "Compare the cost of procedures in India vs Russia/CIS countries. Same world-class quality — dramatically lower cost.", cta: "Get a Free Cost Estimate", note: "* Costs are indicative estimates and may vary by hospital, doctor, and patient condition." },
  ru: { badge: "Экономия", title: "Экономия до 84% на лечении", sub: "Сравните стоимость процедур в Индии и России/СНГ. То же мировое качество — значительно ниже стоимость.", cta: "Получить бесплатную оценку", note: "* Цены являются ориентировочными и могут варьироваться." },
  kk: { badge: "Үнемдеу", title: "Емдеу құнын 84%-ға дейін үнемдеңіз", sub: "Үндістан мен ТМД елдеріндегі процедуралар құнын салыстырыңыз.", cta: "Тегін баға алу", note: "* Бағалар шамамен және өзгеруі мүмкін." },
  uk: { badge: "Економія", title: "Заощаджуйте до 84% на лікуванні", sub: "Порівняйте вартість процедур в Індії та країнах СНД.", cta: "Отримати безкоштовну оцінку", note: "* Ціни орієнтовні та можуть змінюватися." },
};

export default function CostComparisonSection() {
  const { lang } = useLanguage();
  const text = sectionText[lang];

  return (
    <section id="costs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3 border border-teal-100">
            <TrendingDown size={14} />
            {text.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            {text.title}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            {text.sub}
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3.5 px-5 text-gray-500 font-medium">Treatment</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium">India 🇮🇳</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium">Russia / CIS 🇷🇺</th>
                  <th className="text-center py-3.5 px-4 text-teal-600 font-bold">Your Savings</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((t, i) => (
                  <tr
                    key={t.name}
                    className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-gray-400 text-xs">{t.nameRu}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-teal-600 font-bold text-lg">{formatUSD(t.india)}</span>
                      <div className="text-gray-400 text-xs">Starting from</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-400 font-semibold line-through">{formatUSD(t.russia)}</span>
                      <div className="text-gray-400 text-xs">Average</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-teal-50 text-teal-700 font-black px-3 py-1 rounded-full text-sm border border-teal-100">
                        {t.saving}% less
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-xs">
          {text.note}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="#inquiry"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-sm"
          >
            {text.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
