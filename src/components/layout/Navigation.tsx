
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Home, 
  BookOpen, 
  MessageSquareText, 
  Scale, 
  FileText, 
  PenTool, 
  Library,
  CheckSquare,
  Upload,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/study", label: "Study", icon: BookOpen },
    { path: "/chat", label: "Chat", icon: MessageSquareText },
    { path: "/case-brief", label: "Case Brief", icon: Scale },
    { path: "/legal-essays", label: "Essays", icon: FileText },
    { path: "/citation-tool", label: "Citations", icon: PenTool },
    { path: "/flashcards", label: "Flashcards", icon: Library },
    { path: "/study-plan", label: "Tasks", icon: CheckSquare },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/settings", label: "Settings", icon: Settings },
  ];
  
  // Filter navigation for mobile view
  const mobileNavItems = navigationItems.slice(0, 5);
  const itemsToShow = isMobile ? mobileNavItems : navigationItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <nav className="flex items-center justify-around p-2 pb-3 border-t bg-background/90 backdrop-blur-md">
        {itemsToShow.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col h-16 w-16 gap-1 items-center justify-center rounded-lg",
                isActive ? "text-primary bg-primary/10 border border-primary/20" : "text-muted-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
