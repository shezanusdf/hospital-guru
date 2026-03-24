import Link from "next/link";
import { TrendingDown } from "lucide-react";

const treatments = [
  { name: "Knee Replacement", nameRu: "Замена коленного сустава", india: 4500, russia: 28000, saving: 84 },
  { name: "Heart Bypass (CABG)", nameRu: "Аортокоронарное шунтирование", india: 5500, russia: 35000, saving: 84 },
  { name: "Liver Transplant", nameRu: "Трансплантация печени", india: 28000, russia: 150000, saving: 81 },
  { name: "IVF Treatment", nameRu: "ЭКО", india: 2800, russia: 12000, saving: 77 },
  { name: "Spinal Fusion", nameRu: "Спондилодез", india: 5000, russia: 30000, saving: 83 },
  { name: "Bone Marrow Transplant", nameRu: "Трансплантация костного мозга", india: 18000, russia: 100000, saving: 82 },
  { name: "Hip Replacement", nameRu: "Замена тазобедренного сустава", india: 5000, russia: 25000, saving: 80 },
  { name: "Cochlear Implant", nameRu: "Кохлеарный имплант", india: 12000, russia: 55000, saving: 78 },
];

function formatUSD(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

export default function CostComparisonSection() {
  return (
    <section id="costs" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            <TrendingDown size={14} className="text-teal-400" />
            Cost Savings
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Save Up to 84% on Treatment Cost
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto">
            Compare the cost of procedures in India vs Russia/CIS countries. Same world-class quality — dramatically lower cost.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm border-b border-white/10">
                <th className="text-left py-3 text-blue-200 font-medium">Treatment</th>
                <th className="text-center py-3 text-blue-200 font-medium">India 🇮🇳</th>
                <th className="text-center py-3 text-blue-200 font-medium">Russia / CIS 🇷🇺</th>
                <th className="text-center py-3 text-teal-400 font-bold">Your Savings</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((t, i) => (
                <tr
                  key={t.name}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    i % 2 === 0 ? "bg-white/5" : ""
                  }`}
                >
                  <td className="py-4 pr-4">
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-blue-300 text-xs">{t.nameRu}</div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-teal-400 font-bold text-lg">{formatUSD(t.india)}</span>
                    <div className="text-blue-300 text-xs">Starting from</div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-white/60 font-semibold line-through">{formatUSD(t.russia)}</span>
                    <div className="text-blue-300 text-xs">Average</div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="inline-block bg-teal-500/20 text-teal-300 font-black px-3 py-1 rounded-full text-sm border border-teal-500/30">
                      {t.saving}% less
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center text-blue-300 text-xs">
          * Costs are indicative estimates and may vary by hospital, doctor, and patient condition.
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="#inquiry"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Get a Personalised Cost Estimate — Free
          </Link>
        </div>
      </div>
    </section>
  );
}
