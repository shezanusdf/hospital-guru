"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, MapPin, Award, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const hospitals = [
  { name: "Apollo Hospitals",            city: "Chennai",    state: "Tamil Nadu",  specialties: ["Cardiology", "Oncology", "Transplants"],         rating: 4.9, reviews: 2840, accreditations: ["JCI","NABH"], cost: "$3,500", beds: 700,  color: "from-blue-500 to-blue-700",    initials: "AH", city_key: "Chennai"   },
  { name: "Fortis Memorial",             city: "Gurugram",   state: "Delhi NCR",   specialties: ["Neuroscience", "Cardiac", "Orthopaedics"],        rating: 4.8, reviews: 1960, accreditations: ["JCI","NABH"], cost: "$2,800", beds: 310,  color: "from-purple-500 to-purple-700", initials: "FM", city_key: "Delhi"     },
  { name: "Medanta — The Medicity",      city: "Gurugram",   state: "Delhi NCR",   specialties: ["Cardiac Surgery", "Oncology", "Spine"],           rating: 4.9, reviews: 3210, accreditations: ["JCI","NABH"], cost: "$3,200", beds: 1250, color: "from-teal-500 to-teal-700",    initials: "MD", city_key: "Delhi"     },
  { name: "Kokilaben Dhirubhai Ambani",  city: "Mumbai",     state: "Maharashtra", specialties: ["Cardiology", "Neurology", "Cancer"],              rating: 4.8, reviews: 1540, accreditations: ["JCI","NABH"], cost: "$3,900", beds: 750,  color: "from-orange-500 to-orange-700", initials: "KD", city_key: "Mumbai"    },
  { name: "Narayana Health",             city: "Bangalore",  state: "Karnataka",   specialties: ["Cardiac", "Paediatrics", "Transplants"],           rating: 4.7, reviews: 2100, accreditations: ["JCI","NABH"], cost: "$2,200", beds: 3000, color: "from-green-500 to-green-700",   initials: "NH", city_key: "Bangalore" },
  { name: "AIIMS Delhi",                 city: "New Delhi",  state: "Delhi",       specialties: ["All Specialties", "Research", "Rare Diseases"],    rating: 4.7, reviews: 5600, accreditations: ["NABH","NABL"], cost: "$1,800", beds: 2478, color: "from-red-500 to-red-700",      initials: "AI", city_key: "Delhi"     },
  { name: "Tata Memorial Centre",        city: "Mumbai",     state: "Maharashtra", specialties: ["Oncology", "Radiation", "Haematology"],            rating: 4.8, reviews: 3100, accreditations: ["NABH"],       cost: "$1,500", beds: 629,  color: "from-rose-500 to-rose-700",    initials: "TM", city_key: "Mumbai"    },
  { name: "Max Super Speciality",        city: "New Delhi",  state: "Delhi",       specialties: ["Cardiac", "Orthopaedics", "Neurology"],            rating: 4.7, reviews: 1780, accreditations: ["JCI","NABH"], cost: "$2,600", beds: 500,  color: "from-sky-500 to-sky-700",      initials: "MS", city_key: "Delhi"     },
  { name: "Manipal Hospitals",           city: "Bangalore",  state: "Karnataka",   specialties: ["Oncology", "Cardiology", "Transplants"],           rating: 4.6, reviews: 2200, accreditations: ["NABH"],       cost: "$2,400", beds: 600,  color: "from-violet-500 to-violet-700", initials: "MH", city_key: "Bangalore" },
  { name: "Breach Candy Hospital",       city: "Mumbai",     state: "Maharashtra", specialties: ["Cardiology", "Cosmetic Surgery", "Neurology"],     rating: 4.7, reviews: 890,  accreditations: ["NABH"],       cost: "$3,600", beds: 195,  color: "from-pink-500 to-pink-700",    initials: "BC", city_key: "Mumbai"    },
  { name: "CARE Hospitals",              city: "Hyderabad",  state: "Telangana",   specialties: ["Cardiac", "Orthopaedics", "Gastroenterology"],     rating: 4.6, reviews: 1340, accreditations: ["JCI","NABH"], cost: "$2,100", beds: 450,  color: "from-amber-500 to-amber-700",  initials: "CH", city_key: "Hyderabad" },
  { name: "Yashoda Hospitals",           city: "Hyderabad",  state: "Telangana",   specialties: ["IVF", "Spine Surgery", "Oncology"],               rating: 4.6, reviews: 1120, accreditations: ["NABH"],       cost: "$1,900", beds: 700,  color: "from-lime-500 to-lime-700",    initials: "YH", city_key: "Hyderabad" },
];

