
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dna } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header 
        variants={itemVariants}
        className="py-4 px-6 border-b border-border/40 bg-background/95 backdrop-blur-sm w-full z-10 sticky top-0"
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
              <Dna className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">BIOMA<span className="text-primary">AI</span></h1>
          </Link>
          <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:translate-x-[-5px]">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.header>
      
      <motion.main 
        variants={itemVariants}
        className="flex-1 flex items-center justify-center p-6 relative"
      >
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl animate-pulse" 
            style={{ animationDuration: '15s' }}
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full bg-primary/5 filter blur-3xl animate-pulse" 
            style={{ animationDuration: '20s', animationDelay: '2s' }}
          />
        </div>
        
        <div className="w-full max-w-md">
          <motion.div
            variants={itemVariants}
          >
            <Card className="border-border/30 shadow-xl bg-card/60 backdrop-blur-sm overflow-hidden">
              <CardHeader className="space-y-1">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <CardTitle className="text-2xl font-bold text-center">Welcome to BIOMA AI</CardTitle>
                  <CardDescription className="text-center">
                    Sign in or create an account to access your personalized health insights
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <AuthForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>
      
      <motion.footer 
        variants={itemVariants}
        className="py-4 px-6 border-t border-border/40 bg-background/95 backdrop-blur-sm"
      >
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 BIOMA AI. All rights reserved.</p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default LoginPage;
