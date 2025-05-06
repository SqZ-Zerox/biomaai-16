
import React from "react";
import { motion } from "framer-motion";
import LoginPageLayout from "@/components/auth/LoginPage";
import { Dna } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const LoginPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className={`w-full ${isMobile ? 'px-2' : 'max-w-md'}`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
              <Dna className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">BIOMA<span className="text-primary">AI</span></h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Sign in to your account or try our demo</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border/30 shadow-lg rounded-lg"
        >
          <LoginPageLayout />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-center text-sm text-muted-foreground"
        >
          <Link to="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
