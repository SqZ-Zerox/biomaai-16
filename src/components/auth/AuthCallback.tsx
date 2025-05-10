
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserVerificationStatus } from '@/services/auth';
import SocialProviderCallback from './SocialProviderCallback';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for social provider information
  const provider = searchParams.get('provider');
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        // If this is a social login callback, don't process as standard email verification
        if (provider) {
          return; // The SocialProviderCallback component will handle this
        }
        
        console.log("Processing email verification callback");
        console.log("Search params:", Object.fromEntries(searchParams.entries()));
        
        // Update user verification status
        const success = await updateUserVerificationStatus();
        
        if (success) {
          toast({
            title: "Email Verified",
            description: "Your email has been verified successfully.",
            variant: "default",
          });
          
          // Important: Log the success and redirect path
          console.log("Email verification successful, refreshing auth session");
          
          // Refresh the auth context
          await checkSession();
          
          // Redirect to dashboard after a small delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          console.error("Email verification failed");
          setError("Unable to verify your email. Please try again later.");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError("An error occurred while verifying your email.");
      } finally {
        setIsProcessing(false);
      }
    };
    
    processCallback();
  }, [navigate, toast, checkSession, provider, searchParams]);
  
  if (provider) {
    return <SocialProviderCallback provider={provider} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto bg-card border border-border/30 shadow-xl rounded-xl overflow-hidden p-10 text-center">
        {isProcessing ? (
          <>
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verifying your email</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </>
        ) : error ? (
          <>
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-xl">×</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-destructive mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-4">Your email has been successfully verified. Redirecting to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
