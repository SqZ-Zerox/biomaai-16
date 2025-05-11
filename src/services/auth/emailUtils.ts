
import { supabase } from "@/integrations/supabase/client";

// Cache to store email check results
const emailExistsCache = new Map<string, boolean>();

/**
 * Validates an email format using regex
 * This is a more thorough email validation than before
 */
export const validateEmailFormat = (email: string): boolean => {
  // More comprehensive email regex that checks for:
  // 1. Local part (before @) has valid characters
  // 2. Domain part has valid characters
  // 3. TLD is at least 2 characters
  // 4. No consecutive dots
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!email || !emailRegex.test(email)) {
    return false;
  }
  
  // Additional validation: domain must have at least one dot and TLD must be at least 2 chars
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const domain = parts[1];
  if (domain.indexOf('.') === -1) return false;
  
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;
  
  return true;
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
    
    // Extract domain for basic validation
    const domain = email.split('@')[1];
    if (!domain || domain.indexOf('.') === -1) {
      console.log("Invalid domain format:", email);
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
