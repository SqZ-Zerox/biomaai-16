
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import LoginPageLayout from "@/components/auth/LoginPage";
import { Dna } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated - with debounce to prevent rapid redirects
  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    
    if (isAuthenticated && !isLoading) {
      // Add small delay to prevent flickering during auth state changes
      redirectTimeout = setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    }
    
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [isAuthenticated, isLoading, navigate]);

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Checking authentication status...</p>
      </div>
    );
  }

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
