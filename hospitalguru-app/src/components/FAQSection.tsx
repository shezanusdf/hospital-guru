"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type FAQItem = { q: string; a: string };

const faqData: Record<string, FAQItem[]> = {
  en: [
    { q: "Do I need a visa to travel to India for treatment?", a: "Yes, but it's easy. India offers an e-Medical Visa for citizens of all CIS countries. You can apply online in 15 minutes and receive approval in 3-5 business days. We provide a visa invitation letter from the hospital and guide you through every step." },
    { q: "Will there be a Russian-speaking translator?", a: "Absolutely. All our partner hospitals have dedicated Russian-speaking patient coordinators. They assist you from airport pickup through your entire treatment, hospital stay, and follow-up. There is zero language barrier." },
    { q: "How do I send my medical reports?", a: "You can upload your reports directly through our inquiry form, send them via WhatsApp to +91 8800 791 204, or email them. Our medical team reviews your reports within 24 hours and provides a treatment plan with cost estimates." },
    { q: "Is treatment in India safe?", a: "India's top hospitals hold JCI (Joint Commission International) and NABH accreditation — the same quality standards as the best hospitals in the US and Europe. Over 2 million international patients choose India annually, including from the US, UK, Middle East, and CIS countries." },
    { q: "How do I pay for treatment?", a: "Hospitals accept international wire transfers, credit/debit cards (Visa, Mastercard), and some accept payment plans. You receive a detailed cost estimate before traveling. No hidden fees — the quoted price includes treatment, hospital stay, and medications." },
    { q: "How long will I need to stay in India?", a: "It depends on the treatment. Knee replacement: 10-14 days. Heart bypass: 14-21 days. IVF: 14-21 days. We provide a detailed timeline with your treatment plan so you can plan your trip accordingly." },
    { q: "What about follow-up care after I return home?", a: "All partner hospitals provide post-treatment follow-up via video consultations and WhatsApp. Your doctor monitors your recovery remotely. If any issues arise, we coordinate immediate support with the medical team." },
  ],
  ru: [
    { q: "Нужна ли мне виза для лечения в Индии?", a: "Да, но это просто. Индия предлагает электронную медицинскую визу для граждан всех стран СНГ. Заявка онлайн занимает 15 минут, одобрение — 3-5 рабочих дней. Мы предоставляем приглашение от больницы и сопровождаем на каждом шаге." },
    { q: "Будет ли русскоязычный переводчик?", a: "Обязательно. Во всех наших партнёрских больницах есть русскоязычные координаторы. Они сопровождают вас от встречи в аэропорту до выписки и последующего наблюдения. Никакого языкового барьера." },
    { q: "Как отправить медицинские документы?", a: "Загрузите отчёты через нашу форму, отправьте через WhatsApp на +91 8800 791 204 или по email. Наша медицинская команда рассмотрит документы в течение 24 часов и предоставит план лечения с расчётом стоимости." },
    { q: "Безопасно ли лечение в Индии?", a: "Ведущие больницы Индии имеют аккредитацию JCI и NABH — те же стандарты качества, что и лучшие больницы США и Европы. Более 2 миллионов иностранных пациентов выбирают Индию ежегодно." },
    { q: "Как оплатить лечение?", a: "Больницы принимают международные банковские переводы, карты Visa/Mastercard, некоторые предлагают рассрочку. Вы получите детальную смету до поездки. Никаких скрытых платежей — указанная цена включает лечение, пребывание и лекарства." },
    { q: "Сколько нужно находиться в Индии?", a: "Зависит от лечения. Замена колена: 10-14 дней. Шунтирование сердца: 14-21 день. ЭКО: 14-21 день. Мы предоставим подробный график с планом лечения." },
    { q: "Что с наблюдением после возвращения домой?", a: "Все партнёрские больницы проводят послеоперационные консультации по видеосвязи и WhatsApp. Ваш врач наблюдает за восстановлением удалённо. При любых вопросах мы немедленно связываемся с медицинской командой." },
  ],
  kk: [
    { q: "Үндістанда емделу үшін виза керек пе?", a: "Иә, бірақ бұл оңай. Үндістан барлық ТМД елдерінің азаматтары үшін электрондық медициналық виза ұсынады. 15 минутта онлайн өтінім, 3-5 жұмыс күнде мақұлдау." },
    { q: "Орыс тілді аудармашы бола ма?", a: "Міндетті түрде. Барлық серіктес ауруханаларда орыс тілді үйлестірушілер бар." },
    { q: "Медициналық құжаттарды қалай жіберемін?", a: "Біздің форма арқылы жүктеңіз, WhatsApp-қа +91 8800 791 204 жіберіңіз немесе email арқылы." },
    { q: "Үндістандағы емдеу қауіпсіз бе?", a: "Үндістанның жетекші ауруханалары JCI және NABH аккредитациясына ие — АҚШ пен Еуропадағы ең жақсы ауруханалармен бірдей сапа стандарттары." },
    { q: "Емдеуді қалай төлеуге болады?", a: "Ауруханалар халықаралық банк аударымдарын, Visa/Mastercard карталарын қабылдайды." },
    { q: "Үндістанда қанша уақыт болу керек?", a: "Емдеуге байланысты. Тізе ауыстыру: 10-14 күн. Жүрек шунтирование: 14-21 күн." },
    { q: "Үйге оралғаннан кейін бақылау қалай?", a: "Барлық серіктес ауруханалар бейне байланыс және WhatsApp арқылы операциядан кейінгі кеңес береді." },
  ],
  uk: [
    { q: "Чи потрібна мені віза для лікування в Індії?", a: "Так, але це просто. Індія пропонує електронну медичну візу для громадян усіх країн СНД. Заявка онлайн за 15 хвилин, затвердження за 3-5 робочих днів." },
    { q: "Чи буде російськомовний перекладач?", a: "Обов'язково. У всіх наших партнерських лікарнях є російськомовні координатори." },
    { q: "Як надіслати медичні документи?", a: "Завантажте через нашу форму, надішліть через WhatsApp на +91 8800 791 204 або email." },
    { q: "Чи безпечне лікування в Індії?", a: "Провідні лікарні Індії мають акредитацію JCI та NABH — ті самі стандарти якості, що й найкращі лікарні США та Європи." },
    { q: "Як оплатити лікування?", a: "Лікарні приймають міжнародні банківські перекази, картки Visa/Mastercard." },
    { q: "Скільки потрібно перебувати в Індії?", a: "Залежить від лікування. Заміна коліна: 10-14 днів. Шунтування серця: 14-21 день." },
    { q: "Що з наглядом після повернення додому?", a: "Усі партнерські лікарні проводять консультації по відеозв'язку та WhatsApp після операції." },
  ],
};

const sectionText = {
  en: { badge: "FAQ", title: "Frequently Asked Questions", sub: "Everything you need to know about medical treatment in India" },
  ru: { badge: "Вопросы", title: "Часто задаваемые вопросы", sub: "Всё, что нужно знать о лечении в Индии" },
  kk: { badge: "Сұрақтар", title: "Жиі қойылатын сұрақтар", sub: "Үндістандағы емдеу туралы білуіңіз керек нәрсе" },
  uk: { badge: "Питання", title: "Часті запитання", sub: "Все, що потрібно знати про лікування в Індії" },
};

function Accordion({ item, isOpen, toggle }: { item: FAQItem; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={toggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
        <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const { lang } = useLanguage();
  const text = sectionText[lang];
  const items = faqData[lang] || faqData.en;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            <HelpCircle size={14} />
            {text.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{text.title}</h2>
          <p className="text-gray-500">{text.sub}</p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <Accordion
              key={i}
              item={item}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
