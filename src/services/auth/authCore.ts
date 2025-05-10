
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define the structure for health goals and dietary restrictions
interface SelectOption {
  id: string;
  name: string;
  selected: boolean;
}

// Define the structure for user profile data
export interface UserProfileData {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  healthGoals: SelectOption[];
  dietaryRestrictions: SelectOption[];
}

// Helper function to check if an item is not null and has a 'value' property
function isValidItem<T extends { value: string }>(item: T | null): item is T {
  return item !== null && typeof item === 'object' && 'value' in item;
}

export const processProfileData = (userData: any): UserProfileData => {
  const profileData: UserProfileData = {
    fullName: userData.raw_user_meta_data?.full_name || userData.email,
    email: userData.email,
    avatarUrl: userData.raw_user_meta_data?.avatar_url || null,
    healthGoals: [],
    dietaryRestrictions: [],
  };

  // Process health goals if present and valid
  if (
    userData.raw_user_meta_data?.health_goals &&
    Array.isArray(userData.raw_user_meta_data.health_goals)
  ) {
    const healthGoals = userData.raw_user_meta_data.health_goals
      .filter(isValidItem)
      .map(goalItem => ({
        id: goalItem.value,
        name: goalItem.value,
        selected: true
      }));

    if (healthGoals.length > 0) {
      profileData.healthGoals = healthGoals;
    }
  }

  // Process dietary restrictions if present and valid
  if (
    userData.raw_user_meta_data?.dietary_restrictions &&
    Array.isArray(userData.raw_user_meta_data.dietary_restrictions)
  ) {
    const dietaryRestrictions = userData.raw_user_meta_data.dietary_restrictions
      .filter(isValidItem)
      .map(restrictionItem => ({
        id: restrictionItem.value,
        name: restrictionItem.value,
        selected: true
      }));

    if (dietaryRestrictions.length > 0) {
      profileData.dietaryRestrictions = dietaryRestrictions;
    }
  }

  return profileData;
};

export const extractSupabaseUser = (user: User) => {
  return {
    id: user.id,
    email: user.email!,
    user_metadata: user.user_metadata,
  };
};

// Add the missing authentication functions
export const signUp = async (signupData: any) => {
  try {
    console.log("Raw signup data:", signupData);
    
    // Format health goals correctly - ensure we have an array of objects with 'value' property
    const formattedHealthGoals = signupData.health_goals.map((goal: string) => ({
      value: goal
    }));

    // Format dietary restrictions correctly - ensure we have an array of objects with 'value' property
    const formattedDietaryRestrictions = signupData.dietary_restrictions && signupData.dietary_restrictions.length > 0
      ? signupData.dietary_restrictions.map((restriction: string) => ({
          value: restriction
        })) 
      : [];
    
    console.log("Formatted health goals:", formattedHealthGoals);
    console.log("Formatted dietary restrictions:", formattedDietaryRestrictions);

    // Clean up local storage to prevent conflicts
    cleanupAuthState();
    
    // Attempt to sign out any existing session first
    try {
      await supabase.auth.signOut({ scope: 'global' });
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
        }
      }
    });
    
    console.log("Signup response:", data, error);
    return { data, error };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { data: null, error };
  }
};

export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    // Clean up local storage to prevent conflicts
    cleanupAuthState();
    
    // Attempt to sign out any existing session first
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (signOutError) {
      console.log("Pre-signin signout failed (this is ok):", signOutError);
      // Continue with signin even if sign out fails
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { data: null, error };
  }
};

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
    
    if (type !== 'email_confirmation' && type !== 'signup' && type !== 'recovery' && type !== 'email_verification') {
      console.error("Invalid verification type:", type);
      return false;
    }
    
    console.log("Verifying token:", token_hash, "type:", type);
    
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

// Helper function to clean up auth state in local storage
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
