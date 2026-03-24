"use client";

import { useState, useEffect } from "react";
import { Send, Upload, CheckCircle, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons";

const cisCountries = [
  "Russia 🇷🇺", "Kazakhstan 🇰🇿", "Ukraine 🇺🇦", "Belarus 🇧🇾",
  "Azerbaijan 🇦🇿", "Armenia 🇦🇲", "Georgia 🇬🇪", "Uzbekistan 🇺🇿",
  "Kyrgyzstan 🇰🇬", "Tajikistan 🇹🇯", "Turkmenistan 🇹🇲", "Moldova 🇲🇩",
  "Other",
];

const benefits = [
  "Response within 24 hours",
  "Russian-speaking case managers available",
  "Free second medical opinion",
  "Complete trip planning assistance",
  "No hidden fees, ever",
];

export default function InquirySection() {
  const { t } = useLanguage();
  const [submitted, setSubmitted]         = useState(false);
  const [loading, setLoading]             = useState(false);
  const [inquiryNumber, setInquiryNumber] = useState("");
  const [files, setFiles]                 = useState<File[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", condition: "", message: "" });

  // Pre-fill condition when Hero search fires
  useEffect(() => {
    const handler = (e: Event) => {
      const treatment = (e as CustomEvent).detail?.treatment;
      if (treatment) setForm((prev) => ({ ...prev, condition: treatment }));
    };
    window.addEventListener("prefill-inquiry", handler);
    return () => window.removeEventListener("prefill-inquiry", handler);
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert files to base64 for email attachment
      const fileData = await Promise.all(
        files.map(async (f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          base64: Buffer.from(await f.arrayBuffer()).toString("base64"),
        }))
      );

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "web_form", files: fileData }),
      });
      const data = await res.json() as { inquiryNumber?: string };
      setInquiryNumber(data.inquiryNumber ?? "");
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="inquiry" className="py-20 bg-gradient-to-br from-teal-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div className="text-white">
            <div className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              Free Consultation
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              {t("inq_title")}
            </h2>
            <p className="text-teal-100 mb-6">{t("inq_sub")}</p>

            <ul className="space-y-3 mb-8">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-2 text-teal-100 text-sm">
                  <CheckCircle size={16} className="text-teal-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <a href="https://wa.me/918800791204" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm">
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
              <a href="https://t.me/hospitalguru" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm">
                <TelegramIcon size={16} /> Telegram
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-black text-xl text-gray-900 mb-2">{t("inq_success")}</h3>
                {inquiryNumber && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-3 inline-block">
                    <span className="text-xs text-gray-500">Reference: </span>
                    <span className="font-bold text-blue-700 text-sm">{inquiryNumber}</span>
                  </div>
                )}
                <p className="text-gray-500 text-sm">
                  {t("inq_sub")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="font-black text-xl text-gray-900">{t("inq_title")}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{t("inq_privacy")}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t("inq_name")} *</label>
                    <Input required placeholder="Иван Петров" value={form.name} onChange={set("name")}
                      className="h-10 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t("inq_country")} *</label>
                    <select required value={form.country} onChange={set("country")}
                      className="w-full h-10 border border-input rounded-lg px-2.5 text-sm outline-none focus:border-ring bg-white">
                      <option value="">—</option>
                      {cisCountries.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t("inq_email")} *</label>
                    <Input required type="email" placeholder="ivan@email.com" value={form.email} onChange={set("email")}
                      className="h-10 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t("inq_phone")} *</label>
                    <Input required type="tel" placeholder="+7 900 123 4567" value={form.phone} onChange={set("phone")}
                      className="h-10 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t("inq_condition")} *</label>
                  <Input required placeholder="e.g. Heart bypass surgery, Knee replacement..." value={form.condition} onChange={set("condition")}
                    className="h-10 text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t("inq_message")}</label>
                  <textarea rows={3} placeholder="Describe your condition... (Russian is fine / можно по-русски)"
                    value={form.message} onChange={set("message")}
                    className="w-full border border-input rounded-lg px-2.5 py-2 text-sm outline-none focus:border-ring resize-none" />
                </div>

                {/* File upload */}
                <div>
                  <label
                    htmlFor="file-upload"
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer block"
                  >
                    <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-500">{t("inq_upload")}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t("inq_upload_sub")}</div>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) setFiles(Array.from(e.target.files));
                    }}
                  />
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5 text-xs">
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="text-gray-700 truncate flex-1">{f.name}</span>
                          <span className="text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
                          <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}
                            className="text-gray-400 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold h-12 text-base rounded-xl">
                  <Send size={16} />
                  {loading ? "Submitting..." : t("inq_submit")}
                </Button>

                <p className="text-center text-gray-400 text-xs">{t("inq_privacy")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
