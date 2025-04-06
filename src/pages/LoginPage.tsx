
import React from "react";
import { motion } from "framer-motion";
import LoginPageLayout from "@/components/auth/LoginPage";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  "Advanced legal research tools",
  "Case brief generator",
  "Citation manager",
  "Legal document templates",
  "Exam preparation materials",
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Elevate Your Legal Studies
          </h1>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of law students and professionals using our platform to optimize their learning and research.
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
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
