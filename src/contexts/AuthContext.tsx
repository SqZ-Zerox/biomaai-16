
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentSession, 
  getUserProfile, 
  UserProfile, 
  ensureUserProfile,
  updateUserVerificationStatus
} from "@/services/auth";
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
  const { toast } = useToast();

  const checkSession = async () => {
    try {
      console.log("Checking session...");
      setIsLoading(true);
      
      const { session, error } = await getCurrentSession();
      
      if (error) {
        console.error("Error checking session:", error);
        return;
      }
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        console.log("Session exists, fetching profile...");
        
        // Check if email is verified
        let isVerified = session.user.user_metadata?.email_verified === true;
        
        // For social logins, they are considered pre-verified
        if (session.user.app_metadata?.provider && 
            session.user.app_metadata.provider !== 'email') {
          isVerified = true;
        }
        
        setIsEmailVerified(isVerified);
        
        // Only create/ensure profile if email is verified or using social login
        if (isVerified) {
          // Ensure user profile exists
          if (session.user.user_metadata) {
            await ensureUserProfile(session.user.id, session.user.user_metadata);
          }
          
          // Fetch user profile
          const { profile, error: profileError } = await getUserProfile();
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else {
            setProfile(profile);
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
          // Check if email is verified or using social login
          let isVerified = newSession.user.user_metadata?.email_verified === true;
          
          // For social logins, they are considered pre-verified
          if (newSession.user.app_metadata?.provider && 
              newSession.user.app_metadata.provider !== 'email') {
            isVerified = true;
          }
          
          setIsEmailVerified(isVerified);
          
          // Only create/ensure profile if email is verified or using social login
          if (isVerified) {
            // Defer profile operations to prevent deadlocks
            setTimeout(async () => {
              // Ensure user profile exists on sign in
              if (newSession.user.user_metadata) {
                await ensureUserProfile(newSession.user.id, newSession.user.user_metadata);
              }
              
              const { profile } = await getUserProfile();
              setProfile(profile);
              
              // Don't show welcome toast for social auth callback as it will be handled there
              if (!window.location.pathname.includes('/auth/callback')) {
                toast({
                  title: "Signed in successfully",
                  description: `Welcome${profile?.first_name ? ` ${profile.first_name}` : ""}!`,
                });
              }
            }, 0);
          } else {
            console.log("Email not verified yet, skipping profile creation");
            setProfile(null);
          }
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
          setIsEmailVerified(false);
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        } else if (event === "USER_UPDATED") {
          if (newSession?.user) {
            // Check if email verification status has changed
            const isVerified = newSession.user.user_metadata?.email_verified === true ||
                               (newSession.user.app_metadata?.provider && 
                               newSession.user.app_metadata.provider !== 'email');
            setIsEmailVerified(isVerified);
            
            if (isVerified) {
              // Defer profile operations to prevent deadlocks
              setTimeout(async () => {
                // If newly verified, ensure profile is created and fetch it
                if (newSession.user.user_metadata) {
                  await ensureUserProfile(newSession.user.id, newSession.user.user_metadata);
                }
                
                const { profile } = await getUserProfile();
                setProfile(profile);
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
