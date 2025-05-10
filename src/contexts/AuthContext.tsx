import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
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
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  authStatus: AuthStatus.PENDING,
  globalLoading: false,
  checkSession: async () => {},
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

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setGlobalLoading(true);
      
      // Fetch initial session
      const initialSession = await getCurrentSession();
      
      // Update session and user state
      setSession(initialSession);
      setUser(initialSession?.user || null);

      // If we have a session, update the user verification status
      if (initialSession?.user) {
        updateUserVerificationStatus(initialSession.user);
      }
      
      // Update the auth state
      setAuthStatus(initialSession ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
      setGlobalLoading(false);
    };
    
    initializeAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        processAuthStateChange(event, session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Process auth state change events
  const processAuthStateChange = (event: AuthChangeEvent, session: Session | null) => {
    setGlobalLoading(true);
    
    console.log("Auth state change:", event, session ? "Session exists" : "No session");
    
    // Update session and user state
    setSession(session);
    setUser(session?.user || null);

    // If we have a session, update the user verification status
    if (session?.user) {
      updateUserVerificationStatus(session.user);
    }
    
    // Update the auth state
    setAuthStatus(session ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
    setGlobalLoading(false);
  };

  // Function to manually check and refresh the session
  const checkSession = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setAuthStatus(currentSession ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error("Error checking session:", error);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  // Provide the auth context value
  const value: AuthContextType = {
    session,
    user,
    authStatus,
    globalLoading,
    checkSession,
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
