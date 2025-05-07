
import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    // Check local storage for persisted demo mode state
    const storedValue = localStorage.getItem("bioma_demo_mode");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  // Persist demo mode state to local storage
  useEffect(() => {
    localStorage.setItem("bioma_demo_mode", JSON.stringify(isDemoMode));
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
