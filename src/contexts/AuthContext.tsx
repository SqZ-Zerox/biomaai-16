
import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  getCurrentSession, 
  getUserProfile, 
  cleanupAuthState,
  updateUserVerificationStatus,
  forceProfileRefresh,
  clearAuthCache,
  resetRefreshAttempts,
  refreshSession,
  resetRefreshState
} from "@/services/auth";
import { attemptUserDataRecovery } from "@/services/auth/dataRecovery";

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
  recoverUserData: () => Promise<boolean>;
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
  recoverUserData: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoadAttempts, setProfileLoadAttempts] = useState(0);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sessionRefreshing, setSessionRefreshing] = useState(false);
  
  // Using a ref to track mounted state to prevent state updates after unmount
  const isMountedRef = useRef(true);
  // Track auth state changes to prevent loops
  const authStateChangeCount = useRef(0);
  
  // Function to attempt recovery of user data
  const recoverUserData = async (): Promise<boolean> => {
    try {
      if (!user?.id) {
        console.warn("No user ID available for recovery");
        return false;
      }
      
      setLoading(true);
      const success = await attemptUserDataRecovery(user.id);
      
      if (success) {
        // Refresh the profile to get the recovered data
        await refreshProfile();
        toast.success("Profile data has been recovered");
        return true;
      } else {
        toast.error("Could not recover profile data");
        return false;
      }
    } catch (error) {
      console.error("Error in recoverUserData:", error);
      toast.error("Error during data recovery");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load profile data separately from session
  const loadProfileData = async (userId: string, skipCache = false) => {
    try {
      console.log("Loading profile data for user:", userId);
      const profileResult = await getUserProfile();
      
      // Check if the component is still mounted before updating state
      if (!isMountedRef.current) return false;
      
      if (profileResult.profile) {
        console.log("Profile loaded successfully");
        setProfile(profileResult.profile);
        return true;
      } else {
        console.error("Failed to load profile:", profileResult.error);
        if (!skipCache) {
          // Try one more time with force refresh
          const forceResult = await forceProfileRefresh();
          
          // Check if component is still mounted
          if (!isMountedRef.current) return false;
          
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
      
      // Only update state if still mounted
      if (isMountedRef.current) {
        setProfileLoadAttempts(prev => prev + 1);
      }
      return false;
    }
  };
  
  const loadSession = async (bypassCache = false) => {
    try {
      if (sessionRefreshing) {
        console.log("Session refresh already in progress, skipping");
        return false;
      }
      
      setSessionRefreshing(true);
      setLoading(true);
      console.log("Loading auth session", bypassCache ? "(bypass cache)" : "");
      
      // Reset refresh attempts when explicitly loading a session
      resetRefreshAttempts();
      resetRefreshState();
      
      // Get current session
      const session: Session | null = await getCurrentSession(bypassCache);
      
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) {
        console.log("Component unmounted during session load, aborting state updates");
        return false;
      }
      
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
      
      // Only update state if still mounted
      if (isMountedRef.current) {
        setSessionRefreshing(false);
        setLoading(false);
      }
      
      return session !== null;
    } catch (error) {
      console.error("Error loading session:", error);
      
      // Only update state if still mounted
      if (isMountedRef.current) {
        setSessionRefreshing(false);
        setLoading(false);
      }
      
      return false;
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
    console.log("Setting up auth provider");
    
    // Set the mounted ref to true when component mounts
    isMountedRef.current = true;
    
    const setupAuth = async () => {
      if (authInitialized) return; // Prevent duplicate initialization
      
      try {
        // First set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            // Check if still mounted before updating state
            if (!isMountedRef.current) return;
            
            console.log("Auth state change:", event);
            authStateChangeCount.current += 1;
            
            // Prevent too many auth state changes (potential loop detection)
            if (authStateChangeCount.current > 10) {
              console.warn("Detected high frequency of auth state changes - possible loop");
              // Continue processing but log a warning
            }
            
            if (event === 'SIGNED_OUT') {
              setIsAuthenticated(false);
              setUser(null);
              setProfile(null);
              setLoading(false);
              return;
            }
            
            if (session) {
              setUser(session.user);
              setIsAuthenticated(true);
              setLoading(false);
              
              // Fetch user profile but use setTimeout to avoid Supabase conflicts
              if (event === 'SIGNED_IN') {
                // Defer profile loading to prevent auth deadlocks
                setTimeout(async () => {
                  if (!isMountedRef.current) return;
                  await loadProfileData(session.user.id);
                }, 500);
              }
            }
          }
        );
        
        // Now that the listener is set up, check for existing session
        await loadSession();
        
        if (isMountedRef.current) {
          setAuthInitialized(true);
        }
        
        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      } catch (setupError) {
        console.error("Error in auth setup:", setupError);
        if (isMountedRef.current) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    };
    
    setupAuth();
    
    // Reset the auth state change counter periodically to prevent false positives
    const resetCounter = setInterval(() => {
      authStateChangeCount.current = 0;
    }, 60000); // Reset every minute
    
    // Cleanup function to update the mounted ref
    return () => {
      isMountedRef.current = false;
      clearInterval(resetCounter);
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
      
      // Only update state if still mounted
      if (!isMountedRef.current) return;
      
      if (result.profile) {
        setProfile(result.profile);
        toast.success("Profile refreshed successfully");
      } else {
        // Try the new recovery mechanism
        const recovered = await recoverUserData();
        if (!recovered) {
          toast.error("Could not refresh profile");
          console.error("Force refresh failed and recovery failed:", result.error);
        }
      }
    } catch (error) {
      console.error("Error in force profile refresh:", error);
      
      // Only show toast if still mounted
      if (isMountedRef.current) {
        toast.error("Error refreshing your profile");
      }
    } finally {
      // Only update loading state if still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };
  
  // Full auth reset - this function completely resets the auth state
  const resetAuthState = async (): Promise<void> => {
    try {
      console.log("Resetting auth state");
      setLoading(true);
      
      // Reset counters and state tracking
      authStateChangeCount.current = 0;
      resetRefreshState();
      
      // Clear cache first
      clearAuthCache();
      
      // Sign out without actually redirecting - local scope only
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      
      // Check for session again after a brief delay
      setTimeout(async () => {
        if (isMountedRef.current) {
          const sessionExists = await loadSession(true);
          
          // If we still have a valid session after reset, use it
          if (sessionExists) {
            console.log("Valid session found after reset");
            // Session loading already updates the auth state
          } else {
            // Explicitly set loading to false if no session found
            setLoading(false);
          }
        }
      }, 1000);
    } catch (error) {
      console.error("Error resetting auth state:", error);
      // Only update loading if still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Reset counters and state tracking to prevent loops
      authStateChangeCount.current = 0;
      resetRefreshState();
      
      // Save state to restore in case of error
      const originalIsAuthenticated = isAuthenticated;
      const originalUser = user;
      const originalProfile = profile;
      
      // Optimistically update UI state first for better UX
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      
      // First clean up local storage to prevent conflicts
      clearAuthCache();
      
      // Disable any background refresh attempts
      resetRefreshAttempts();
      
      // Sign out from Supabase with improved error handling
      try {
        // Try local signout first for better UX
        await supabase.auth.signOut({ scope: 'local' });
        
        // Then attempt a global sign out (less critical if this fails)
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (globalError) {
          console.warn("Global sign out failed (non-critical):", globalError);
          // Continue with the sign out process even if global sign out fails
        }
        
        // Final cleanup of any remnant auth state
        cleanupAuthState();
        console.log("Signed out successfully");
        
        // Delay the redirect to allow state to update
        setTimeout(() => {
          if (isMountedRef.current) {
            window.location.href = '/login';
          }
        }, 300);
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError);
        
        // Only restore state if still mounted
        if (isMountedRef.current) {
          // Restore previous state on error
          setIsAuthenticated(originalIsAuthenticated);
          setUser(originalUser);
          setProfile(originalProfile);
          
          toast.error("Failed to sign out. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error in signOut function:", error);
      
      // Only show toast if still mounted
      if (isMountedRef.current) {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Only update loading state if still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
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
    recoverUserData,
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
