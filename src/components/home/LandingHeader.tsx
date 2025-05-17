
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoUrl = "/lovable-uploads/a250c362-9d68-403d-a105-c329a9435a47.png";
  const [scrollY, setScrollY] = useState(0);

  // Only show logo on the exact landing page route (/)
  const shouldShowLogo = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const headerOpacity = Math.min(0.9 + scrollY * 0.001, 0.98);
  const headerBlur = Math.min(4 + scrollY * 0.05, 12);

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut" 
      }
    })
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 py-4 px-6 border-b border-border/20"
      style={{ 
        backgroundColor: `rgba(var(--background), ${headerOpacity})`,
        backdropFilter: `blur(${headerBlur}px)` 
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {shouldShowLogo && (
            <motion.div 
              className="relative flex items-center justify-center"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <img 
                src={logoUrl} 
                alt="BiomaAI Logo" 
                className="w-20 h-20 object-contain animate-float" 
                style={{ filter: 'brightness(1.2)' }}
              />
            </motion.div>
          )}
          <motion.h1 
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            BIOMA<span className="text-primary bg-clip-text text-transparent bg-purple-gradient">AI</span>
          </motion.h1>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-1">
          {["features", "testimonials", "pricing"].map((section, i) => (
            <motion.div
              key={section}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => scrollToSection(section)}
                className="transition-transform relative overflow-hidden group"
              >
                <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Button>
            </motion.div>
          ))}
          
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 transition-transform border-primary/30 hover:border-primary/60" 
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </motion.div>
          
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm" 
              className="ml-1 transition-transform relative overflow-hidden group" 
              onClick={() => navigate("/login")}
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-purple-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        </nav>
        
        <motion.div 
          className="md:hidden flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="sm" 
            onClick={() => navigate("/login")}
            className="transition-transform relative overflow-hidden group"
          >
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 bg-purple-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;
