import {
  LandingNav,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  ScenarioSection,
  ComparisonSection,
  CTASection,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ScenarioSection />
      <ComparisonSection />
      <CTASection />
      <Footer />
    </main>
  );
}
