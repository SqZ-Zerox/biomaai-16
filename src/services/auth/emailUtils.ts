
import { supabase } from "@/integrations/supabase/client";

// Cache to store email check results
const emailExistsCache = new Map<string, boolean>();

/**
 * Validates an email format using regex
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if an email already exists in the Supabase auth system
 * Uses caching to avoid redundant API calls
 */
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Check cache first
    if (emailExistsCache.has(email)) {
      return emailExistsCache.get(email) as boolean;
    }
    
    // Validate email format first
    if (!validateEmailFormat(email)) {
      console.log("Invalid email format:", email);
      return false;
    }
    
    // Use signInWithOtp to check if email exists
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // Only check if user exists, don't create
      }
    });
    
    let exists = false;
    
    if (error) {
      // If we get "User not found" error, the email doesn't exist
      if (error.message.includes("user not found") || 
          error.message.includes("not found") ||
          error.message.includes("doesn't exist")) {
        exists = false;
      }
      
      // For other errors, check if it indicates the user exists
      else if (error.message.includes("Email link")) {
        // Getting an email link error means the user exists
        exists = true;
      }
      else {
        console.log("Email check error:", error);
        // Be conservative for other errors - assume it might not exist
        exists = false;
      }
    } else {
      // If no error using shouldCreateUser: false, the user exists
      exists = true;
    }
    
    // Store result in cache
    emailExistsCache.set(email, exists);
    
    return exists;
  } catch (error) {
    console.error("Unexpected error checking if email exists:", error);
    // On unexpected errors, assume email doesn't exist to allow registration attempt
    return false;
  }
};

/**
 * Clears the email exists cache
 */
export const clearEmailExistsCache = () => {
  emailExistsCache.clear();
};
