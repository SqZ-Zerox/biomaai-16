
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./form/LoginForm";
import SignupForm from "./form/SignupForm";
import RegistrationSuccessAlert from "./form/RegistrationSuccessAlert";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const AuthForm: React.FC = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { isDemoMode, setIsDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Effect to redirect if in demo mode
  useEffect(() => {
    if (isDemoMode) {
      navigate("/dashboard");
    }
  }, [isDemoMode, navigate]);
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  // Reset success notification when switching tabs
  const handleTabChange = (value: string) => {
    if (value === "login") {
      setRegistrationSuccess(false);
    }
  };

  const handleRegistrationSuccess = (email: string) => {
    setRegistrationSuccess(true);
    setRegisteredEmail(email);
    
    // Switch to the login tab
    const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
    if (loginTab) {
      loginTab.click();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="w-full"
    >
      <AnimatePresence>
        {registrationSuccess && (
          <RegistrationSuccessAlert 
            email={registeredEmail} 
            onDismiss={() => setRegistrationSuccess(false)} 
          />
        )}
      </AnimatePresence>

      <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 rounded-lg mb-8 overflow-hidden border border-border/30 shadow-sm">
          <TabsTrigger 
            value="login" 
            className="text-base py-3 rounded-none data-[state=active]:bg-card data-[state=active]:shadow-none"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="signup" 
            className="text-base py-3 rounded-none data-[state=active]:bg-card data-[state=active]:shadow-none"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4 animate-fade-in">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="signup" className="animate-fade-in">
          <SignupForm onRegistrationSuccess={handleRegistrationSuccess} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AuthForm;
