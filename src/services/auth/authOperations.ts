import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AuthResult, SessionResult, SignupData } from "./types";

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  birth_date,
  phone_number,
  gender = null,
  height = null,
  weight = null,
  activity_level = null,
  profession = null,
  health_goals = [],
  dietary_restrictions = [],
  user_metadata = {
    existing_conditions: [],
    allergies: '',
    medications: '',
    family_history: [],
    recent_lab_work: ''
  }
}: SignupData): Promise<AuthResult> {
  try {
    // Format user metadata for Supabase - but only include basic identification info
    // We'll save the full profile only after verification
    const formattedMetadata = {
      first_name,
      last_name,
      email_verified: false, // Add a flag to track verification status
      // Store all other data as temporary registration data
      registration_data: {
        birth_date,
        phone_number,
        profession,
        gender,
        height,
        weight,
        activity_level,
        health_goals: Array.isArray(health_goals) 
          ? health_goals.map(goalItem => {
              // Return empty string if goalItem is null/undefined
              if (goalItem === null || goalItem === undefined) {
                return '';
              }
              
              // Type guard for objects with value property
              const isObjectWithValue = typeof goalItem === 'object' && goalItem !== null && 'value' in goalItem;
              
              if (isObjectWithValue) {
                // Type assertion after verification
                const goal = goalItem as { value: any };
                const value = goal.value;
                return value !== null && value !== undefined ? String(value) : '';
              }
              
              // Handle primitive values - already checked for null/undefined above
              return String(goalItem);
            })
          : [],
        dietary_restrictions: Array.isArray(dietary_restrictions) 
          ? dietary_restrictions.map(restrictionItem => {
              // Return empty string if restrictionItem is null/undefined
              if (restrictionItem === null || restrictionItem === undefined) {
                return '';
              }
              
              // Type guard for objects with value property
              const isObjectWithValue = typeof restrictionItem === 'object' && restrictionItem !== null && 'value' in restrictionItem;
              
              if (isObjectWithValue) {
                // Type assertion after verification
                const restriction = restrictionItem as { value: any };
                const value = restriction.value;
                return value !== null && value !== undefined ? String(value) : '';
              }
              
              // Handle primitive values - already checked for null/undefined above
              return String(restrictionItem);
            })
          : [],
        ...user_metadata
      }
    };

    console.log("Signing up with minimal metadata:", formattedMetadata);
    
    const options = {
      data: formattedMetadata,
      emailRedirectTo: window.location.origin + '/auth/callback'
    };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });

    if (error) {
      console.error("Supabase signup error:", error);
      throw error;
    }
    
    console.log("Signup response:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to create account. Please try again.";
    
    if (error.message) {
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please login or use a different email.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password error: " + error.message;
      } else if (error.message.includes("email")) {
        errorMessage = "Email error: " + error.message;
      }
    }
    
    toast({
      title: "Signup Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { data: null, error: { ...error, message: errorMessage } };
  }
}

export async function signIn({ 
  email, 
  password
}: { 
  email: string; 
  password: string; 
  captchaToken?: string | null;
}): Promise<AuthResult> {
  try {
    console.log("Attempting signin with email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Signin error:", error);
      throw error;
    }
    
    console.log("Signin successful:", data.session?.user?.id);
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing in:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to sign in. Please try again.";
    
    if (error.message) {
      if (error.message.includes("Invalid login")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email before logging in.";
      }
    }
    
    toast({
      title: "Login Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { data: null, error: { ...error, message: errorMessage } };
  }
}

export async function signOut(): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error signing out:", error.message);
    return { error };
  }
}

export async function getCurrentSession(): Promise<SessionResult> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error: any) {
    console.error("Error getting session:", error.message);
    return { session: null, error };
  }
}

export async function updateUserVerificationStatus(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.warn("No active session to update verification status");
      return false;
    }
    
    // Mark the user as email verified
    const { error } = await supabase.auth.updateUser({
      data: { 
        email_verified: true 
      }
    });
    
    if (error) {
      console.error("Error updating user verification status:", error);
      return false;
    }
    
    console.log("User verification status updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateUserVerificationStatus:", error);
    return false;
  }
}

