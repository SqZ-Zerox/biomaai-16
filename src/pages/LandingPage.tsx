
import React, { useEffect } from "react";
import LandingHeader from "@/components/home/LandingHeader";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import LandingFooter from "@/components/home/LandingFooter";
import FAQSection from "@/components/home/FAQSection";
import PricingSection from "@/components/home/PricingSection";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  // Add a scroll reveal effect for elements as they come into view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Target all elements with stagger-item class
    const staggerItems = document.querySelectorAll('.stagger-item');
    staggerItems.forEach(item => observer.observe(item));

    return () => {
      staggerItems.forEach(item => observer.unobserve(item));
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/5 pointer-events-none"></div>
      
      <LandingHeader />
      <main className="flex-1 pt-16 relative">
        <div className="absolute top-0 right-0 w-1/2 h-[30rem] bg-gradient-radial from-primary/10 to-transparent rounded-full filter blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-[20rem] bg-gradient-radial from-primary/5 to-transparent rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
        
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </motion.div>
  );
};

export default LandingPage;
