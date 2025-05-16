
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoUrl = "/lovable-uploads/a250c362-9d68-403d-a105-c329a9435a47.png";

  // Only show logo on the exact landing page route (/)
  const shouldShowLogo = location.pathname === '/';

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-background/90 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {shouldShowLogo && (
            <div className="relative flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt="BiomaAI Logo" 
                className="w-20 h-20 object-contain" 
                style={{ filter: 'brightness(1.2)' }}
              />
            </div>
          )}
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
