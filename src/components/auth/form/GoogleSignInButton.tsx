
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideLogIn } from "lucide-react";
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
      
      console.log("Starting Google sign-in process...");
      
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        console.error("Google login error:", error);
        toast({
          title: "Google Login Failed",
          description: error.message || "Failed to login with Google. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Success case - the page will redirect to Google
      console.log("Google auth initiated successfully", data);
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
      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
      </svg>
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
