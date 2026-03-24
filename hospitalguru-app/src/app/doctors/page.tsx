"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Video, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const doctors = [
  { name: "Dr. Naresh Trehan",       title: "Cardiac Surgeon",          hospital: "Medanta, Delhi",              exp: "50+", rating: 4.9, reviews: 1820, langs: ["EN","HI"],       fee: "$120", spec: "Cardiology",    bg: "bg-blue-500",   initials: "NT", available: true  },
  { name: "Dr. Shyam Aggarwal",      title: "Senior Oncologist",        hospital: "Sir Ganga Ram Hospital, Delhi", exp: "30+", rating: 4.8, reviews:  940, langs: ["EN","HI","RU"], fee:  "$90", spec: "Oncology",     bg: "bg-purple-500", initials: "SA", available: true  },
  { name: "Dr. Pradeep Bhosle",      title: "Neurosurgeon",             hospital: "Apollo Hospitals, Chennai",   exp: "25+", rating: 4.9, reviews:  760, langs: ["EN","HI","TA"], fee: "$100", spec: "Neurology",    bg: "bg-teal-500",   initials: "PB", available: false },
  { name: "Dr. Suresh Advani",       title: "Medical Oncologist",       hospital: "Jaslok Hospital, Mumbai",     exp: "40+", rating: 4.8, reviews: 1340, langs: ["EN","HI"],       fee: "$110", spec: "Oncology",     bg: "bg-green-500",  initials: "SA", available: true  },
  { name: "Dr. Deepak Chaudhary",    title: "Orthopaedic Surgeon",      hospital: "Fortis, Delhi",               exp: "22+", rating: 4.7, reviews:  820, langs: ["EN","HI","RU"], fee:  "$85", spec: "Orthopaedics", bg: "bg-orange-500", initials: "DC", available: true  },
  { name: "Dr. Anupam Sachdeva",     title: "Paediatric Haematologist", hospital: "Sir Ganga Ram Hospital, Delhi", exp: "28+", rating: 4.8, reviews: 1100, langs: ["EN","HI"],    fee:  "$95", spec: "Oncology",     bg: "bg-rose-500",   initials: "AS", available: true  },
  { name: "Dr. Randeep Guleria",     title: "Pulmonologist",            hospital: "AIIMS, Delhi",                exp: "35+", rating: 4.9, reviews: 2200, langs: ["EN","HI"],       fee: "$130", spec: "Neurology",    bg: "bg-sky-500",    initials: "RG", available: false },
  { name: "Dr. Kamini Rao",          title: "IVF Specialist",           hospital: "Manipal Hospitals, Bangalore", exp: "30+", rating: 4.8, reviews:  980, langs: ["EN","KN"],      fee:  "$80", spec: "IVF",          bg: "bg-pink-500",   initials: "KR", available: true  },
];

const SPECS = ["All", "Cardiology", "Oncology", "Orthopaedics", "Neurology", "IVF"];
const LANGS = ["All", "Russian (RU)", "English (EN)", "Hindi (HI)"];

export default function DoctorsPage() {
  const { t } = useLanguage();
  const [search, setSearch]  = useState("");
  const [spec,   setSpec]    = useState("All");
  const [lang,   setLang]    = useState("All");
  const [avail,  setAvail]   = useState(false);

  const filtered = doctors.filter((d) => {
    if (spec  !== "All"  && d.spec !== spec)                                      return false;
    if (lang  !== "All"  && !d.langs.includes(lang.split(" ")[1].replace(/[()]/g, ""))) return false;
    if (avail && !d.available)                                                    return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) &&
                  !d.title.toLowerCase().includes(search.toLowerCase()))          return false;
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
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search doctor or specialty..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm" />
            </div>

            {/* Specialty */}
            <div className="flex gap-1.5 flex-wrap">
              {SPECS.map((s) => (
                <button key={s} onClick={() => setSpec(s)}
                  className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                    spec === s ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300")}>
                  {s}
                </button>
              ))}
            </div>

            {/* Russian language filter — key for CIS patients */}
            <button onClick={() => setLang(lang === "Russian (RU)" ? "All" : "Russian (RU)")}
              className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                lang === "Russian (RU)" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300")}>
              🇷🇺 Speaks Russian
            </button>

            <button onClick={() => setAvail(!avail)}
              className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                avail ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300")}>
              ● Available Today
            </button>

            <span className="text-xs text-gray-400 ml-auto">{filtered.length} doctors</span>
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
                <Card key={i} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-2">
                    <div className="relative mb-3 inline-block">
                      <Avatar size="lg" className={cn("w-14 h-14 rounded-2xl", doc.bg)}>
                        <AvatarFallback className={cn("rounded-2xl text-white text-xl font-black", doc.bg)}>
                          {doc.initials}
                        </AvatarFallback>
                      </Avatar>
                      {doc.available && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Video size={7} /> LIVE
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-teal-600 transition-colors leading-snug mb-0.5">
                      {doc.name}
                    </h3>
                    <div className="text-teal-600 text-xs font-semibold mb-0.5">{doc.title}</div>
                    <div className="text-gray-400 text-xs mb-2 leading-snug">{doc.hospital}</div>

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
                      <span className="text-gray-400">{doc.exp} {t("doc_exp")}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400">{t("doc_fee")}</div>
                      <div className="font-bold text-gray-800 text-sm">{doc.fee}</div>
                    </div>
                    <Link href="/#inquiry"
                      className="text-xs font-semibold bg-teal-50 hover:bg-teal-600 text-teal-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                      {t("doc_book")}
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
