
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserVerificationStatus } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X } from "lucide-react";

const AuthCallback: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { checkSession } = useAuth();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        console.log("Starting verification process...");
        setIsVerifying(true);

        // Process the verification
        const verified = await updateUserVerificationStatus();
        console.log("Verification result:", verified);

        if (verified) {
          setIsSuccess(true);
          // Refresh auth session
          await checkSession();
          
          // Navigate to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setIsSuccess(false);
          setErrorMessage("Verification failed. The link may have expired or is invalid.");
          
          // Navigate back to login after a short delay
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.error("Error during verification:", error);
        setIsSuccess(false);
        setErrorMessage("An error occurred during verification.");
      } finally {
        setIsVerifying(false);
      }
    };

    handleVerification();
  }, [checkSession, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-auto">
      <div className="w-full max-w-xl bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Account Verification</h1>
        
        {isVerifying && (
          <div className="text-center p-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg">Verifying your account...</p>
          </div>
        )}
        
        {!isVerifying && isSuccess && (
          <div className="flex flex-col items-center p-6">
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
          <div className="flex flex-col items-center p-6">
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
