
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";

const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to dark

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="flex-1 container mx-auto px-4 pb-24 pt-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;
