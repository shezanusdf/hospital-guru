"use client";

import Link from "next/link";
import { FileText, Users, Plane, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const stepMeta = [
  { number: "01", icon: FileText, color: "bg-blue-50 text-blue-600",   ring: "ring-blue-100"   },
  { number: "02", icon: Users,    color: "bg-teal-50 text-teal-600",   ring: "ring-teal-100"   },
  { number: "03", icon: Plane,    color: "bg-purple-50 text-purple-600", ring: "ring-purple-100" },
  { number: "04", icon: Heart,    color: "bg-green-50 text-green-600",  ring: "ring-green-100"  },
];

export default function HowItWorksSection() {
  const { t, tArr } = useLanguage();
  const steps = tArr("hiw_steps") as { title: string; desc: string }[];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-3 font-semibold tracking-wide uppercase text-[11px]">Simple Process</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{t("hiw_title")}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t("hiw_sub")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 z-0"
            style={{ background: "linear-gradient(to right, #bfdbfe, #99f6e4, #e9d5ff, #bbf7d0)" }} />

          {stepMeta.map((meta, i) => {
            const Icon   = meta.icon;
            const step   = Array.isArray(steps) ? steps[i] : { title: "", desc: "" };
            const colorText = meta.color.split(" ")[1];

            return (
              <div key={meta.number} className="relative z-10 flex flex-col items-center text-center">
                <div className={cn("w-24 h-24 rounded-full bg-white ring-2 shadow-md flex items-center justify-center mb-5", meta.ring)}>
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", meta.color)}>
                    <Icon size={22} />
                  </div>
                </div>
                <div className={cn("text-xs font-black tracking-widest mb-2", colorText)}>
                  STEP {meta.number}
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="#inquiry"
            className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 h-auto rounded-full")}>
            {t("inq_submit")}
          </Link>
          <p className="text-gray-400 text-xs mt-2">No fees. No obligations.</p>
        </div>
      </div>
    </section>
  );
}
