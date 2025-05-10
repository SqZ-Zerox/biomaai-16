
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the current session from Supabase
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session;
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
};

/**
 * Update the user's email verification status
 */
export const updateUserVerificationStatus = async () => {
  try {
    const session = await getCurrentSession();
    
    if (!session) {
      return { updated: false, verified: false };
    }
    
    // Check if the user's email has been verified
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      throw error;
    }
    
    const verified = data.session?.user?.email_confirmed_at ? true : false;
    return { updated: true, verified };
  } catch (error) {
    console.error("Error updating verification status:", error);
    return { updated: false, verified: false };
  }
};

/**
 * Clean up auth state in localStorage
 * Only cleans specific Supabase keys to avoid performance issues
 */
export const cleanupAuthState = () => {
  try {
    // Define the keys we want to clean up instead of iterating through all localStorage
    const supabaseKeysToClean = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'sb-refresh-token',
      'sb-access-token'
    ];
    
    // Only remove specific keys instead of iterating through all localStorage
    supabaseKeysToClean.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error cleaning up auth state:", error);
  }
};
