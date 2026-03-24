import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons";

const footerLinks = {
  "For Patients": [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Find Hospitals", href: "#hospitals" },
    { label: "Find Doctors", href: "#doctors" },
    { label: "Cost Estimates", href: "#costs" },
    { label: "Visa Assistance", href: "#visa" },
    { label: "Patient Stories", href: "#testimonials" },
  ],
  "For Doctors": [
    { label: "Create Profile", href: "#doctor-register" },
    { label: "Browse Jobs", href: "#careers" },
    { label: "Salary Guide", href: "#salary-guide" },
    { label: "Why Work Abroad", href: "#why-abroad" },
  ],
  "Specialties": [
    { label: "Cardiology", href: "#" },
    { label: "Oncology", href: "#" },
    { label: "Orthopedics", href: "#" },
    { label: "Neurology", href: "#" },
    { label: "IVF & Fertility", href: "#" },
    { label: "View All 30+", href: "#specialties" },
  ],
  "Company": [
    { label: "About Us", href: "#about" },
    { label: "Our Team", href: "#team" },
    { label: "Partners", href: "#partners" },
    { label: "Blog", href: "#blog" },
    { label: "Contact Us", href: "#contact" },
    { label: "Privacy Policy", href: "#privacy" },
  ],
};

const cisCountries = [
  "🇷🇺 Russia", "🇰🇿 Kazakhstan", "🇺🇦 Ukraine",
  "🇧🇾 Belarus", "🇦🇿 Azerbaijan", "🇦🇲 Armenia",
  "🇬🇪 Georgia", "🇺🇿 Uzbekistan", "🇰🇬 Kyrgyzstan",
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CIS Countries strip */}
      <div className="border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Serving patients from:</span>
            {cisCountries.map((c) => (
              <span key={c} className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">H</span>
              </div>
              <div>
                <span className="font-black text-xl text-white">Hospital</span>
                <span className="font-black text-xl text-teal-400">Guru</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              India&apos;s most trusted medical tourism platform for patients from Russia, Kazakhstan, Ukraine, and CIS countries. World-class treatment, exceptional savings.
            </p>
            <p className="text-gray-500 text-xs italic mb-5">
              Мы говорим по-русски. Медицинский туризм в Индию из СНГ.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={14} className="text-blue-400" />
                <span>+91 8800 791 204</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={14} className="text-blue-400" />
                <span>care@hospitalguru.com</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a href="https://wa.me/918800791204" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white bg-gray-800 hover:bg-green-600 px-3 py-1.5 rounded-full transition-colors">
                <WhatsAppIcon size={12} /> WhatsApp
              </a>
              <a href="https://t.me/hospitalguru" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white bg-gray-800 hover:bg-blue-500 px-3 py-1.5 rounded-full transition-colors">
                <TelegramIcon size={12} /> Telegram
              </a>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-bold text-white text-sm mb-4">{heading}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2025 HospitalGuru.com. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-300">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-900 text-green-400 px-2 py-0.5 rounded text-[10px] font-semibold">NABH</span>
            <span className="bg-blue-900 text-blue-400 px-2 py-0.5 rounded text-[10px] font-semibold">JCI</span>
            <span className="bg-yellow-900 text-yellow-400 px-2 py-0.5 rounded text-[10px] font-semibold">ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
