
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProfileCompletionForm from './form/ProfileCompletionForm';

interface SocialProviderCallbackProps {
  provider: string;
}

const SocialProviderCallback: React.FC<SocialProviderCallbackProps> = ({ provider }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, checkSession } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Refresh the auth session to ensure we have the latest user data
        await checkSession();
        
        // Check if the user exists and is authenticated
        if (isAuthenticated && user) {
          // If the user was created via social login, they might need to complete their profile
          // Check if user has completed their profile
          const userMetadata = user.user_metadata || {};
          
          // If first_name and last_name are missing, or if registration_data is missing health-related info
          const registrationData = userMetadata.registration_data || {};
          
          const needsCompletion = 
            !userMetadata.first_name || 
            !userMetadata.last_name ||
            !registrationData.birth_date ||
            !registrationData.gender ||
            !registrationData.height ||
            !registrationData.weight ||
            !registrationData.activity_level;
          
          setNeedsProfileCompletion(needsCompletion);
          
          if (!needsCompletion) {
            // User has a complete profile, redirect to dashboard
            toast({
              title: "Login Successful",
              description: `Welcome${userMetadata.first_name ? ` ${userMetadata.first_name}` : ""}!`,
            });
            navigate('/dashboard');
          }
        } else {
          // Something went wrong with the authentication
          toast({
            title: "Authentication Failed",
            description: "Unable to complete the sign-in process. Please try again.",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error("Social callback error:", error);
        toast({
          title: "Authentication Error",
          description: "An error occurred during the sign-in process. Please try again.",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, [user, isAuthenticated, checkSession, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md mx-auto bg-card border border-border/30 shadow-xl rounded-xl overflow-hidden p-10 text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Completing {provider} Sign In</h2>
          <p className="text-muted-foreground">Please wait while we finish setting up your account...</p>
        </div>
      </div>
    );
  }
  
  if (needsProfileCompletion) {
    return <ProfileCompletionForm provider={provider} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto bg-card border border-border/30 shadow-xl rounded-xl overflow-hidden p-10 text-center">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Sign In Complete!</h2>
        <p className="text-muted-foreground mb-4">Successfully signed in with {provider}. Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default SocialProviderCallback;
