import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentSession, 
  getUserProfile, 
  ensureUserProfile,
} from "@/services/auth";
import { UserProfile } from "@/services/auth/types";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  checkSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isEmailVerified: false,
  checkSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { toast } = useToast();

  // Function to clean up any lingering auth tokens
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const checkSession = async () => {
    try {
      console.log("Checking session...");
      setIsLoading(true);
      
      const { data } = await getCurrentSession();
      
      if (!data || !data.session) {
        console.error("Error checking session:", data.error);
        return;
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        console.log("Session exists, fetching profile...");
        console.log("User metadata:", data.session.user.user_metadata);
        
        // Check if email is verified
        let isVerified = true; // Default to true for social logins
        
        // For email-password logins, check email verification
        if (data.session.user.app_metadata?.provider === 'email' || 
            !data.session.user.app_metadata?.provider) {
          isVerified = data.session.user.email_confirmed_at != null;
          console.log("Email confirmed at:", data.session.user.email_confirmed_at);
        }
        
        setIsEmailVerified(isVerified);
        
        // Only create/ensure profile if email is verified or using social login
        if (isVerified) {
          // Ensure user profile exists
          try {
            if (data.session.user.user_metadata) {
              await ensureUserProfile(data.session.user.id, data.session.user.user_metadata);
            }
            
            // Fetch user profile
            const { profile, error: profileError } = await getUserProfile();
            if (profileError) {
              console.error("Error fetching profile:", profileError);
            } else {
              setProfile(profile);
            }
          } catch (err) {
            console.error("Error during profile setup:", err);
          }
        } else {
          console.log("Email not verified yet, skipping profile fetch");
          setProfile(null);
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (event === "SIGNED_IN" && newSession?.user) {
          // Check if email is verified
          let isVerified = true; // Default to true for social logins
          
          // For email-password logins, check email verification
          if (newSession.user.app_metadata?.provider === 'email' || 
              !newSession.user.app_metadata?.provider) {
            isVerified = newSession.user.email_confirmed_at != null;
            console.log("Email confirmed at:", newSession.user.email_confirmed_at);
          }
          
          setIsEmailVerified(isVerified);
          
          // Only create/ensure profile if email is verified or using social login
          if (isVerified) {
            // Defer profile operations to prevent deadlocks
            setTimeout(async () => {
              try {
                // Ensure user profile exists on sign in
                if (newSession.user.user_metadata) {
                  await ensureUserProfile(newSession.user.id, newSession.user.user_metadata);
                }
                
                const { profile } = await getUserProfile();
                setProfile(profile);
                
                // Don't show welcome toast for social auth callback as it will be handled there
                // Only show welcome message once per session
                if (!window.location.pathname.includes('/auth/callback') && !hasShownWelcome) {
                  toast({
                    title: "Signed in successfully",
                    description: `Welcome${profile?.first_name ? ` ${profile.first_name}` : ""}!`,
                  });
                  setHasShownWelcome(true); // Mark welcome message as shown
                }
              } catch (err) {
                console.error("Error during profile setup after sign-in:", err);
              }
            }, 0);
          } else {
            console.log("Email not verified yet, skipping profile creation");
            setProfile(null);
          }
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
          setIsEmailVerified(false);
          setHasShownWelcome(false); // Reset welcome message flag on sign out
          cleanupAuthState(); // Clean up any lingering auth tokens
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        } else if (event === "USER_UPDATED") {
          if (newSession?.user) {
            // Important debugging
            console.log("User updated event received:", newSession.user);
            console.log("New user metadata:", newSession.user.user_metadata);
            console.log("Email confirmed at:", newSession.user.email_confirmed_at);
            
            // Check if email verification status has changed
            const isVerified = newSession.user.email_confirmed_at != null ||
                               (newSession.user.app_metadata?.provider && 
                               newSession.user.app_metadata.provider !== 'email');
            
            console.log("Is user email verified:", isVerified);
            setIsEmailVerified(isVerified);
            
            if (isVerified && !profile) {
              // Defer profile operations to prevent deadlocks
              setTimeout(async () => {
                try {
                  // If newly verified, ensure profile is created and fetch it
                  if (newSession.user.user_metadata) {
                    await ensureUserProfile(newSession.user.id, newSession.user.user_metadata);
                  }
                  
                  const { profile } = await getUserProfile();
                  setProfile(profile);
                } catch (err) {
                  console.error("Error during profile setup after user update:", err);
                }
              }, 0);
            }
          }
        }
      }
    );

    // THEN check for existing session
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isAuthenticated: !!session,
        isEmailVerified,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
