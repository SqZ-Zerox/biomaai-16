
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Upload, MessageCircle, User, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-2">
      <div className="flex justify-around items-center">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Home</span>
        </NavLink>
        
        <NavLink 
          to="/upload" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Upload className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Upload</span>
        </NavLink>
        
        <NavLink 
          to="/progress" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Progress</span>
        </NavLink>
        
        <NavLink 
          to="/chat" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Chat</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navigation;
