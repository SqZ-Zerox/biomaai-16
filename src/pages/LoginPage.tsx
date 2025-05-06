
import React from "react";
import { motion } from "framer-motion";
import LoginPageLayout from "@/components/auth/LoginPage";
import { ArrowRight, CheckCircle2, ActivitySquare, Dna, Apple, Dumbbell, ChartLine, Heart, Weight, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  "Comprehensive blood test analysis",
  "Personalized nutrition recommendations",
  "Custom fitness regimens based on biomarkers",
  "Health metrics tracking and optimization",
  "Scientific insights for optimal wellness",
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <LoginPageLayout />
      </div>
      
      {/* Right side - Marketing Content */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full md:w-1/2 bg-gradient-to-br from-primary/90 to-primary-foreground/90 text-white p-8 md:p-12 flex flex-col justify-center"
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Dna className="h-8 w-8 text-white" />
            <h1 className="text-3xl md:text-4xl font-bold">
              BIOMA AI
            </h1>
          </div>
          
          <p className="text-lg mb-8 text-white/90">
            Unlock your body's full potential with AI-powered analysis of your lab tests, delivering personalized health recommendations tailored to your unique biology.
          </p>
          
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                className="flex items-center"
              >
                <CheckCircle2 className="h-5 w-5 mr-2 text-white" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate("/")}
            variant="outline" 
            className="bg-white text-primary hover:bg-white/90 hover:text-primary-foreground border-none"
          >
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {/* Added illustrations for visual appeal */}
          <div className="mt-8 grid grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-white/10 rounded-lg p-3 flex items-center justify-center"
            >
              <Dna className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="bg-white/10 rounded-lg p-3 flex items-center justify-center"
            >
              <Apple className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="bg-white/10 rounded-lg p-3 flex items-center justify-center"
            >
              <Dumbbell className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="bg-white/10 rounded-lg p-3 flex items-center justify-center"
            >
              <Heart className="h-8 w-8 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
