
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dna } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingHeader: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-background/90 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[6px]"></div>
            <div className="relative rounded-full p-1.5 w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/20">
              <Dna className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold">BIOMA<span className="text-primary">AI</span></h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('features')}>
            Features
          </Button>
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('testimonials')}>
            Testimonials
          </Button>
          <Button variant="ghost" size="sm" onClick={() => scrollToSection('pricing')}>
            Pricing
          </Button>
          <Button variant="outline" size="sm" className="ml-2" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button size="sm" className="ml-1" onClick={() => navigate("/login")}>
            Get Started
          </Button>
        </nav>
        
        <div className="md:hidden flex items-center">
          <Button size="sm" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
