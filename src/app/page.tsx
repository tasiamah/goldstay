import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WhySection } from "@/components/WhySection";
import { LocationsSection } from "@/components/LocationsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQSection } from "@/components/FAQSection";
import { CTABanner } from "@/components/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <ServicesSection />
      <WhySection />
      <LocationsSection />
      <HowItWorks />
      <FAQSection />
      <CTABanner />
    </>
  );
}
