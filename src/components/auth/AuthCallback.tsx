
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserVerificationStatus } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AuthCallback: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { checkSession } = useAuth();
  const { toast } = useToast();
  
  // Track verification attempts to prevent infinite loops
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    const handleVerification = async () => {
      // If we've exceeded max attempts, bail out
      if (verificationAttempts >= maxAttempts) {
        setIsVerifying(false);
        setIsSuccess(false);
        setErrorMessage(`Verification failed after ${maxAttempts} attempts. Please try logging in again.`);
        return;
      }
      
      try {
        console.log("Starting verification process...");
        setIsVerifying(true);

        // Process the verification
        const { updated, verified } = await updateUserVerificationStatus();
        console.log("Verification result:", { updated, verified });

        if (verified) {
          setIsSuccess(true);
          // Refresh auth session
          await checkSession();
          
          // Show success toast
          toast({
            title: "Verification successful",
            description: "Your account has been verified. Redirecting to dashboard...",
          });
          
          // Navigate to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else if (updated) {
          // If the update happened but verification failed, the user might not be verified yet
          setIsSuccess(false);
          setErrorMessage("Your account verification is still pending. Please check your email.");
          
          // Navigate back to login after a short delay
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          // Try again if we're within the attempt limit
          const nextAttempt = verificationAttempts + 1;
          setVerificationAttempts(nextAttempt);
          
          if (nextAttempt < maxAttempts) {
            // Wait with exponential backoff before trying again
            const backoffTime = Math.min(5000, Math.pow(2, nextAttempt) * 1000);
            
            console.log(`Verification attempt ${nextAttempt}/${maxAttempts} failed, retrying in ${backoffTime/1000}s`);
            
            setTimeout(() => {
              handleVerification();
            }, backoffTime);
            return;
          }
          
          // Max attempts reached
          setIsSuccess(false);
          setErrorMessage("Verification failed. The link may have expired or is invalid.");
          
          // Navigate back to login after a short delay
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.error("Error during verification:", error);
        
        // Try to extract a meaningful error message
        let errorMsg = "An error occurred during verification.";
        if (error instanceof Error) {
          // Check for rate limiting errors
          if (error.message.includes('429') || error.message.includes('rate limit')) {
            errorMsg = "Too many verification attempts. Please wait a moment and try again.";
            
            // For rate limit errors, try again with exponential backoff
            const nextAttempt = verificationAttempts + 1;
            if (nextAttempt < maxAttempts) {
              setVerificationAttempts(nextAttempt);
              const backoffTime = Math.min(10000, Math.pow(2, nextAttempt) * 2000);
              setTimeout(() => {
                handleVerification();
              }, backoffTime);
              return;
            }
          } else {
            errorMsg = `Verification error: ${error.message}`;
          }
        }
        
        setIsSuccess(false);
        setErrorMessage(errorMsg);
      } finally {
        setIsVerifying(false);
      }
    };

    handleVerification();
  }, [checkSession, navigate, toast, verificationAttempts]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-auto">
      <div className="w-full max-w-3xl bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Account Verification</h1>
        
        {isVerifying && (
          <div className="text-center p-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg">Verifying your account...</p>
          </div>
        )}
        
        {!isVerifying && isSuccess && (
          <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Verification Successful!</h2>
            <p className="text-muted-foreground text-center text-lg max-w-md">
              Your account has been verified successfully. Redirecting you to the dashboard...
            </p>
          </div>
        )}
        
        {!isVerifying && !isSuccess && (
          <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <X className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Verification Failed</h2>
            <p className="text-muted-foreground text-center text-lg mb-6 max-w-md">
              {errorMessage || "Something went wrong during verification."}
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