// Re-export ensureUserProfile function here and remove it from profileService.ts
export async function ensureUserProfile(userId: string, userData: any): Promise<boolean> {
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking profile:", checkError);
      return false;
    }
    
    // If profile exists, we're done
    if (existingProfile) {
      console.log("Profile already exists for user:", userId);
      return true;
    }
    
    // Check if user has been email verified
    // Only create profile if verified or if we're in a local development environment
    const isVerified = userData.email_verified === true || 
                       window.location.hostname === "localhost";
    
    if (!isVerified) {
      console.log("User not verified yet, skipping profile creation");
      return false;
    }
    
    // Get registration data from user metadata
    const registrationData = userData.registration_data || {};
    
    // If profile doesn't exist AND user is verified, create it
    console.log("Creating verified profile for user:", userId);
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        first_name: userData.first_name || registrationData.first_name || null,
        last_name: userData.last_name || registrationData.last_name || null,
        birth_date: registrationData.birth_date || null,
        phone_number: registrationData.phone_number || null,
        profession: registrationData.profession || null,
        gender: registrationData.gender || null,
        height: registrationData.height || null,
        weight: registrationData.weight || null,
        activity_level: registrationData.activity_level || null
      }]);
    
    if (insertError) {
      console.error("Error creating profile:", insertError);
      return false;
    }
    
    // Process health goals and dietary restrictions
    if (registrationData.health_goals && Array.isArray(registrationData.health_goals)) {
      await processHealthGoals(userId, registrationData.health_goals);
    }
    
    if (registrationData.dietary_restrictions && Array.isArray(registrationData.dietary_restrictions)) {
      await processDietaryRestrictions(userId, registrationData.dietary_restrictions);
    }
    
    console.log("Profile created successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    return false;
  }
}

// Helper function to process health goals
async function processHealthGoals(userId: string, healthGoals: any[]): Promise<void> {
  if (healthGoals.length > 0) {
    const formattedGoals = healthGoals.map(goal => {
      // Ensure goal is not null/undefined
      if (goal === null || goal === undefined) return { user_id: userId, goal: '' };
      
      // Process goal object or primitive
      return {
        user_id: userId,
        goal: typeof goal === 'object' && goal !== null && 'value' in goal ? 
              String(goal.value || '') : 
              String(goal || '')
      };
    });
    
    const { error } = await supabase
      .from('user_health_goals')
      .insert(formattedGoals);
    
    if (error) {
      console.error("Error inserting health goals:", error);
    }
  }
}

// Helper function to process dietary restrictions
async function processDietaryRestrictions(userId: string, dietaryRestrictions: any[]): Promise<void> {
  if (dietaryRestrictions.length > 0) {
    const formattedRestrictions = dietaryRestrictions.map(restriction => {
      // Ensure restriction is not null/undefined
      if (restriction === null || restriction === undefined) return { user_id: userId, restriction: '' };
      
      // Process restriction object or primitive
      return {
        user_id: userId,
        restriction: typeof restriction === 'object' && restriction !== null && 'value' in restriction ? 
                    String(restriction.value || '') : 
                    String(restriction || '')
      };
    });
    
    const { error } = await supabase
      .from('user_dietary_restrictions')
      .insert(formattedRestrictions);
    
    if (error) {
      console.error("Error inserting dietary restrictions:", error);
    }
  }
}

// Handle social auth profile completion
export async function completeUserProfile(userData: Partial<SignupData>): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.warn("No active session to update profile");
      return false;
    }
    
    // Update the user's metadata
    const { error } = await supabase.auth.updateUser({
      data: { 
        first_name: userData.first_name,
        last_name: userData.last_name,
        email_verified: true,
        registration_data: {
          birth_date: userData.birth_date,
          phone_number: userData.phone_number,
          profession: userData.profession,
          gender: userData.gender,
          height: userData.height,
          weight: userData.weight,
          activity_level: userData.activity_level,
          health_goals: userData.health_goals,
          dietary_restrictions: userData.dietary_restrictions,
          ...userData.user_metadata
        }
      }
    });
    
    if (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
    
    // Ensure user profile exists in the profiles table
    await ensureUserProfile(session.user.id, {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email_verified: true,
      registration_data: {
        birth_date: userData.birth_date,
        phone_number: userData.phone_number,
        profession: userData.profession,
        gender: userData.gender,
        height: userData.height,
        weight: userData.weight,
        activity_level: userData.activity_level,
        health_goals: userData.health_goals,
        dietary_restrictions: userData.dietary_restrictions,
        ...userData.user_metadata
      }
    });
    
    console.log("User profile completed successfully");
    return true;
  } catch (error) {
    console.error("Error in completeUserProfile:", error);
    return false;
  }
}
