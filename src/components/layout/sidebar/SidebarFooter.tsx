
import React from "react";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";

const SidebarFooter = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { setIsDemoMode } = useDemoMode();
  
  const handleSignOut = async () => {
    try {
      // Reset demo mode when signing out
      setIsDemoMode(false);
      
      // Show a loading toast
      toast({
        title: "Signing out...",
        description: "Please wait while we log you out.",
      });
      
      // Use the signOut function from AuthContext
      await signOut();
      
      // Note: We don't need additional navigation here as signOut now handles redirection
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
