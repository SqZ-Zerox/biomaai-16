
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6 p-8 rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm max-w-md w-full neon-border animated-bg">
        <div className="space-y-4">
          <h1 className="text-7xl font-bold text-primary neon-text floating">404</h1>
          <p className="text-2xl font-medium mt-3 text-foreground">Page Not Found</p>
          <p className="text-muted-foreground mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/")}
          className="mt-6 bg-primary hover:bg-primary/90 neon-glow"
        >
          <HomeIcon className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <p className="text-xs text-muted-foreground mt-8">
          © 2025 LegalAid • Created by Zawad
        </p>
      </div>
    </div>
  );
};

export default NotFound;
