
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarRail } from "@/components/ui/sidebar";
import Header from "./Header";
import Navigation from "./Navigation";
import AppSidebar from "./AppSidebar";

const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to dark

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen bg-background w-full animated-bg">
        <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <SidebarRail />
          
          {/* Main content */}
          <main className="flex-1 container mx-auto px-4 pb-20 pt-6 relative z-10 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              {/* Background effects */}
              <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl glow-effect"></div>
                <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full bg-primary/5 filter blur-3xl glow-effect" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-2/3 left-1/3 w-40 h-40 rounded-full bg-primary/5 filter blur-3xl glow-effect" style={{animationDelay: '0.8s'}}></div>
              </div>
              
              <Outlet />
            </div>
          </main>
        </div>
        
        <Navigation />
        
        {/* Copyright mark - moved to bottom right */}
        <div className="fixed bottom-[68px] right-4 z-10 text-center py-1 text-xs text-muted-foreground pointer-events-none">
          <div className="inline-block px-4 py-1 rounded-full bg-background/60 backdrop-blur-md border border-border/40 shadow-sm">
            <span className="opacity-70">© 2025 LegalAid</span>
            <span className="mx-2 text-primary/50">•</span>
            <span className="opacity-70">Created by Zawad</span>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
