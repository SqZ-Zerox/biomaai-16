
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentSession, getUserProfile, UserProfile } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  checkSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const { session, error } = await getCurrentSession();
      
      if (error) {
        console.error("Error checking session:", error);
        return;
      }
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const { profile, error: profileError } = await getUserProfile();
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profile);
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (event === "SIGNED_IN" && newSession?.user) {
          const { profile } = await getUserProfile();
          setProfile(profile);
          toast({
            title: "Signed in successfully",
            description: `Welcome${profile?.first_name ? ` ${profile.first_name}` : ""}!`,
          });
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        }
      }
    );

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
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
