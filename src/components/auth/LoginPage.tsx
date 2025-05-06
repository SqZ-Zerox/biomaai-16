
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
      className="w-full max-w-md mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header 
        variants={itemVariants}
        className="mb-6 flex items-center justify-between"
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
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
      </motion.header>
      
      <motion.div variants={itemVariants}>
        <Card className="border-border/30 shadow-lg">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
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
    </motion.div>
  );
};

export default LoginPage;
