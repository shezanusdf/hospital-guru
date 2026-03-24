"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ru" | "kk" | "uk";

// ─── All UI translations ───────────────────────────────────────────────────────
export const translations = {
  en: {
    // Navbar
    nav_patients:        "For Patients",
    nav_hospitals:       "Hospitals",
    nav_doctors:         "Doctors",
    nav_treatments:      "Treatments",
    nav_for_doctors:     "For Doctors",
    nav_signin:          "Sign In",
    nav_free_consult:    "Free Consultation",
    nav_top_bar:         "🌍 Serving 15+ CIS countries · First contact: Global International Hospital, Tashkent",

    // Hero — split into base + accent so the accent word can be coloured without hacking
    hero_headline:       "World-Class Treatment in",
    hero_headline_accent:"India",
    hero_sub:            "Trusted by 50,000+ patients from Russia, Kazakhstan, Ukraine & CIS",
    hero_search_ph:      "Search treatment, condition or specialty...",
    hero_city_ph:        "All Cities",
    hero_search_btn:     "Search",
    hero_or:             "or",
    hero_chat_btn:       "Chat with GuruBot",
    hero_stat_patients:  "Patients Helped",
    hero_stat_hospitals: "Hospitals",
    hero_stat_doctors:   "Doctors",
    hero_stat_countries: "CIS Countries",
    hero_tags:           ["Cardiac Surgery", "Cancer Treatment", "Knee Replacement", "IVF", "Liver Transplant", "Spine Surgery"],

    // Specialties
    spec_title:          "Medical Specialties",
    spec_sub:            "World-class care across 30+ specialties",
    spec_view_all:       "View All Specialties",

    // How it works
    hiw_title:           "How It Works",
    hiw_sub:             "From inquiry to recovery — your complete medical journey",
    hiw_steps: [
      { title: "Submit Your Case",       desc: "Share your medical reports and condition via our chatbot or form. 100% free." },
      { title: "Get Expert Opinions",    desc: "Receive treatment plans and cost estimates from top Indian specialists within 24 hours." },
      { title: "Travel to India",        desc: "We arrange visa support, airport transfer, accommodation and interpreter service." },
      { title: "Get Treated & Recover",  desc: "World-class treatment with dedicated case manager support throughout your stay." },
    ],

    // Hospitals
    hosp_title:          "Top Hospitals in India",
    hosp_sub:            "JCI & NABH accredited — highest international standards",
    hosp_view_profile:   "View Profile",
    hosp_view_all:       "View All Hospitals",
    hosp_beds:           "beds",
    hosp_from:           "From",

    // Doctors
    doc_title:           "Leading Specialists",
    doc_sub:             "Hand-picked, internationally trained doctors",
    doc_book:            "Book Consultation",
    doc_available:       "Available Today",
    doc_view_all:        "View All Doctors",
    doc_exp:             "yrs exp.",
    doc_fee:             "Consultation",

    // Cost comparison
    cost_title:          "India vs. CIS — Treatment Costs",
    cost_sub:            "Save 70-85% with the same world-class quality",
    cost_treatment:      "Treatment",
    cost_india:          "India",
    cost_cis:            "Russia / CIS",
    cost_savings:        "Your Savings",
    cost_cta:            "Get Your Free Cost Estimate",

    // Testimonials
    test_title:          "Patient Stories",
    test_sub:            "Real patients, real results",
    test_saved:          "Saved",
    test_vs:             "vs home country",

    // For Doctors
    fordoc_title:        "Are You a Doctor in India?",
    fordoc_sub:          "Join our international recruitment network",
    fordoc_cta1:         "Create Doctor Profile",
    fordoc_cta2:         "Browse Positions",

    // Inquiry
    inq_title:           "Get Your Free Treatment Plan",
    inq_sub:             "Our case managers respond within 2 hours",
    inq_name:            "Full Name",
    inq_email:           "Email Address",
    inq_phone:           "Phone / WhatsApp",
    inq_country:         "Country",
    inq_condition:       "Medical Condition / Treatment",
    inq_message:         "Tell us more (optional)",
    inq_upload:          "Attach Medical Reports",
    inq_upload_sub:      "PDF, JPG, PNG, DICOM up to 25MB",
    inq_submit:          "Submit Inquiry — It's Free",
    inq_success:         "Inquiry submitted! Your reference:",
    inq_privacy:         "Your data is secure. We never share your information.",

    // Footer
    footer_tagline:      "Your trusted medical tourism partner from CIS to India.",
  },

  ru: {
    nav_patients:        "Пациентам",
    nav_hospitals:       "Больницы",
    nav_doctors:         "Врачи",
    nav_treatments:      "Лечение",
    nav_for_doctors:     "Врачам",
    nav_signin:          "Войти",
    nav_free_consult:    "Бесплатная консультация",
    nav_top_bar:         "🌍 Обслуживаем 15+ стран СНГ · Первый контакт: Глобал Интернэшнл Хоспитал, Ташкент",

    hero_headline:        "Лечение мирового класса в",
    hero_headline_accent: "Индии",
    hero_sub:            "Нам доверяют 50 000+ пациентов из России, Казахстана, Украины и СНГ",
    hero_search_ph:      "Поиск лечения, заболевания или специальности...",
    hero_city_ph:        "Все города",
    hero_search_btn:     "Найти",
    hero_or:             "или",
    hero_chat_btn:       "Чат с ГуруБот",
    hero_stat_patients:  "Пациентов",
    hero_stat_hospitals: "Больниц",
    hero_stat_doctors:   "Врачей",
    hero_stat_countries: "Стран СНГ",
    hero_tags:           ["Кардиохирургия", "Онкология", "Замена колена", "ЭКО", "Трансплантация печени", "Хирургия позвоночника"],

    spec_title:          "Медицинские специализации",
    spec_sub:            "Лечение мирового уровня по 30+ специальностям",
    spec_view_all:       "Все специализации",

    hiw_title:           "Как это работает",
    hiw_sub:             "От запроса до выздоровления — полное медицинское путешествие",
    hiw_steps: [
      { title: "Отправьте ваш случай",       desc: "Поделитесь медицинскими документами через чат-бот или форму. Бесплатно." },
      { title: "Получите заключения",         desc: "Планы лечения и смета от ведущих индийских специалистов в течение 24 часов." },
      { title: "Путешествие в Индию",         desc: "Мы помогаем с визой, трансфером, жильём и переводчиком." },
      { title: "Лечение и восстановление",    desc: "Лечение мирового класса с поддержкой персонального куратора на протяжении всего пребывания." },
    ],

    hosp_title:          "Лучшие больницы Индии",
    hosp_sub:            "Аккредитация JCI и NABH — высочайшие международные стандарты",
    hosp_view_profile:   "Профиль",
    hosp_view_all:       "Все больницы",
    hosp_beds:           "коек",
    hosp_from:           "от",

    doc_title:           "Ведущие специалисты",
    doc_sub:             "Отобранные врачи с международным опытом",
    doc_book:            "Записаться",
    doc_available:       "Доступен сегодня",
    doc_view_all:        "Все врачи",
    doc_exp:             "лет опыта",
    doc_fee:             "Консультация",

    cost_title:          "Индия vs. СНГ — стоимость лечения",
    cost_sub:            "Сэкономьте 70–85% при том же качестве мирового уровня",
    cost_treatment:      "Лечение",
    cost_india:          "Индия",
    cost_cis:            "Россия / СНГ",
    cost_savings:        "Ваша экономия",
    cost_cta:            "Узнать стоимость бесплатно",

    test_title:          "Истории пациентов",
    test_sub:            "Реальные пациенты, реальные результаты",
    test_saved:          "Сэкономлено",
    test_vs:             "по сравнению с лечением дома",

    fordoc_title:        "Вы врач в Индии?",
    fordoc_sub:          "Присоединяйтесь к нашей международной сети рекрутинга",
    fordoc_cta1:         "Создать профиль врача",
    fordoc_cta2:         "Смотреть вакансии",

    inq_title:           "Получите бесплатный план лечения",
    inq_sub:             "Наши кураторы отвечают в течение 2 часов",
    inq_name:            "Полное имя",
    inq_email:           "Электронная почта",
    inq_phone:           "Телефон / WhatsApp",
    inq_country:         "Страна",
    inq_condition:       "Заболевание / Вид лечения",
    inq_message:         "Расскажите подробнее (необязательно)",
    inq_upload:          "Прикрепить медицинские документы",
    inq_upload_sub:      "PDF, JPG, PNG, DICOM до 25 МБ",
    inq_submit:          "Отправить запрос — бесплатно",
    inq_success:         "Запрос отправлен! Ваш номер:",
    inq_privacy:         "Ваши данные защищены. Мы никогда не передаём их третьим лицам.",

    footer_tagline:      "Ваш надёжный партнёр в медицинском туризме из СНГ в Индию.",
  },

  kk: {
    nav_patients:        "Пациенттерге",
    nav_hospitals:       "Ауруханалар",
    nav_doctors:         "Дәрігерлер",
    nav_treatments:      "Емдеу",
    nav_for_doctors:     "Дәрігерлерге",
    nav_signin:          "Кіру",
    nav_free_consult:    "Тегін кеңес",
    nav_top_bar:         "🌍 15+ ТМД елдеріне қызмет · Бірінші байланыс: Global International Hospital, Ташкент",

    hero_headline:        "Үндістандағы әлемдік деңгейдегі",
    hero_headline_accent: "емдеу",
    hero_sub:            "Ресей, Қазақстан, Украина және ТМД-дан 50 000+ пациент сенеді",
    hero_search_ph:      "Емдеу, ауру немесе мамандықты іздеңіз...",
    hero_city_ph:        "Барлық қалалар",
    hero_search_btn:     "Іздеу",
    hero_or:             "немесе",
    hero_chat_btn:       "GuruBot-пен сөйлесу",
    hero_stat_patients:  "Пациент",
    hero_stat_hospitals: "Аурухана",
    hero_stat_doctors:   "Дәрігер",
    hero_stat_countries: "ТМД елі",
    hero_tags:           ["Жүрек хирургиясы", "Онкология", "Тізе алмастыру", "ЭКО", "Бауыр трансплантациясы", "Омыртқа хирургиясы"],

    spec_title:          "Медициналық мамандықтар",
    spec_sub:            "30+ мамандық бойынша әлемдік деңгейдегі көмек",
    spec_view_all:       "Барлық мамандықтар",

    hiw_title:           "Қалай жұмыс істейді",
    hiw_sub:             "Сұраудан сауығуға дейін — толық медициналық саяхат",
    hiw_steps: [
      { title: "Жағдайыңызды жіберіңіз",   desc: "Медициналық құжаттарыңызды чат-бот немесе форма арқылы бөлісіңіз. Тегін." },
      { title: "Сараптама алыңыз",           desc: "24 сағат ішінде үздік үнді мамандарынан ем жоспарлары мен бағалар." },
      { title: "Үндістанға саяхат",          desc: "Виза, трансфер, тұрғын үй және аударма қызметтерін ұйымдастырамыз." },
      { title: "Емдеу және қалпына келу",    desc: "Бүкіл болу кезеңінде жеке куратор қолдауымен әлемдік деңгейде емдеу." },
    ],

    hosp_title:          "Үндістандағы үздік ауруханалар",
    hosp_sub:            "JCI және NABH аккредитациясы — жоғары халықаралық стандарттар",
    hosp_view_profile:   "Профиль",
    hosp_view_all:       "Барлық ауруханалар",
    hosp_beds:           "төсек",
    hosp_from:           "бастап",

    doc_title:           "Жетекші мамандар",
    doc_sub:             "Таңдаулы, халықаралық тәжірибесі бар дәрігерлер",
    doc_book:            "Кеңес алу",
    doc_available:       "Бүгін қолжетімді",
    doc_view_all:        "Барлық дәрігерлер",
    doc_exp:             "жыл тәжірибе",
    doc_fee:             "Кеңес",

    cost_title:          "Үндістан vs. ТМД — емдеу құны",
    cost_sub:            "Бірдей сапамен 70–85% үнемдеңіз",
    cost_treatment:      "Емдеу",
    cost_india:          "Үндістан",
    cost_cis:            "Ресей / ТМД",
    cost_savings:        "Үнемдеуіңіз",
    cost_cta:            "Тегін бағаны білу",

    test_title:          "Пациент оқиғалары",
    test_sub:            "Нақты пациенттер, нақты нәтижелер",
    test_saved:          "Үнемделді",
    test_vs:             "үйде емделумен салыстырғанда",

    fordoc_title:        "Сіз Үндістандағы дәрігерсіз бе?",
    fordoc_sub:          "Халықаралық рекрутинг желімізге қосылыңыз",
    fordoc_cta1:         "Дәрігер профилін жасау",
    fordoc_cta2:         "Вакансияларды қарау",

    inq_title:           "Тегін ем жоспарын алыңыз",
    inq_sub:             "Кураторларымыз 2 сағат ішінде жауап береді",
    inq_name:            "Толық аты-жөні",
    inq_email:           "Электрондық пошта",
    inq_phone:           "Телефон / WhatsApp",
    inq_country:         "Ел",
    inq_condition:       "Ауру / Емдеу түрі",
    inq_message:         "Толығырақ айтыңыз (міндетті емес)",
    inq_upload:          "Медициналық құжаттарды тіркеу",
    inq_upload_sub:      "PDF, JPG, PNG, DICOM 25 МБ дейін",
    inq_submit:          "Сұрауды жіберу — Тегін",
    inq_success:         "Сұрау жіберілді! Нөміріңіз:",
    inq_privacy:         "Деректеріңіз қауіпсіз. Біз ешқашан бөліспейміз.",

    footer_tagline:      "ТМД-дан Үндістанға сенімді медициналық туризм серіктесіңіз.",
  },

  uk: {
    nav_patients:        "Пацієнтам",
    nav_hospitals:       "Лікарні",
    nav_doctors:         "Лікарі",
    nav_treatments:      "Лікування",
    nav_for_doctors:     "Лікарям",
    nav_signin:          "Увійти",
    nav_free_consult:    "Безкоштовна консультація",
    nav_top_bar:         "🌍 Обслуговуємо 15+ країн СНД · Перший контакт: Global International Hospital, Ташкент",

    hero_headline:        "Лікування світового класу в",
    hero_headline_accent: "Індії",
    hero_sub:            "Нам довіряють 50 000+ пацієнтів з Росії, Казахстану, України та СНД",
    hero_search_ph:      "Пошук лікування, захворювання або спеціальності...",
    hero_city_ph:        "Всі міста",
    hero_search_btn:     "Шукати",
    hero_or:             "або",
    hero_chat_btn:       "Чат з GuruBot",
    hero_stat_patients:  "Пацієнтів",
    hero_stat_hospitals: "Лікарень",
    hero_stat_doctors:   "Лікарів",
    hero_stat_countries: "Країн СНД",
    hero_tags:           ["Кардіохірургія", "Онкологія", "Заміна коліна", "ЕКЗ", "Трансплантація печінки", "Хірургія хребта"],

    spec_title:          "Медичні спеціальності",
    spec_sub:            "Допомога світового класу за 30+ спеціальностями",
    spec_view_all:       "Всі спеціальності",

    hiw_title:           "Як це працює",
    hiw_sub:             "Від запиту до одужання — повна медична подорож",
    hiw_steps: [
      { title: "Надішліть ваш випадок",    desc: "Поділіться медичними документами через чат-бот або форму. Безкоштовно." },
      { title: "Отримайте висновки",        desc: "Плани лікування та кошторис від провідних індійських спеціалістів протягом 24 годин." },
      { title: "Подорож до Індії",          desc: "Ми допомагаємо з візою, трансфером, житлом та перекладачем." },
      { title: "Лікування та відновлення",  desc: "Лікування світового класу з підтримкою особистого куратора." },
    ],

    hosp_title:          "Найкращі лікарні Індії",
    hosp_sub:            "Акредитація JCI та NABH — найвищі міжнародні стандарти",
    hosp_view_profile:   "Профіль",
    hosp_view_all:       "Всі лікарні",
    hosp_beds:           "ліжок",
    hosp_from:           "Від",

    doc_title:           "Провідні спеціалісти",
    doc_sub:             "Відібрані лікарі з міжнародним досвідом",
    doc_book:            "Записатись",
    doc_available:       "Доступний сьогодні",
    doc_view_all:        "Всі лікарі",
    doc_exp:             "р. досвіду",
    doc_fee:             "Консультація",

    cost_title:          "Індія vs. СНД — вартість лікування",
    cost_sub:            "Заощадьте 70–85% при тій самій якості світового класу",
    cost_treatment:      "Лікування",
    cost_india:          "Індія",
    cost_cis:            "Росія / СНД",
    cost_savings:        "Ваша економія",
    cost_cta:            "Дізнатись вартість безкоштовно",

    test_title:          "Історії пацієнтів",
    test_sub:            "Реальні пацієнти, реальні результати",
    test_saved:          "Зекономлено",
    test_vs:             "порівняно з лікуванням вдома",

    fordoc_title:        "Ви лікар в Індії?",
    fordoc_sub:          "Приєднуйтесь до нашої міжнародної мережі рекрутингу",
    fordoc_cta1:         "Створити профіль лікаря",
    fordoc_cta2:         "Переглянути вакансії",

    inq_title:           "Отримайте безкоштовний план лікування",
    inq_sub:             "Наші куратори відповідають протягом 2 годин",
    inq_name:            "Повне ім'я",
    inq_email:           "Електронна пошта",
    inq_phone:           "Телефон / WhatsApp",
    inq_country:         "Країна",
    inq_condition:       "Захворювання / Вид лікування",
    inq_message:         "Розкажіть детальніше (необов'язково)",
    inq_upload:          "Додати медичні документи",
    inq_upload_sub:      "PDF, JPG, PNG, DICOM до 25 МБ",
    inq_submit:          "Надіслати запит — Безкоштовно",
    inq_success:         "Запит надіслано! Ваш номер:",
    inq_privacy:         "Ваші дані захищені. Ми ніколи не передаємо їх третім особам.",

    footer_tagline:      "Ваш надійний партнер у медичному туризмі з СНД до Індії.",
  },
} as const;

export type TKey = keyof typeof translations.en;

// ─── Context ──────────────────────────────────────────────────────────────────
type LanguageCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tArr: (key: TKey) => any[];
};

const LanguageContext = createContext<LanguageCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  tArr: () => [],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hg_lang") as Lang | null;
    if (saved && ["en", "ru", "kk", "uk"].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("hg_lang", l);
  }

  function t(key: TKey): string {
    const val = translations[lang][key];
    if (Array.isArray(val)) return val.join(", ");
    return val as string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function tArr(key: TKey): any[] {
    const val = translations[lang][key];
    return Array.isArray(val) ? val : [];
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tArr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
