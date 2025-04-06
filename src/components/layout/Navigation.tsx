
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Gavel,
  Library,
  Link,
  CheckSquare,
  Home
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
      icon: <CheckSquare size={20} />,
      label: "Productivity",
      path: "/study-plan",
    },
    {
      icon: <Gavel size={20} />,
      label: "Case Brief",
      path: "/case-brief",
    },
    {
      icon: <Library size={20} />,
      label: "Flashcards",
      path: "/flashcards",
    },
    {
      icon: <Link size={20} />,
      label: "Citations",
      path: "/citation-tool",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/70 backdrop-blur-md border-t border-border/40 shadow-lg shadow-black/20 z-50">
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
                  ? "text-accent font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <div className={cn(
                "mb-1",
                isActive ? "text-accent" : ""
              )}>
                {item.icon}
              </div>
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 h-0.5 w-12 bg-accent rounded-full opacity-80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
