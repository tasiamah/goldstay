import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { ProblemSection } from "@/components/ProblemSection";
import { ServicesSection } from "@/components/ServicesSection";
import { CalculatorTeaser } from "@/components/CalculatorTeaser";
import { WhySection } from "@/components/WhySection";
import { StatementPreview } from "@/components/StatementPreview";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { LocationsSection } from "@/components/LocationsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { TeamSection } from "@/components/TeamSection";
import { FAQSection } from "@/components/FAQSection";
import { CTABanner } from "@/components/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <ServicesSection />
      <CalculatorTeaser />
      <WhySection />
      <StatementPreview />
      <PortfolioGallery />
      <LocationsSection />
      <HowItWorks />
      <TeamSection />
      <FAQSection />
      <CTABanner />
    </>
  );
}