const CITIES      = ["All", "Delhi", "Mumbai", "Chennai", "Bangalore", "Hyderabad"];
const SPECIALTIES = ["All", "Cardiology", "Oncology", "Orthopaedics", "Neurology", "Transplants", "IVF"];
const ACCRED      = ["All", "JCI", "NABH"];

export default function HospitalsPage() {
  const { t } = useLanguage();
  const [search,   setSearch]   = useState("");
  const [city,     setCity]     = useState("All");
  const [spec,     setSpec]     = useState("All");
  const [accred,   setAccred]   = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = hospitals.filter((h) => {
    if (city   !== "All" && h.city_key !== city)                              return false;
    if (spec   !== "All" && !h.specialties.some((s) => s.includes(spec)))    return false;
    if (accred !== "All" && !h.accreditations.includes(accred))              return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) &&
                  !h.city.toLowerCase().includes(search.toLowerCase()))       return false;
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="pt-[72px] min-h-screen bg-gray-50">

        {/* Page header */}
        <div className="bg-gradient-to-r from-blue-700 to-teal-600 text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-blue-200 text-sm font-medium mb-1">
              <Link href="/" className="hover:underline">Home</Link> › Hospitals
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{t("hosp_title")}</h1>
            <p className="text-blue-100 text-sm">{t("hosp_sub")}</p>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="sticky top-[72px] z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search hospital or city..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm" />
            </div>

            {/* City pills */}
            <div className="hidden md:flex gap-1.5 flex-wrap">
              {CITIES.map((c) => (
                <button key={c} onClick={() => setCity(c)}
                  className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                    city === c ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300")}>
                  {c}
                </button>
              ))}
            </div>

            {/* More filters toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-blue-300 transition-colors">
              <SlidersHorizontal size={13} /> Filters
              {(spec !== "All" || accred !== "All") && (
                <span className="w-4 h-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">
                  {[spec, accred].filter((v) => v !== "All").length}
                </span>
              )}
            </button>

            <span className="text-xs text-gray-400 ml-auto">{filtered.length} hospitals</span>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-4">
              <div>
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Specialty</div>
                <div className="flex gap-1.5 flex-wrap">
                  {SPECIALTIES.map((s) => (
                    <button key={s} onClick={() => setSpec(s)}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                        spec === s ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Accreditation</div>
                <div className="flex gap-1.5">
                  {ACCRED.map((a) => (
                    <button key={a} onClick={() => setAccred(a)}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                        accred === a ? "bg-yellow-500 text-white border-yellow-500" : "border-gray-200 text-gray-600 hover:border-yellow-300")}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-semibold mb-1">No hospitals found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((h) => (
                <Card key={h.name} className="overflow-hidden hover:shadow-lg transition-shadow group p-0 gap-0">
                  <div className={`h-28 bg-gradient-to-br ${h.color} relative flex items-center justify-center`}>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-2xl font-black">{h.initials}</span>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1">
                      {h.accreditations.map((a) => (
                        <span key={a} className="bg-white/90 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Award size={8} className="text-yellow-500" />{a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <CardHeader className="pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {h.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                          <MapPin size={10} />{h.city}, {h.state}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="flex items-center gap-0.5 text-sm font-bold">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />{h.rating}
                        </div>
                        <div className="text-[10px] text-gray-400">{h.reviews.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <div className="flex flex-wrap gap-1">
                      {h.specialties.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[11px] bg-blue-50 text-blue-700 border-0">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between bg-transparent border-t border-gray-100 px-4 py-2.5">
                    <div>
                      <div className="text-[10px] text-gray-400">{t("hosp_from")}</div>
                      <div className="font-bold text-teal-600 text-sm">{h.cost}</div>
                    </div>
                    <div className="text-[10px] text-gray-400">{h.beds.toLocaleString()} {t("hosp_beds")}</div>
                    <Link href={`/hospitals/${h.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                      className="text-xs font-semibold text-blue-600 hover:underline">
                      {t("hosp_view_profile")} →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
