
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const featuredRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuredRef, { once: true, margin: "-100px" });
  
  const handleGetStarted = () => {
    navigate("/login");
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Fixed the glowVariants to use a specific repeatType from allowed options
  const glowVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: { 
      opacity: [0.5, 0.8, 0.5], 
      scale: [1, 1.05, 1],
      transition: { 
        duration: 3, 
        repeat: Infinity,
        repeatType: "reverse" as const // Type assertion to fix the error
      }
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          ref={featuredRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          ></motion.div>
          
          <motion.div 
            className="relative glass-card bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-primary/20 overflow-hidden soft-shadow"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
              <motion.div 
                className="max-w-xl"
                variants={itemVariants}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Decode Your Health?</h2>
                <p className="text-muted-foreground mb-6 md:mb-0">
                  Join BIOMA AI today and transform confusing lab results into clear, personalized wellness guidance. 
                  Your journey to better health starts with understanding your body.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 md:flex-col lg:flex-row"
                variants={itemVariants}
              >
                {/* Wrap Button in motion.div for hover animations */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-full relative overflow-hidden group"
                    onClick={handleGetStarted}
                  >
                    <span className="relative z-10 flex items-center">
                      Start Your Journey
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="ml-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </span>
                    <span className="absolute inset-0 bg-purple-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </motion.div>
                
                {/* Wrap Button in motion.div for hover animations */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-primary/20 w-full group"
                    onClick={scrollToFeatures}
                  >
                    <span className="flex items-center">
                      Explore Features
                      <motion.span
                        className="ml-2 transition-transform duration-300 group-hover:rotate-45"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
