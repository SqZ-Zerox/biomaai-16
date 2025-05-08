
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Apple, 
  Dumbbell,
  HeartPulse,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FileText size={20} />,
      label: "Lab Reports",
      path: "/upload",
    },
    {
      icon: <Apple size={20} />,
      label: "Nutrition",
      path: "/nutrition",
    },
    {
      icon: <Dumbbell size={20} />,
      label: "Fitness",
      path: "/fitness",
    },
    {
      icon: <HeartPulse size={20} />,
      label: "Progress",
      path: "/progress",
    },
    {
      icon: <MessageCircle size={20} />,
      label: "Bioma Bot",
      path: "/chat",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/settings",
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/70 backdrop-blur-md border-t border-border/40 shadow-lg shadow-black/20 z-50 md:hidden">
      <div className="container mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          // Check if the current path matches this nav item's path
          // Also consider exact path or starting with path (for nested routes)
          const isActive = location.pathname === item.path || 
                         (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-2 sm:px-4 rounded-md transition-all relative",
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <div className={cn(
                "mb-1",
                isActive ? "text-primary" : ""
              )}>
                {item.icon}
              </div>
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 h-0.5 w-12 bg-primary rounded-full opacity-80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
