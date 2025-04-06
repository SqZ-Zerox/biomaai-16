
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Process the OAuth or email confirmation callback
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
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
          // If no session, check if this is an email confirmation
          const hash = window.location.hash;
          const query = new URLSearchParams(hash.substring(1));
          const type = query.get("type");
          
          if (type === "email_confirmation") {
            setStatus("success");
            
            toast({
              title: "Email verified",
              description: "Your email has been successfully verified. You can now sign in.",
            });
            
            // Redirect to login page after a short delay
            setTimeout(() => {
              navigate("/login");
            }, 2000);
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

    handleCallback();
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
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              Authentication successful. You'll be redirected shortly.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-center text-muted-foreground mb-2">
              {errorMessage}
            </p>
            <div className="flex gap-4 mt-4">
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
        <Card className="w-full border-border/40 bg-card/60 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Authentication
            </CardTitle>
            <CardDescription className="text-center">
              Finalizing your authentication process
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
