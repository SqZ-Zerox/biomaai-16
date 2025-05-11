
import React from "react";
import { motion } from "framer-motion";
import LoginPageLayout from "@/components/auth/LoginPage";
import { Dna } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const LoginPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className={`w-full ${isMobile ? 'px-2' : 'max-w-xl'}`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 shadow-md">
              <Dna className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">BIOMA<span className="text-primary">AI</span></h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2 text-lg">Sign in to your account or try our demo</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border/30 shadow-xl rounded-xl overflow-hidden p-6"
        >
          <LoginPageLayout />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Link to="/" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
