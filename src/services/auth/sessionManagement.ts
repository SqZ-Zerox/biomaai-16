
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    return {
      session: data.session,
      error
    };
  } catch (error: any) {
    console.error("Get session error:", error);
    return {
      session: null,
      error
    };
  }
};

/**
 * Handles updating user verification status from URL parameters
 */
export const updateUserVerificationStatus = async () => {
  try {
    // Get the session parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get('token_hash') || params.get('token');
    const type = params.get('type');
    
    console.log("Verification params:", { token_hash, type });
    console.log("All URL parameters:", Object.fromEntries(params.entries()));
    
    if (!token_hash) {
      console.error("No token found in URL");
      return false;
    }
    
    // Accept more verification types for better compatibility
    const validTypes = ['email_confirmation', 'signup', 'recovery', 'email_verification', 'email_change'];
    if (!type || !validTypes.includes(type)) {
      console.error("Invalid verification type:", type);
      return false;
    }
    
    console.log("Verifying token:", token_hash, "type:", type);
    
    // Clean up auth state before verification to prevent conflicts
    cleanupAuthState();
    
    // Verify the email using the token
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email',
    });
    
    if (error) {
      console.error("Email verification error:", error);
      return false;
    }
    
    console.log("Email verified successfully");
    return true;
  } catch (error) {
    console.error("Verification status update error:", error);
    return false;
  }
};

/**
 * Helper function to clean up auth state in local storage
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`Removing sessionStorage key: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
};
