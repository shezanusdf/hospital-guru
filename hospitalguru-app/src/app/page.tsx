import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import HospitalsSection from "@/components/HospitalsSection";
import DoctorsSection from "@/components/DoctorsSection";
import CostComparisonSection from "@/components/CostComparisonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InquirySection from "@/components/InquirySection";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* Offset for fixed navbar */}
      <div className="pt-18 pb-16 md:pb-0">
        <HeroSection />
        <SpecialtiesSection />
        <HowItWorksSection />
        <HospitalsSection />
        <DoctorsSection />
        <CostComparisonSection />
        <TestimonialsSection />
        <InquirySection />
        <Footer />
      </div>
      <StickyMobileCTA />
    </main>
  );
}
