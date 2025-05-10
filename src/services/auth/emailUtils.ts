
import { supabase } from "@/integrations/supabase/client";

/**
 * Validates an email format using regex
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if an email already exists in the Supabase auth system
 * Uses a temporary signup approach for reliable checking
 */
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Validate email format first
    if (!validateEmailFormat(email)) {
      console.log("Invalid email format:", email);
      return false;
    }
    
    // Try to request password reset for this email
    // If it succeeds, the email exists
    // If it fails with a specific error message, the email doesn't exist
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    
    if (error) {
      console.log("Email check error:", error);
      
      // These specific error messages indicate the email doesn't exist
      if (error.message.includes("user not found") || 
          error.message.includes("not found") ||
          error.message.includes("doesn't exist")) {
        return false;
      }
      
      // For other errors, be conservative and assume it might exist
      // to prevent duplicate registrations
      return true;
    }
    
    // If no error, email exists
    return true;
  } catch (error) {
    console.error("Unexpected error checking if email exists:", error);
    // On unexpected errors, assume email doesn't exist to allow registration attempt
    return false;
  }
};
