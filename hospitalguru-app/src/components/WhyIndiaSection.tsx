"use client";

import { Shield, Globe, Heart, DollarSign, Languages, Plane } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const reasons = [
  {
    icon: DollarSign,
    color: "bg-green-50 text-green-600",
    en: { title: "Up to 80% Cost Savings", desc: "World-class treatment at a fraction of Western and CIS prices. Heart bypass from $5,500, knee replacement from $4,500." },
    ru: { title: "Экономия до 80%", desc: "Лечение мирового уровня за часть стоимости в СНГ. Шунтирование сердца от $5 500, замена колена от $4 500." },
    kk: { title: "80%-ға дейін үнемдеу", desc: "Әлемдік деңгейдегі емдеу ТМД бағасының бір бөлігіне. Жүрек шунтирование $5 500-ден." },
    uk: { title: "Економія до 80%", desc: "Лікування світового рівня за частину вартості в СНД. Шунтування серця від $5 500." },
  },
  {
    icon: Shield,
    color: "bg-blue-50 text-blue-600",
    en: { title: "JCI & NABH Accredited", desc: "300+ hospitals with international gold-standard accreditation. Same quality standards as the best hospitals in the US and Europe." },
    ru: { title: "Аккредитация JCI и NABH", desc: "300+ больниц с международной аккредитацией золотого стандарта. Те же стандарты качества, что и лучшие больницы США и Европы." },
    kk: { title: "JCI & NABH аккредитация", desc: "300+ халықаралық алтын стандарт аккредитациясы бар аурухана." },
    uk: { title: "Акредитація JCI та NABH", desc: "300+ лікарень з міжнародною акредитацією золотого стандарту." },
  },
  {
    icon: Globe,
    color: "bg-purple-50 text-purple-600",
    en: { title: "2M+ International Patients/Year", desc: "India is the world's #2 medical tourism destination. Over 2 million international patients choose India annually." },
    ru: { title: "2M+ международных пациентов/год", desc: "Индия — №2 в мире по медицинскому туризму. Более 2 миллионов иностранных пациентов ежегодно." },
    kk: { title: "Жылына 2M+ халықаралық пациент", desc: "Үндістан — медициналық туризм бойынша әлемде №2." },
    uk: { title: "2M+ міжнародних пацієнтів/рік", desc: "Індія — №2 у світі з медичного туризму. Понад 2 мільйони іноземних пацієнтів щороку." },
  },
  {
    icon: Languages,
    color: "bg-teal-50 text-teal-600",
    en: { title: "Russian-Speaking Coordinators", desc: "Dedicated Russian-speaking patient coordinators at every partner hospital. No language barrier from arrival to recovery." },
    ru: { title: "Русскоязычные координаторы", desc: "Персональные русскоязычные координаторы в каждой партнёрской больнице. Без языкового барьера от прибытия до выздоровления." },
    kk: { title: "Орысша сөйлейтін үйлестірушілер", desc: "Әрбір серіктес ауруханада жеке орыс тілді үйлестірушілер." },
    uk: { title: "Російськомовні координатори", desc: "Персональні російськомовні координатори в кожній партнерській лікарні." },
  },
  {
    icon: Heart,
    color: "bg-red-50 text-red-600",
    en: { title: "World-Renowned Doctors", desc: "Indian doctors trained at Harvard, Johns Hopkins, and Mayo Clinic. Leaders in cardiac surgery, oncology, orthopedics, and IVF." },
    ru: { title: "Врачи мирового уровня", desc: "Индийские врачи, обучавшиеся в Гарварде, Johns Hopkins и Mayo Clinic. Лидеры в кардиохирургии, онкологии, ортопедии и ЭКО." },
    kk: { title: "Әлемге әйгілі дәрігерлер", desc: "Гарвард, Johns Hopkins және Mayo Clinic-те оқыған үнді дәрігерлері." },
    uk: { title: "Лікарі світового рівня", desc: "Індійські лікарі, що навчались у Гарварді, Johns Hopkins та Mayo Clinic." },
  },
  {
    icon: Plane,
    color: "bg-orange-50 text-orange-600",
    en: { title: "Easy E-Medical Visa", desc: "Simple online e-Medical Visa for all CIS countries. Approved in 3-5 business days. We guide you through every step." },
    ru: { title: "Простая электронная виза", desc: "Простая электронная медицинская виза для всех стран СНГ. Одобрение за 3-5 рабочих дней. Мы сопровождаем на каждом шаге." },
    kk: { title: "Оңай электрондық виза", desc: "Барлық ТМД елдері үшін қарапайым электрондық медициналық виза. 3-5 жұмыс күнде мақұлданады." },
    uk: { title: "Проста електронна віза", desc: "Проста електронна медична віза для всіх країн СНД. Затвердження за 3-5 робочих днів." },
  },
];

const sectionText = {
  en: { badge: "Why India?", title: "Why 2 Million+ Patients Choose India", sub: "India offers world-class healthcare at a fraction of the cost — with zero compromise on quality" },
  ru: { badge: "Почему Индия?", title: "Почему 2 млн+ пациентов выбирают Индию", sub: "Индия предлагает медицину мирового класса за долю стоимости — без компромиссов в качестве" },
  kk: { badge: "Неге Үндістан?", title: "Неге 2 млн+ пациент Үндістанды таңдайды", sub: "Үндістан әлемдік деңгейдегі денсаулық сақтауды арзан бағамен ұсынады" },
  uk: { badge: "Чому Індія?", title: "Чому 2 млн+ пацієнтів обирають Індію", sub: "Індія пропонує медицину світового рівня за частину вартості — без компромісів у якості" },
};

export default function WhyIndiaSection() {
  const { lang } = useLanguage();
  const text = sectionText[lang];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            {text.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{text.title}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{text.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => {
            const Icon = r.icon;
            const content = r[lang];
            return (
              <div key={content.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all">
                <div className={`w-12 h-12 rounded-xl ${r.color} flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{content.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{content.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
