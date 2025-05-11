
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  getCurrentSession, 
  getUserProfile, 
  cleanupAuthState,
  updateUserVerificationStatus,
  forceProfileRefresh,
  clearAuthCache
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
  forceRefreshProfile: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  resetAuthState: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  isEmailVerified: false,
  user: null,
  profile: null,
  signOut: async () => {},
  refreshProfile: async () => {},
  forceRefreshProfile: async () => {},
  checkSession: async () => false,
  resetAuthState: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoadAttempts, setProfileLoadAttempts] = useState(0);
  
  const loadSession = async (bypassCache = false) => {
    try {
      setLoading(true);
      console.log("Loading auth session", bypassCache ? "(bypass cache)" : "");
      
      // Get current session
      const session: Session | null = await getCurrentSession(bypassCache);
      
      if (session) {
        console.log("Session found, user authenticated");
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Fetch user profile
        try {
          const profileResult = await getUserProfile();
          if (profileResult.profile) {
            console.log("Profile loaded successfully");
            setProfile(profileResult.profile);
          } else {
            console.error("Failed to load profile:", profileResult.error);
            // Only show toast if we've tried a few times
            if (profileLoadAttempts > 1) {
              toast.error("Error loading profile. Please reload the page.");
            }
            setProfileLoadAttempts(prev => prev + 1);
          }
        } catch (profileError) {
          console.error("Error during profile fetch:", profileError);
          // Only show profile errors if we've tried multiple times
          if (profileLoadAttempts > 1) {
            toast.error("Error loading your profile data");
          }
          setProfileLoadAttempts(prev => prev + 1);
        }
      } else {
        console.log("No active session found");
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
      }
      
      return session !== null;
    } catch (error) {
      console.error("Error loading session:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const checkSession = async (): Promise<boolean> => {
    try {
      // Get current session
      const session: Session | null = await getCurrentSession(true);
      return session !== null;
    } catch (error) {
      console.error("Error checking session:", error);
      return false;
    }
  };
  
  useEffect(() => {
    const setupAuth = async () => {
      console.log("Setting up auth provider");
      
      try {
        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state change:", event);
            
            if (event === 'INITIAL_SESSION') {
              // Skip handling here as we've already loaded the session below
              return;
            }
            
            if (session) {
              setUser(session.user);
              setIsAuthenticated(true);
              
              // Fetch user profile with a small delay to avoid Supabase conflict
              setTimeout(async () => {
                try {
                  const profileResult = await getUserProfile();
                  if (profileResult.profile) {
                    setProfile(profileResult.profile);
                  } else {
                    console.warn("No profile found after auth state change");
                  }
                } catch (profileError) {
                  console.error("Error fetching profile after auth state change:", profileError);
                }
              }, 300);
            } else {
              setIsAuthenticated(false);
              setUser(null);
              setProfile(null);
            }
            
            // Update email verification status on login
            if (event === 'SIGNED_IN') {
              try {
                await updateUserVerificationStatus();
              } catch (updateError) {
                console.error("Error updating verification status:", updateError);
              }
            }
            
            setLoading(false);
          }
        );
        
        // Initial session check
        await loadSession();
        
        return () => {
          subscription?.unsubscribe();
        };
      } catch (setupError) {
        console.error("Error in auth setup:", setupError);
        setLoading(false);
      }
    };
    
    setupAuth();
  }, []);
  
  // Add refresh profile method
  const refreshProfile = async () => {
    try {
      console.log("Refreshing profile");
      if (user && isAuthenticated) {
        const profileResult = await getUserProfile();
        if (profileResult.profile) {
          setProfile(profileResult.profile);
          console.log("Profile refreshed successfully");
          return;
        }
        console.warn("Profile refresh found no profile");
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };
  
  // Add force refresh method that tries to recreate profile if needed
  const forceRefreshProfile = async () => {
    try {
      console.log("Forcing profile refresh");
      setLoading(true);
      
      const result = await forceProfileRefresh();
      
      if (result.profile) {
        setProfile(result.profile);
        toast.success("Profile refreshed successfully");
      } else {
        toast.error("Could not refresh profile");
        console.error("Force refresh failed:", result.error);
      }
    } catch (error) {
      console.error("Error in force profile refresh:", error);
      toast.error("Error refreshing your profile");
    } finally {
      setLoading(false);
    }
  };
  
  // Full auth reset
  const resetAuthState = async () => {
    try {
      console.log("Resetting auth state");
      setLoading(true);
      
      // Clear cache first
      clearAuthCache();
      
      // Sign out and get a fresh session
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      
      // Check for session again after a brief delay
      setTimeout(async () => {
        await loadSession(true);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error resetting auth state:", error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      clearAuthCache();
      cleanupAuthState();
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
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
    forceRefreshProfile,
    checkSession,
    resetAuthState,
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
