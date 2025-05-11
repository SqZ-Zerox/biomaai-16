import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentSession, 
  getUserProfile, 
  cleanupAuthState,
  updateUserVerificationStatus
} from "@/services/auth";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  birth_date: string | null;
  phone_number: string | null;
  profession: string | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  activity_level: string | null;
  created_at: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  user: User | null;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  isEmailVerified: false,
  user: null,
  profile: null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const session: Session | null = await getCurrentSession();
        
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Fetch user profile
          const profileResult = await getUserProfile();
          if (profileResult.profile) {
            setProfile(profileResult.profile);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        
        if (event === 'INITIAL_SESSION') {
          await loadSession();
          return;
        }
        
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Fetch user profile
          const profileResult = await getUserProfile();
          if (profileResult.profile) {
            setProfile(profileResult.profile);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setProfile(null);
        }
        
        // Update email verification status on login
        if (event === 'SIGNED_IN') {
          await updateUserVerificationStatus();
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Add refresh profile method
  const refreshProfile = async () => {
    try {
      if (user && isAuthenticated) {
        const profileResult = await getUserProfile();
        if (profileResult.profile) {
          setProfile(profileResult.profile);
        }
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      cleanupAuthState();
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    isAuthenticated,
    isLoading: loading,
    isEmailVerified: user?.email_confirmed_at ? true : false,
    user,
    profile,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
