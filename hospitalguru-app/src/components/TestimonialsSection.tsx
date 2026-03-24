import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Алексей Петров",
    nameEn: "Alexey Petrov",
    country: "🇷🇺 Russia, Moscow",
    treatment: "Heart Bypass Surgery",
    hospital: "Medanta, Gurugram",
    rating: 5,
    text: "I had a life-saving bypass surgery at Medanta. The HospitalGuru team arranged everything — visa, interpreter, accommodation. The surgery cost was 80% less than in Moscow. The doctors were world-class and spoke through a Russian interpreter. I'm fully recovered now.",
    textRu: "Операция по аортокоронарному шунтированию спасла мне жизнь. Команда HospitalGuru организовала всё — визу, переводчика, проживание. Стоимость операции была на 80% ниже, чем в Москве.",
    savings: "$22,000 saved",
    color: "border-blue-200 bg-blue-50/50",
  },
  {
    name: "Гулнара Сейткали",
    nameEn: "Gulnara Seitkali",
    country: "🇰🇿 Kazakhstan, Almaty",
    treatment: "IVF Treatment",
    hospital: "Nova IVI Fertility, Bangalore",
    rating: 5,
    text: "After 5 failed IVF cycles in Kazakhstan, HospitalGuru helped me find the best fertility specialist in India. The whole process was smooth — they spoke Kazakh and Russian. I'm now 7 months pregnant. This team changed my life!",
    savings: "$8,400 saved",
    color: "border-teal-200 bg-teal-50/50",
  },
  {
    name: "Дмитрий Коваль",
    nameEn: "Dmitry Koval",
    country: "🇺🇦 Ukraine, Kyiv",
    treatment: "Knee Replacement",
    hospital: "Apollo Hospitals, Chennai",
    rating: 5,
    text: "Both knees replaced at Apollo Chennai. The orthopedic surgeon was exceptional — trained in Germany. Total cost including travel was still less than just the surgery in Kyiv. HospitalGuru's case manager was available 24/7.",
    savings: "$18,000 saved",
    color: "border-purple-200 bg-purple-50/50",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Patient Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Real Patients, Real Results
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Thousands of patients from Russia, Kazakhstan, Ukraine and across CIS have found affordable, world-class treatment through HospitalGuru.
          </p>
          {/* Rating bar */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-bold text-gray-900">4.9/5</span>
            <span className="text-gray-500 text-sm">from 12,400+ Google reviews</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-6 border ${t.color} relative`}
            >
              <Quote size={32} className="text-blue-200 mb-3" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">{t.text}</p>
              <p className="text-gray-400 text-xs italic mb-5">&quot;{t.textRu}&quot;</p>

              {/* Treatment info */}
              <div className="bg-white rounded-xl p-3 mb-4 border border-gray-100">
                <div className="text-xs text-gray-500 mb-0.5">Treatment</div>
                <div className="font-semibold text-gray-800 text-sm">{t.treatment}</div>
                <div className="text-gray-400 text-xs">{t.hospital}</div>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.country}</div>
                </div>
                <div className="text-right">
                  <div className="text-teal-600 font-bold text-sm">{t.savings}</div>
                  <div className="text-gray-400 text-xs">vs home country</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
