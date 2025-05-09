
import React from "react";
import { Button } from "@/components/ui/button";
import { Google } from "lucide-react";
import { signInWithGoogle } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface GoogleSignInButtonProps {
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  isLoading = false,
  setIsLoading,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      if (setIsLoading) setIsLoading(true);
      
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Google Login Failed",
          description: error.message || "Failed to login with Google. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Google login initiated - redirecting to Google auth page
      // No need to navigate as OAuth will handle redirects
    } catch (error: any) {
      console.error("Error in Google sign in:", error);
      toast({
        title: "Google Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full h-12 text-base ${className}`}
    >
      <Google className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
