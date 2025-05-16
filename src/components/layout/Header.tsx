import React from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { profile } = useAuth();
  const logoUrl = "/lovable-uploads/ad59829f-84fe-4b58-a803-a7a930074fb4.png"; // Updated with new logo

  return (
    <header className="bg-card/70 backdrop-blur-md border-b border-border/40 py-3 sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          
          <div 
            className="flex items-center gap-2 ml-2 cursor-pointer" 
            onClick={() => navigate("/dashboard")} 
            role="button"
            tabIndex={0}
          >
            <div className="border border-primary/30 rounded-lg p-1 w-16 h-16 flex items-center justify-center bg-card">
              <img 
                src={logoUrl} 
                alt="BiomaAI Logo" 
                className="w-14 h-14 object-contain" 
                style={{ filter: 'brightness(1.2)' }} // Added brightness to improve visibility
              />
            </div>
            {!isMobile && <h1 className="text-xl font-bold text-foreground">Bioma<span className="text-primary">AI</span></h1>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isMobile && profile && (
            <div className="mr-2 text-right">
              <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="text-xs text-muted-foreground">Welcome back</p>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"}
            onClick={() => navigate("/notifications")}
            className="rounded-full relative hover:bg-card"
            aria-label="Notifications"
          >
            <Bell className={`${isMobile ? 'h-4 w-4' : 'h-[1.2rem] w-[1.2rem]'} text-muted-foreground`} />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">2</Badge>
          </Button>
          
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"}
            onClick={() => navigate("/profile")}
            className="rounded-full hover:bg-card"
            aria-label="Profile"
          >
            <User className={`${isMobile ? 'h-4 w-4' : 'h-[1.2rem] w-[1.2rem]'} text-muted-foreground`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "icon"}
            onClick={toggleDarkMode}
            className="rounded-full hover:bg-card"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? 
              <SunIcon className={`${isMobile ? 'h-4 w-4' : 'h-[1.2rem] w-[1.2rem]'} text-primary`} /> : 
              <MoonIcon className={`${isMobile ? 'h-4 w-4' : 'h-[1.2rem] w-[1.2rem]'} text-primary`} />
            }
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
