
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
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Function to load profile data separately from session
  const loadProfileData = async (userId: string, skipCache = false) => {
    try {
      console.log("Loading profile data for user:", userId);
      const profileResult = await getUserProfile();
      
      if (profileResult.profile) {
        console.log("Profile loaded successfully");
        setProfile(profileResult.profile);
        return true;
      } else {
        console.error("Failed to load profile:", profileResult.error);
        if (!skipCache) {
          // Try one more time with force refresh
          const forceResult = await forceProfileRefresh();
          if (forceResult.profile) {
            console.log("Profile loaded successfully after force refresh");
            setProfile(forceResult.profile);
            return true;
          }
        }
        setProfileLoadAttempts(prev => prev + 1);
        return false;
      }
    } catch (profileError) {
      console.error("Error during profile fetch:", profileError);
      setProfileLoadAttempts(prev => prev + 1);
      return false;
    }
  };
  
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
        
        // Fetch user profile as a separate operation
        await loadProfileData(session.user.id);
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
    let mounted = true; // Flag to avoid state updates after unmount
    
    const setupAuth = async () => {
      console.log("Setting up auth provider");
      
      if (authInitialized) return; // Prevent duplicate initialization
      
      try {
        // First set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return; // Prevent updates after unmount
            
            console.log("Auth state change:", event);
            
            if (event === 'SIGNED_OUT') {
              setIsAuthenticated(false);
              setUser(null);
              setProfile(null);
              return;
            }
            
            if (session) {
              setUser(session.user);
              setIsAuthenticated(true);
              
              // Fetch user profile but use setTimeout to avoid Supabase conflicts
              if (event === 'SIGNED_IN') {
                setTimeout(async () => {
                  if (!mounted) return;
                  await loadProfileData(session.user.id);
                }, 500);
              }
            }
            
            setLoading(false);
          }
        );
        
        // Now that the listener is set up, check for existing session
        await loadSession();
        
        if (mounted) {
          setAuthInitialized(true);
        }
        
        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (setupError) {
        console.error("Error in auth setup:", setupError);
        if (mounted) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    };
    
    setupAuth();
    
    return () => {
      mounted = false;
    };
  }, [authInitialized]);
  
  // Add refresh profile method
  const refreshProfile = async (): Promise<void> => {
    try {
      console.log("Refreshing profile");
      if (user && isAuthenticated) {
        await loadProfileData(user.id);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };
  
  // Force refresh method that tries to recreate profile if needed
  const forceRefreshProfile = async (): Promise<void> => {
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
  
  // Full auth reset - this function completely resets the auth state
  const resetAuthState = async (): Promise<void> => {
    try {
      console.log("Resetting auth state");
      setLoading(true);
      
      // Clear cache first
      clearAuthCache();
      
      // Sign out without actually redirecting
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      
      // Check for session again after a brief delay
      setTimeout(async () => {
        if (mounted) {
          await loadSession(true);
          setLoading(false);
          // After reset, try to reauthorize
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setUser(data.session.user);
            setIsAuthenticated(true);
            await loadProfileData(data.session.user.id, true);
          }
        }
      }, 1000);
    } catch (error) {
      console.error("Error resetting auth state:", error);
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      clearAuthCache();
      cleanupAuthState();
      console.log("Signed out successfully");
      // Redirect to login page after successful sign out
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
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
