import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CostComparisonSection from "@/components/CostComparisonSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyIndiaSection from "@/components/WhyIndiaSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import HospitalsSection from "@/components/HospitalsSection";
import InquirySection from "@/components/InquirySection";
import FAQSection from "@/components/FAQSection";
import DoctorsSection from "@/components/DoctorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import TelegramFloatingButton from "@/components/TelegramFloatingButton";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="pt-18 pb-16 md:pb-0">
        <HeroSection />
        <CostComparisonSection />
        <HowItWorksSection />
        <WhyIndiaSection />
        <SpecialtiesSection />
        <HospitalsSection />
        <InquirySection />
        <FAQSection />
        <DoctorsSection />
        <TestimonialsSection />
        <Footer />
      </div>
      <StickyMobileCTA />
      <TelegramFloatingButton />
    </main>
  );
}
