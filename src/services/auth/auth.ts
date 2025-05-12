
import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/error";
import { checkIfEmailExists, clearEmailExistsCache } from "./emailUtils";
import { cleanupAuthState } from "./sessionManagement";
import { refreshSession } from "./refreshManager";
import { 
  getUserProfile,
  forceProfileRefresh,
  updateUserProfile,
  completeUserProfile,
  extractHealthGoals,
  extractDietaryRestrictions,
  updateHealthGoals,
  updateDietaryRestrictions
} from "./profileManager";
import {
  getCurrentSession,
  updateUserVerificationStatus,
  clearAuthCache,
  resetRefreshAttempts
} from "./sessionManagement";

/**
 * Sign up a new user
 */
export const signUp = async (signupData: any) => {
  try {
    console.log("Raw signup data:", signupData);
    
    // Check if email already exists to prevent duplicate registrations
    // Only check if not already checked in the UI (to avoid double checking)
    let emailExists = false;
    if (!signupData._emailChecked) {
      emailExists = await checkIfEmailExists(signupData.email);
    }
    
    if (emailExists) {
      console.error("Email already exists:", signupData.email);
      return {
        data: null,
        error: {
          message: "An account with this email already exists. Please try logging in or use a different email.",
          status: 409
        }
      };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      return {
        data: null,
        error: {
          message: "Please enter a valid email address.",
          status: 400
        }
      };
    }
    
    // Format health goals correctly - ensure we have an array of objects with 'value' property
    const formattedHealthGoals = Array.isArray(signupData.health_goals) && signupData.health_goals.length > 0
      ? signupData.health_goals.map((goal: string) => ({
          value: goal
        }))
      : [];

    // Format dietary restrictions correctly - ensure we have an array of objects with 'value' property
    const formattedDietaryRestrictions = signupData.dietary_restrictions && Array.isArray(signupData.dietary_restrictions) && signupData.dietary_restrictions.length > 0
      ? signupData.dietary_restrictions.map((restriction: string) => ({
          value: restriction
        })) 
      : [];
    
    console.log("Formatted health goals:", formattedHealthGoals);
    console.log("Formatted dietary restrictions:", formattedDietaryRestrictions);

    // Validate that health goals and dietary restrictions are properly formatted before signup
    if (formattedHealthGoals.length === 0 && signupData.health_goals && signupData.health_goals.length > 0) {
      console.error("Failed to format health goals:", signupData.health_goals);
      return {
        data: null,
        error: {
          message: "Failed to process health goals. Please try again.",
          status: 400
        }
      };
    }

    // Clean up local storage but only do it once before signup
    cleanupAuthState();
    
    // Only attempt sign out if the user might be logged in
    // This reduces unnecessary network requests
    let session = null;
    try {
      const { data } = await supabase.auth.getSession();
      session = data.session;
      if (session) {
        await supabase.auth.signOut({ scope: 'global' });
      }
    } catch (signOutError) {
      console.log("Pre-signup signout failed (this is ok):", signOutError);
      // Continue with signup even if sign out fails
    }

    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          first_name: signupData.first_name,
          last_name: signupData.last_name,
          birth_date: signupData.birth_date,
          phone_number: signupData.phone_number,
          gender: signupData.gender,
          height: signupData.height,
          weight: signupData.weight,
          activity_level: signupData.activity_level,
          health_goals: formattedHealthGoals,
          dietary_restrictions: formattedDietaryRestrictions,
          ...signupData.user_metadata
        },
        emailRedirectTo: window.location.origin + "/auth/callback"
      }
    });
    
    // Clear email cache after signup attempt to ensure fresh state
    clearEmailExistsCache();
    
    // Log the complete response for debugging
    console.log("Signup response:", data, error);
    
    // Enhanced error handling
    if (error) {
      console.error("Signup error details:", error);
      
      // Create a more specific error message based on the error code
      let errorMessage = error.message;
      
      if (error.message.includes("already registered") || error.message.includes("already in use")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password is invalid. Please ensure it's at least 6 characters long.";
      }
      
      return { 
        data: null, 
        error: {
          ...error,
          message: errorMessage
        }
      };
    }
    
    // Handle email verification message explicitly
    if (data && !data.session) {
      return {
        data,
        error: null,
        message: "Please check your email for a verification link to complete your registration."
      };
    }
    
    return { data, error };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { data: null, error };
  }
};

/**
 * Resend verification email to unverified user
 */
export const resendVerificationEmail = async (email: string) => {
  try {
    console.log("Resending verification email to:", email);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        data: null,
        error: {
          message: "Please enter a valid email address.",
          status: 400
        }
      };
    }
    
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback"
      }
    });
    
    if (error) {
      console.error("Resend verification error:", error);
      return { 
        data: null, 
        error: {
          message: error.message || "Failed to resend verification email.",
          status: error.status || 500
        }
      };
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return { 
      data: null, 
      error: {
        message: error.message || "An unexpected error occurred.",
        status: 500
      }
    };
  }
};

/**
 * Sign in an existing user
 */
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    // Clean up local storage but only do it once before signin
    cleanupAuthState();
    
    // Only attempt sign out if the user might be logged in
    // This reduces unnecessary network requests
    let session = null;
    try {
      const { data } = await supabase.auth.getSession();
      session = data.session;
      if (session) {
        await supabase.auth.signOut({ scope: 'global' });
      }
    } catch (signOutError) {
      console.log("Pre-signin signout failed (this is ok):", signOutError);
      // Continue with signin even if sign out fails
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Sign in error:", error);
      
      // Provide better error messages based on error types
      let errorMessage = error.message;
      
      if (error.message.includes("Invalid login")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message.includes("not confirmed")) {
        errorMessage = "Your email has not been verified. Please check your inbox for a confirmation email.";
      }
      
      return { 
        data: null, 
        error: {
          ...error,
          message: errorMessage
        }
      };
    }
    
    return { data, error };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { data: null, error };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    // Clean up local storage first
    cleanupAuthState();
    
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    return false;
  }
};

// Re-export the functions from other modules
export {
  // Session Management
  getCurrentSession,
  updateUserVerificationStatus,
  cleanupAuthState,
  clearAuthCache,
  resetRefreshAttempts,
  
  // Profile Management
  getUserProfile,
  forceProfileRefresh,
  updateUserProfile,
  completeUserProfile,
  extractHealthGoals,
  extractDietaryRestrictions,
  updateHealthGoals,
  updateDietaryRestrictions,
  
  // Token refresh management
  refreshSession
};
