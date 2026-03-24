"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const specialties = [
  {
    name: "Cardiology & Cardiac Surgery", nameRu: "Кардиология и кардиохирургия",
    icon: "🫀", hospitals: 42, avgCost: "$3,500–$8,000", savings: "78%",
    conditions: ["Heart Bypass Surgery", "Heart Valve Replacement", "Angioplasty", "Pacemaker Implant"],
    color: "border-l-red-400 bg-red-50",
  },
  {
    name: "Oncology & Cancer Treatment", nameRu: "Онкология",
    icon: "🔬", hospitals: 38, avgCost: "$3,000–$15,000", savings: "82%",
    conditions: ["Chemotherapy", "Radiation Therapy", "Bone Marrow Transplant", "Targeted Therapy"],
    color: "border-l-purple-400 bg-purple-50",
  },
  {
    name: "Orthopaedics & Joint Replacement", nameRu: "Ортопедия",
    icon: "🦴", hospitals: 55, avgCost: "$4,000–$7,000", savings: "75%",
    conditions: ["Knee Replacement", "Hip Replacement", "Spine Surgery", "Arthroscopy"],
    color: "border-l-orange-400 bg-orange-50",
  },
  {
    name: "Neurology & Neurosurgery", nameRu: "Неврология и нейрохирургия",
    icon: "🧠", hospitals: 31, avgCost: "$5,000–$20,000", savings: "77%",
    conditions: ["Brain Tumour Surgery", "Epilepsy Treatment", "Parkinson's Treatment", "Stroke Rehabilitation"],
    color: "border-l-blue-400 bg-blue-50",
  },
  {
    name: "IVF & Fertility", nameRu: "ЭКО и репродуктология",
    icon: "👶", hospitals: 28, avgCost: "$2,500–$5,000", savings: "80%",
    conditions: ["IVF", "IUI", "Egg Freezing", "Surrogacy"],
    color: "border-l-pink-400 bg-pink-50",
  },
  {
    name: "Organ Transplants", nameRu: "Трансплантология",
    icon: "🫁", hospitals: 19, avgCost: "$15,000–$40,000", savings: "74%",
    conditions: ["Liver Transplant", "Kidney Transplant", "Heart Transplant", "Bone Marrow Transplant"],
    color: "border-l-teal-400 bg-teal-50",
  },
  {
    name: "Spine Surgery", nameRu: "Хирургия позвоночника",
    icon: "🦾", hospitals: 34, avgCost: "$4,500–$12,000", savings: "76%",
    conditions: ["Disc Replacement", "Spinal Fusion", "Scoliosis Surgery", "Minimally Invasive Spine"],
    color: "border-l-slate-400 bg-slate-50",
  },
  {
    name: "Cosmetic & Plastic Surgery", nameRu: "Пластическая хирургия",
    icon: "✨", hospitals: 47, avgCost: "$2,000–$8,000", savings: "79%",
    conditions: ["Rhinoplasty", "Liposuction", "Hair Transplant", "Breast Surgery"],
    color: "border-l-rose-400 bg-rose-50",
  },
  {
    name: "Ophthalmology", nameRu: "Офтальмология",
    icon: "👁️", hospitals: 39, avgCost: "$800–$3,500", savings: "83%",
    conditions: ["LASIK", "Cataract Surgery", "Glaucoma Treatment", "Retinal Surgery"],
    color: "border-l-sky-400 bg-sky-50",
  },
  {
    name: "Dental Treatment", nameRu: "Стоматология",
    icon: "🦷", hospitals: 52, avgCost: "$500–$4,000", savings: "84%",
    conditions: ["Dental Implants", "Full Mouth Rehabilitation", "Veneers", "Orthodontics"],
    color: "border-l-yellow-400 bg-yellow-50",
  },
  {
    name: "Urology", nameRu: "Урология",
    icon: "⚕️", hospitals: 44, avgCost: "$2,000–$6,000", savings: "77%",
    conditions: ["Prostate Surgery", "Kidney Stone Treatment", "Robotic Surgery", "Bladder Cancer"],
    color: "border-l-green-400 bg-green-50",
  },
  {
    name: "Gastroenterology", nameRu: "Гастроэнтерология",
    icon: "🔩", hospitals: 26, avgCost: "$1,500–$8,000", savings: "78%",
    conditions: ["Liver Disease Treatment", "GI Cancer", "Bariatric Surgery", "Colonoscopy"],
    color: "border-l-amber-400 bg-amber-50",
  },
];

export default function TreatmentsPage() {
  const { lang } = useLanguage();

  return (
    <>
      <Navbar />
      <div className="pt-[72px] min-h-screen bg-gray-50">

        {/* Page header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-blue-200 text-sm font-medium mb-1">
              <Link href="/" className="hover:underline">Home</Link> › Treatments
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              {lang === "ru" ? "Виды лечения в Индии" :
               lang === "kk" ? "Үндістандағы емдеу түрлері" :
               lang === "uk" ? "Види лікування в Індії" :
               "Treatments Available in India"}
            </h1>
            <p className="text-blue-100 text-sm">
              {lang === "ru" ? "Сэкономьте 70–85% по сравнению со стоимостью лечения в России и СНГ" :
               "Save 70–85% compared to treatment costs in Russia & CIS countries"}
            </p>
          </div>
        </div>

        {/* Cost savings callout */}
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex flex-wrap items-center gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <div className="font-bold text-blue-800 text-sm">
                {lang === "ru" ? "Средняя экономия для пациентов из СНГ" : "Average savings for CIS patients"}
              </div>
              <div className="text-blue-600 text-xs mt-0.5">
                {lang === "ru"
                  ? "Одни и те же операции обходятся на 70–85% дешевле при том же уровне качества по стандартам JCI/NABH."
                  : "The same procedures cost 70–85% less with the same JCI/NABH quality standards."}
              </div>
            </div>
            <Link href="/#inquiry"
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              {lang === "ru" ? "Узнать стоимость" : "Get Free Estimate"}
            </Link>
          </div>
        </div>

        {/* Specialty cards */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map((s) => (
              <div key={s.name}
                className={cn(`rounded-xl border-l-4 border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow`, s.color)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">
                        {lang === "ru" ? s.nameRu : s.name}
                      </h3>
                      {lang !== "en" && lang !== "ru" && (
                        <div className="text-[10px] text-gray-400">{s.name}</div>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{s.hospitals} hospitals</Badge>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xs">
                    <div className="text-gray-400">{lang === "ru" ? "Стоимость в Индии" : "Cost in India"}</div>
                    <div className="font-bold text-teal-600">{s.avgCost}</div>
                  </div>
                  <div className="text-xs border-l border-gray-100 pl-3">
                    <div className="text-gray-400">{lang === "ru" ? "Экономия" : "Savings"}</div>
                    <div className="font-bold text-green-600">~{s.savings}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {s.conditions.map((c) => (
                    <span key={c} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>

                <Link href="/#inquiry"
                  className="text-xs font-semibold text-blue-600 hover:underline">
                  {lang === "ru" ? "Получить план лечения →" : "Get treatment plan →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
