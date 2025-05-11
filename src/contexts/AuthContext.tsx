
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  getCurrentSession,
  updateUserVerificationStatus,
} from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";

// Define the authentication status enum
export enum AuthStatus {
  PENDING = "pending",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

// Define the AuthContext type
interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  authStatus: AuthStatus;
  globalLoading: boolean;
  checkSession: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: any | null;
  isEmailVerified: boolean;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  authStatus: AuthStatus.PENDING,
  globalLoading: false,
  checkSession: async () => {},
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  isEmailVerified: false,
});

// AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.PENDING);
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Use refs to track state between renders and debounce operations
  const checkSessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckSessionTime = useRef<number>(0);
  const sessionCheckInProgress = useRef<boolean>(false);
  const authStateChangeCount = useRef<number>(0);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setGlobalLoading(true);
      
      // Fetch initial session
      const initialSession = await getCurrentSession();
      
      // Update session and user state
      setSession(initialSession);
      setUser(initialSession?.user || null);
      
      // Check if email is verified
      if (initialSession?.user) {
        setIsEmailVerified(initialSession.user.email_confirmed_at !== null);
        
        // Don't call updateUserVerificationStatus here as it will be done by the auth state change listener
      }
      
      // Update the auth state
      setAuthStatus(initialSession ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
      setGlobalLoading(false);
    };
    
    initializeAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Use setTimeout to prevent supabase auth deadlocks
        setTimeout(() => {
          processAuthStateChange(event, session);
        }, 0);
      }
    );

    return () => {
      subscription?.unsubscribe();
      
      // Clear any pending timeouts
      if (checkSessionTimeoutRef.current) {
        clearTimeout(checkSessionTimeoutRef.current);
      }
    };
  }, []);

  // Process auth state change events
  const processAuthStateChange = (event: AuthChangeEvent, session: Session | null) => {
    // Don't set loading state for frequent auth events
    const isFrequentEvent = (authStateChangeCount.current++ > 5);
    
    if (!isFrequentEvent) {
      setGlobalLoading(true);
    }
    
    console.log("Auth state change:", event, session ? "Session exists" : "No session");
    
    // Update session and user state
    setSession(session);
    setUser(session?.user || null);
    
    // Update email verification status
    if (session?.user) {
      setIsEmailVerified(session.user.email_confirmed_at !== null);
      
      // Don't update verification status on every auth state change
      // Only do it for specific events
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Debounced verification check
        const now = Date.now();
        if (now - lastCheckSessionTime.current > 30000) { // 30 seconds minimum between checks
          lastCheckSessionTime.current = now;
          updateUserVerificationStatus().catch(console.error);
        }
      }
    } else {
      setIsEmailVerified(false);
    }
    
    // Update the auth state
    setAuthStatus(session ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
    
    if (!isFrequentEvent) {
      setGlobalLoading(false);
    }
  };

  // Function to manually check and refresh the session with debouncing
  const checkSession = useCallback(async () => {
    // Prevent concurrent checks
    if (sessionCheckInProgress.current) {
      console.log("Session check already in progress, skipping");
      return;
    }
    
    // Implement debouncing - only allow one check every 5 seconds
    const now = Date.now();
    if (now - lastCheckSessionTime.current < 5000) { // 5 seconds
      console.log("Session check on cooldown, debouncing...");
      
      // Clear any existing timeout
      if (checkSessionTimeoutRef.current) {
        clearTimeout(checkSessionTimeoutRef.current);
      }
      
      // Set a timeout for the debounced call
      checkSessionTimeoutRef.current = setTimeout(() => {
        checkSession();
      }, 5000);
      
      return;
    }
    
    try {
      sessionCheckInProgress.current = true;
      lastCheckSessionTime.current = now;
      setGlobalLoading(true);
      
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      // Update email verification status
      if (currentSession?.user) {
        setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
      } else {
        setIsEmailVerified(false);
      }
      
      setAuthStatus(currentSession ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error("Error checking session:", error);
      
      // Show a toast for auth errors
      toast({
        title: "Authentication Error",
        description: "There was a problem verifying your session. Please try refreshing the page.",
        variant: "destructive",
      });
      
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    } finally {
      setGlobalLoading(false);
      sessionCheckInProgress.current = false;
    }
  }, [toast]);

  // Compute isAuthenticated and isLoading from authStatus and globalLoading
  const isAuthenticated = authStatus === AuthStatus.AUTHENTICATED;
  const isLoading = globalLoading || authStatus === AuthStatus.PENDING;

  // Provide the auth context value
  const value: AuthContextType = {
    session,
    user,
    authStatus,
    globalLoading,
    checkSession,
    isAuthenticated,
    isLoading,
    profile,
    isEmailVerified,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
