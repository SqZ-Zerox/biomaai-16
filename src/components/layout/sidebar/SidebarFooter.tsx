
import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/App";

const SidebarFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const { setIsDemoMode } = useDemoMode();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Also reset demo mode when signing out
      setIsDemoMode(false);
      
      // Force refresh auth session
      await checkSession();
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="px-4 space-y-4">
      <button 
        onClick={handleSignOut}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </button>
      
      <div className="text-xs text-muted-foreground">
        <p>© 2025 Bioma AI</p>
        <p className="mt-1">Health insights powered by AI</p>
      </div>
    </div>
  );
};

export default SidebarFooter;
