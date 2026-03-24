"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Award, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const hospitals = [
  { name: "Apollo Hospitals",             city: "Chennai",   state: "Tamil Nadu",   specialties: ["Cardiology", "Oncology", "Transplants"],        rating: 4.9, reviews: 2840, accreditations: ["JCI", "NABH"], startingCost: "$3,500", beds: 700,  color: "from-blue-500 to-blue-700",   initials: "AH", filter: "Chennai"   },
  { name: "Fortis Memorial",              city: "Gurugram",  state: "Delhi NCR",    specialties: ["Neuroscience", "Cardiac", "Orthopaedics"],       rating: 4.8, reviews: 1960, accreditations: ["JCI", "NABH"], startingCost: "$2,800", beds: 310,  color: "from-purple-500 to-purple-700", initials: "FM", filter: "Delhi"     },
  { name: "Medanta — The Medicity",       city: "Gurugram",  state: "Delhi NCR",    specialties: ["Cardiac Surgery", "Oncology", "Spine"],          rating: 4.9, reviews: 3210, accreditations: ["JCI", "NABH"], startingCost: "$3,200", beds: 1250, color: "from-teal-500 to-teal-700",   initials: "MD", filter: "Delhi"     },
  { name: "Kokilaben Dhirubhai Ambani",   city: "Mumbai",    state: "Maharashtra",  specialties: ["Cardiology", "Neurology", "Cancer"],             rating: 4.8, reviews: 1540, accreditations: ["JCI", "NABH"], startingCost: "$3,900", beds: 750,  color: "from-orange-500 to-orange-700", initials: "KD", filter: "Mumbai"    },
  { name: "Narayana Health",              city: "Bangalore", state: "Karnataka",    specialties: ["Cardiac", "Paediatrics", "Transplants"],          rating: 4.7, reviews: 2100, accreditations: ["JCI", "NABH"], startingCost: "$2,200", beds: 3000, color: "from-green-500 to-green-700",  initials: "NH", filter: "Bangalore" },
  { name: "AIIMS Delhi",                  city: "New Delhi", state: "Delhi",        specialties: ["All Specialties", "Research", "Rare Diseases"],   rating: 4.7, reviews: 5600, accreditations: ["NABH", "NABL"], startingCost: "$1,800", beds: 2478, color: "from-red-500 to-red-700",     initials: "AI", filter: "Delhi"     },
];

const FILTERS = ["All", "Mumbai", "Delhi", "Chennai", "Bangalore"];

export default function HospitalsSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState("All");

  const visible = active === "All"
    ? hospitals
    : hospitals.filter((h) => h.filter === active);

  return (
    <section id="hospitals" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="secondary" className="mb-3 font-semibold tracking-wide uppercase text-[11px]">Partner Hospitals</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{t("hosp_title")}</h2>
            <p className="text-gray-500">{t("hosp_sub")}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setActive(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  active === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                )}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((h) => (
            <Card key={h.name} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group p-0 gap-0">
              {/* Gradient header */}
              <div className={`h-36 bg-gradient-to-br ${h.color} relative flex items-center justify-center`}>
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-3xl font-black">{h.initials}</span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {h.accreditations.map((acc) => (
                    <span key={acc} className="bg-white/90 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Award size={9} className="text-yellow-500" />{acc}
                    </span>
                  ))}
                </div>
              </div>

              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {h.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                      <MapPin size={11} />{h.city}, {h.state}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                      <Star size={13} className="fill-yellow-400 text-yellow-400" />{h.rating}
                    </div>
                    <div className="text-xs text-gray-400">{h.reviews.toLocaleString()} reviews</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {h.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[11px] bg-blue-50 text-blue-700 border-0">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between bg-transparent border-t border-gray-100 px-4 py-3">
                <div>
                  <div className="text-xs text-gray-400">{t("hosp_from")}</div>
                  <div className="font-bold text-teal-600 text-sm">{h.startingCost}</div>
                </div>
                <div className="text-xs text-gray-400">{h.beds.toLocaleString()} {t("hosp_beds")}</div>
                <Link href="#" className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:gap-2 transition-all">
                  {t("hosp_view_profile")} <ChevronRight size={14} />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="#" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white")}>
            {t("hosp_view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
