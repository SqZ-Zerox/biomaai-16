
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Upload 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      icon: <BookOpen size={20} />,
      label: "Study",
      path: "/study",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Chat",
      path: "/chat",
    },
    {
      icon: <Calendar size={20} />,
      label: "Plan",
      path: "/study-plan",
    },
    {
      icon: <Upload size={20} />,
      label: "Upload",
      path: "/upload",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card shadow-[0_-1px_2px_rgba(0,0,0,0.1)] z-50">
      <div className="container mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-md transition-colors",
                isActive 
                  ? "text-legal-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <div className={cn(
                "mb-1",
                isActive && "text-legal-primary"
              )}>
                {item.icon}
              </div>
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-1 w-10 bg-legal-primary rounded-t-md" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
