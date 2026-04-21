import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { ProblemSection } from "@/components/ProblemSection";
import { ServicesSection } from "@/components/ServicesSection";
import { CompareSection } from "@/components/CompareSection";
import { CalculatorTeaser } from "@/components/CalculatorTeaser";
import { WhySection } from "@/components/WhySection";
import { GuaranteesSection } from "@/components/GuaranteesSection";
import { StatementPreview } from "@/components/StatementPreview";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { LocationsSection } from "@/components/LocationsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { FounderLetter } from "@/components/FounderLetter";
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
      <CompareSection />
      <CalculatorTeaser />
      <WhySection />
      <GuaranteesSection />
      <StatementPreview />
      <PortfolioGallery />
      <LocationsSection />
      <HowItWorks />
      <FounderLetter />
      <TeamSection />
      <FAQSection />
      <CTABanner />
    </>
  );
}
