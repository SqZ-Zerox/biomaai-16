
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type DemoModeContextType = {
  isDemoMode: boolean;
  setIsDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoMode: false,
  setIsDemoMode: () => {}, // Default empty function
});

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      // Check if we have a Supabase session
      const { data } = await supabase.auth.getSession();
      
      // If we have a session, ensure demo mode is disabled
      if (data.session) {
        setIsDemoMode(false);
        localStorage.removeItem("bioma_demo_mode");
      } else {
        // If no session, check if demo mode was saved in localStorage
        const storedValue = localStorage.getItem("bioma_demo_mode");
        if (storedValue) {
          setIsDemoMode(JSON.parse(storedValue));
        }
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        // Disable demo mode when signed in
        setIsDemoMode(false);
        localStorage.removeItem("bioma_demo_mode");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Persist demo mode state to local storage
  useEffect(() => {
    if (isDemoMode) {
      localStorage.setItem("bioma_demo_mode", JSON.stringify(isDemoMode));
    } else {
      localStorage.removeItem("bioma_demo_mode");
    }
  }, [isDemoMode]);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, setIsDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
};

// Hook to use the demo mode context
export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
};
