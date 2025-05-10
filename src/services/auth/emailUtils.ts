
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
 */
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Validate email format first
    if (!validateEmailFormat(email)) {
      console.log("Invalid email format:", email);
      return false;
    }
    
    // Use signInWithOtp to check if email exists
    // This is more reliable than password reset as it doesn't send emails
    // but still lets us know if the account exists
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // Only check if user exists, don't create
      }
    });
    
    if (error) {
      // If we get "User not found" error, the email doesn't exist
      if (error.message.includes("user not found") || 
          error.message.includes("not found") ||
          error.message.includes("doesn't exist")) {
        return false;
      }
      
      // For other errors, check if it indicates the user exists
      if (error.message.includes("Email link")) {
        // Getting an email link error means the user exists
        return true;
      }
      
      console.log("Email check error:", error);
      // Be conservative for other errors - assume it might not exist
      return false;
    }
    
    // If no error using shouldCreateUser: false, the user exists
    return true;
  } catch (error) {
    console.error("Unexpected error checking if email exists:", error);
    // On unexpected errors, assume email doesn't exist to allow registration attempt
    return false;
  }
};
