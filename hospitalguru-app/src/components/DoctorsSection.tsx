"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { DOCTORS, SPECIALTIES } from "@/data/doctors";

const FILTERS = ["All", ...SPECIALTIES.slice(0, 5)] as const;

const FEATURED_IDS = [1, 7, 13, 25, 37, 47, 57, 67];
const featured = DOCTORS.filter((d) => FEATURED_IDS.includes(d.id));

function DoctorPhoto({ photo, name, bg }: { photo: string; name: string; bg: string }) {
  return (
    <div className={cn("relative w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shrink-0", bg)}>
      <span className="text-white text-2xl font-black select-none absolute">
        {name.split(" ").slice(1).map((w) => w[0]).join("").slice(0, 2)}
      </span>
      <img
        src={photo}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}

const BG_COLORS = [
  "bg-blue-500","bg-purple-500","bg-teal-500","bg-green-500",
  "bg-rose-500","bg-orange-500","bg-sky-500","bg-pink-500",
];

export default function DoctorsSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState("All");

  const visible = active === "All"
    ? featured
    : featured.filter((d) => d.specialty === active);

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge className="bg-teal-100 text-teal-700 border-0 mb-3 font-semibold tracking-wide uppercase text-[11px]">
              Specialist Doctors
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{t("doc_title")}</h2>
            <p className="text-gray-500">{t("doc_sub")}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setActive(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  active === f
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-600"
                )}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(visible.length > 0 ? visible : featured).map((doc, i) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow duration-300 group">
              <CardContent className="pt-2">
                <div className="mb-4">
                  <DoctorPhoto photo={doc.photo} name={doc.name} bg={BG_COLORS[i % BG_COLORS.length]} />
                </div>

                <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors mb-0.5">
                  {doc.name}
                </h3>
                <div className="text-teal-600 text-xs font-semibold mb-1">{doc.title}</div>
                <div className="text-gray-400 text-xs mb-3 leading-snug">{doc.hospital}, {doc.city}</div>

                {/* Language badges */}
                <div className="flex gap-1 mb-3 flex-wrap">
                  {doc.langs.map((l) => (
                    <Badge key={l}
                      className={cn("text-xs h-auto py-0.5 border-0",
                        l === "RU" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                      )}>
                      {l}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-semibold text-gray-700">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    {doc.rating}
                    <span className="text-gray-400 font-normal">({doc.reviews})</span>
                  </div>
                  <span className="text-gray-400">{doc.experience} {t("doc_exp")}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Link
                  href={`/?condition=${encodeURIComponent(`Consult ${doc.name} — ${doc.specialty}`)}#inquiry`}
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors w-full justify-center">
                  {t("doc_book")} <ChevronRight size={12} />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/doctors"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8 border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white")}>
            {t("doc_view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
