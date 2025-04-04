
import React from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-card/70 backdrop-blur-md border-b border-border/40 py-4 px-6 sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          
          <div 
            className="flex items-center gap-2 ml-2" 
            onClick={() => navigate("/")} 
            role="button"
            tabIndex={0}
          >
            <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
              <span className="text-primary font-bold">L</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Legal<span className="text-primary">Aid</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full hover:bg-card"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunIcon className="h-[1.2rem] w-[1.2rem] text-primary" /> : <MoonIcon className="h-[1.2rem] w-[1.2rem] text-primary" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
