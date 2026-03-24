import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Inter: excellent Cyrillic support (Latin + Cyrillic subsets)
// Used for all body and heading text across all 4 languages
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HospitalGuru — Medical Tourism from CIS Countries to India",
  description:
    "Connecting patients from Russia, Kazakhstan, Ukraine and CIS countries with India's best hospitals and specialists. Save up to 84% on world-class medical treatment.",
  keywords:
    "medical tourism india, treatment in india, india hospitals, cis patients india, medical tourism russia india",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
