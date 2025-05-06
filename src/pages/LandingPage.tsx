
import React from "react";
import LandingHeader from "@/components/home/LandingHeader";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import LandingFooter from "@/components/home/LandingFooter";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
