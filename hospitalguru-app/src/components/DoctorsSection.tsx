"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Video, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const doctors = [
  { name: "Dr. Naresh Trehan",   title: "Cardiac Surgeon",     hospital: "Medanta — The Medicity, Delhi",   experience: "50+", rating: 4.9, reviews: 1820, languages: ["EN", "HI"],      fee: "$120", specialty: "Cardiology",   fallbackBg: "bg-blue-500",   initials: "NT", available: true  },
  { name: "Dr. Shyam Aggarwal",  title: "Senior Oncologist",   hospital: "Sir Ganga Ram Hospital, Delhi",   experience: "30+", rating: 4.8, reviews:  940, languages: ["EN", "HI", "RU"], fee:  "$90", specialty: "Oncology",    fallbackBg: "bg-purple-500", initials: "SA", available: true  },
  { name: "Dr. Pradeep Bhosle",  title: "Neurosurgeon",        hospital: "Apollo Hospitals, Chennai",       experience: "25+", rating: 4.9, reviews:  760, languages: ["EN", "HI", "TA"], fee: "$100", specialty: "Neurology",   fallbackBg: "bg-teal-500",   initials: "PB", available: false },
  { name: "Dr. Suresh Advani",   title: "Medical Oncologist",  hospital: "Jaslok Hospital, Mumbai",         experience: "40+", rating: 4.8, reviews: 1340, languages: ["EN", "HI"],      fee: "$110", specialty: "Oncology",    fallbackBg: "bg-green-500",  initials: "SA", available: true  },
];

const FILTERS = ["All", "Cardiology", "Oncology", "Orthopedics", "Neurology"];

const langLabel: Record<string, string> = { EN: "English", HI: "Hindi", RU: "Russian", TA: "Tamil" };

export default function DoctorsSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState("All");

  const visible = active === "All" ? doctors : doctors.filter((d) => d.specialty === active);

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge className="bg-teal-100 text-teal-700 border-0 mb-3 font-semibold tracking-wide uppercase text-[11px]">Specialist Doctors</Badge>
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
          {visible.map((doc) => (
            <Card key={doc.name + doc.title} className="hover:shadow-lg transition-shadow duration-300 group">
              <CardContent className="pt-2">
                {/* Avatar row */}
                <div className="relative mb-4 inline-block">
                  <Avatar size="lg" className={cn("w-16 h-16 rounded-2xl", doc.fallbackBg)}>
                    <AvatarFallback className={cn("rounded-2xl text-white text-2xl font-black", doc.fallbackBg)}>
                      {doc.initials}
                    </AvatarFallback>
                  </Avatar>
                  {doc.available && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Video size={8} /> LIVE
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors mb-0.5">
                  {doc.name}
                </h3>
                <div className="text-teal-600 text-xs font-semibold mb-1">{doc.title}</div>
                <div className="text-gray-400 text-xs mb-3 leading-snug">{doc.hospital}</div>

                {/* Language badges */}
                <div className="flex gap-1 mb-3 flex-wrap">
                  {doc.languages.map((l) => (
                    <Badge key={l} variant={l === "RU" ? "default" : "secondary"}
                      title={langLabel[l]}
                      className={cn("text-xs h-auto py-0.5",
                        l === "RU" ? "bg-blue-100 text-blue-700 border-0" : "bg-gray-100 text-gray-500 border-0"
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

              <CardFooter className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">{t("doc_fee")}</div>
                  <div className="font-bold text-gray-800 text-sm">{doc.fee}</div>
                </div>
                <Link href="#inquiry"
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  {t("doc_book")} <ChevronRight size={12} />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="#" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8 border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white")}>
            {t("doc_view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
