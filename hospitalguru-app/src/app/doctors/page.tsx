"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DOCTORS, SPECIALTIES, CITIES } from "@/data/doctors";

const BG_COLORS = [
  "bg-blue-500","bg-purple-500","bg-teal-500","bg-green-500",
  "bg-rose-500","bg-orange-500","bg-sky-500","bg-pink-500",
  "bg-indigo-500","bg-cyan-500",
];

function DoctorPhoto({ photo, name, bg }: { photo: string; name: string; bg: string }) {
  return (
    <div className={cn("relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shrink-0", bg)}>
      <span className="text-white text-xl font-black select-none absolute">
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

export default function DoctorsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [spec,   setSpec]   = useState("All");
  const [city,   setCity]   = useState("All");
  const [ruOnly, setRuOnly] = useState(false);
  const [avail,  setAvail]  = useState(false);

  const filtered = DOCTORS.filter((d) => {
    if (spec  !== "All" && d.specialty !== spec)              return false;
    if (city  !== "All" && d.city     !== city)              return false;
    if (ruOnly && !d.langs.includes("RU"))                   return false;
    if (avail  && !d.available)                              return false;
    if (search) {
      const q = search.toLowerCase();
      return d.name.toLowerCase().includes(q) ||
             d.title.toLowerCase().includes(q) ||
             d.hospital.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="pt-[72px] min-h-screen bg-white">

        {/* Page header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-teal-200 text-sm font-medium mb-1">
              <Link href="/" className="hover:underline">Home</Link> › Doctors
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{t("doc_title")}</h1>
            <p className="text-teal-100 text-sm">{t("doc_sub")}</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="sticky top-[72px] z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative min-w-50 flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search doctor, specialty, hospital..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>

            {/* Specialty */}
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setSpec("All")}
                className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                  spec === "All" ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300")}>
                All
              </button>
              {SPECIALTIES.map((s) => (
                <button key={s} onClick={() => setSpec(spec === s ? "All" : s)}
                  className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                    spec === s ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300")}>
                  {s}
                </button>
              ))}
            </div>

            {/* City */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-teal-300 bg-white text-gray-600 font-semibold h-9"
            >
              <option value="All">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Russian toggle */}
            <button onClick={() => setRuOnly(!ruOnly)}
              className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors h-9",
                ruOnly ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300")}>
              🇷🇺 Speaks Russian
            </button>

            {/* Available toggle */}
            <button onClick={() => setAvail(!avail)}
              className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors h-9",
                avail ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300")}>
              ● Available
            </button>

            <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
              {filtered.length} of {DOCTORS.length} doctors
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-semibold mb-1">No doctors found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((doc, i) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-2">
                    <div className="mb-3">
                      <DoctorPhoto photo={doc.photo} name={doc.name} bg={BG_COLORS[i % BG_COLORS.length]} />
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-teal-600 transition-colors leading-snug mb-0.5">
                      {doc.name}
                    </h3>
                    <div className="text-teal-600 text-xs font-semibold mb-0.5">{doc.title}</div>
                    <div className="text-gray-400 text-xs mb-2 leading-snug">{doc.hospital}, {doc.city}</div>

                    <div className="flex gap-1 mb-2 flex-wrap">
                      {doc.langs.map((l) => (
                        <Badge key={l} className={cn("text-[10px] h-auto py-0.5 border-0",
                          l === "RU" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500")}>
                          {l}
                        </Badge>
                      ))}
                    </div>

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
                      <div className="text-[10px] text-gray-400">{t("doc_fee")}</div>
                      <div className="font-bold text-gray-800 text-sm">{doc.fee}</div>
                    </div>
                    <Link
                      href={`/?condition=${encodeURIComponent(`Consult ${doc.name} — ${doc.specialty}`)}#inquiry`}
                      className="text-xs font-semibold bg-teal-50 hover:bg-teal-600 text-teal-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                      Send Inquiry
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
