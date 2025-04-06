
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userInfo, setUserInfo] = useState<{name?: string; email?: string} | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for hash fragment from Auth redirect
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          // Get user profile info
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            setUserInfo({
              name: userData.user.user_metadata?.full_name,
              email: userData.user.email
            });
          }
          
          setStatus("success");
          
          toast({
            title: "Authentication successful",
            description: "You have been successfully authenticated!",
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          // Check if this is an email confirmation
          const hash = window.location.hash;
          const query = new URLSearchParams(hash.substring(1));
          const type = query.get("type");
          
          if (type === "signup" || type === "recovery" || type === "magiclink") {
            // Handle the email confirmation flow
            const { data, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            if (data?.session) {
              // User is now signed in after email confirmation
              setStatus("success");
              
              // Get user profile info
              const { data: userData } = await supabase.auth.getUser();
              if (userData?.user) {
                setUserInfo({
                  name: userData.user.user_metadata?.full_name,
                  email: userData.user.email
                });
              }
              
              toast({
                title: "Account verified!",
                description: "Your account has been successfully verified.",
              });
              
              // Redirect to dashboard after a short delay
              setTimeout(() => {
                navigate("/dashboard");
              }, 2000);
            } else {
              throw new Error("Email verification failed");
            }
          } else {
            throw new Error("Authentication failed");
          }
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Authentication failed. Please try again.");
        
        toast({
          title: "Authentication failed",
          description: error.message || "Please try again or contact support",
          variant: "destructive",
        });
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-center text-muted-foreground">
              Verifying your authentication...
            </p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Authentication Successful</h3>
            {userInfo?.name && (
              <p className="text-center text-muted-foreground mb-2">
                Welcome{userInfo.name ? ` ${userInfo.name}` : ''}!
              </p>
            )}
            <p className="text-center text-muted-foreground mb-6">
              You have been successfully authenticated.
              <br />You'll be redirected to your dashboard shortly.
            </p>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-full max-w-xs flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Authentication Failed</h3>
            <p className="text-center text-muted-foreground mb-2">
              {errorMessage}
            </p>
            <p className="text-center text-muted-foreground mb-6">
              Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/")}>
                Return Home
              </Button>
              <Button onClick={() => navigate("/login")}>
                Try Again
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full border-border/30 shadow-xl bg-card/60 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">
              Authentication
            </CardTitle>
            <CardDescription>
              Verifying your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
