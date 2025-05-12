
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoginPageLayout from "@/components/auth/LoginPage";
import { Dna, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated, isLoading, resetAuthState } = useAuth();
  const navigate = useNavigate();
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSessionError, setShowSessionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Handle page refresh and browser back button
  useEffect(() => {
    // Cleanup auth state if we're returning to login page
    const pageRefreshed = performance.navigation?.type === 1;
    const backButtonUsed = window.history.state?.navigationSource === 'back_button';
    
    if ((pageRefreshed || backButtonUsed) && retryCount === 0) {
      console.log("Login page loaded via refresh or back button, cleaning up auth state");
      resetAuthState();
      setRetryCount(prev => prev + 1);
    }
  }, [resetAuthState, retryCount]);

  // Redirect if already authenticated - with debounce to prevent rapid redirects
  useEffect(() => {
    // Clear any existing timeout to prevent race conditions
    if (redirectTimeout) {
      clearTimeout(redirectTimeout);
    }
    
    if (isAuthenticated && !isLoading) {
      // Add small delay to prevent flickering during auth state changes
      const timeout = setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      setRedirectTimeout(timeout);
    }
    
    // Detect potential auth loop issues (multiple redirects back to login)
    const detectAuthLoop = () => {
      const authRedirects = sessionStorage.getItem('auth_redirects');
      const redirectCount = authRedirects ? parseInt(authRedirects) : 0;
      
      if (redirectCount > 3) {
        console.error("Potential authentication loop detected");
        setShowSessionError(true);
        // Reset the counter after showing error
        sessionStorage.setItem('auth_redirects', '0');
      } else {
        sessionStorage.setItem('auth_redirects', (redirectCount + 1).toString());
      }
    };
    
    detectAuthLoop();
    
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [isAuthenticated, isLoading, navigate, redirectTimeout]);

  const handleResetSession = async () => {
    setShowSessionError(false);
    await resetAuthState();
    sessionStorage.setItem('auth_redirects', '0');
    // Force reload the page to clear any stuck state
    window.location.reload();
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking authentication status...</p>
          <p className="text-sm text-muted-foreground/70 mt-2">This may take a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 bg-gradient-to-br from-background via-background to-primary/5">
      {showSessionError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl mb-4"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There was an issue with your authentication session. Please try again.
              <button 
                onClick={handleResetSession}
                className="ml-2 underline font-medium"
              >
                Reset session
              </button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      <div className={`w-full ${isMobile ? 'px-2' : 'max-w-xl'}`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 shadow-md">
              <Dna className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">BIOMA<span className="text-primary">AI</span></h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2 text-lg">Sign in to your account or try our demo</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border/30 shadow-xl rounded-xl overflow-hidden p-6"
        >
          <LoginPageLayout />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Link to="/" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
