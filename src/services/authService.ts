import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  phone_number: string | null;
  profession: string | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  activity_level: string | null;
  created_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  phone_number: string | null;
  profession?: string;
  gender?: string;
  height?: string;
  weight?: string;
  activity_level?: string;
  health_goals?: string[];
  dietary_restrictions?: string[];
  user_metadata?: any;
}

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  birth_date,
  phone_number,
  profession = null,
  gender = null,
  height = null,
  weight = null,
  activity_level = null,
  health_goals = [],
  dietary_restrictions = [],
  user_metadata = {}
}: SignUpData) {
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
          ? health_goals.map(goal => (typeof goal === 'object' ? goal.value : goal))
          : [],
        dietary_restrictions: Array.isArray(dietary_restrictions) 
          ? dietary_restrictions.map(restriction => (typeof restriction === 'object' ? restriction.value : restriction))
          : [],
        ...user_metadata
      }
    };

    console.log("Signing up with minimal metadata:", formattedMetadata);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: formattedMetadata,
        emailRedirectTo: window.location.origin + '/auth/callback'
      }
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

export async function signIn({ email, password }: { email: string; password: string }) {
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

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error signing out:", error.message);
    return { error };
  }
}

export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error: any) {
    console.error("Error getting session:", error.message);
    return { session: null, error };
  }
}

export async function getUserProfile(): Promise<{ profile: UserProfile | null; error: any }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session error:", sessionError);
      throw sessionError;
    }
    
    if (!session?.user) {
      console.warn("No user logged in");
      return { profile: null, error: new Error("No user logged in") };
    }

    console.log("Fetching profile for user:", session.user.id);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.error("Profile not found for user:", session.user.id);
      } else {
        console.error("Error fetching profile:", error);
      }
      throw error;
    }
    
    console.log("Profile retrieved:", data);
    return { profile: data as UserProfile, error: null };
  } catch (error: any) {
    console.error("Error in getUserProfile:", error.message);
    return { profile: null, error };
  }
}

// New function to create user profile if it doesn't exist
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
    
    // Extract health goals and dietary restrictions from registration data
    const healthGoals = registrationData.health_goals || [];
    const dietaryRestrictions = registrationData.dietary_restrictions || [];
    
    // Insert health goals if provided
    if (Array.isArray(healthGoals) && healthGoals.length > 0) {
      const formattedGoals = healthGoals.map(goal => ({
        user_id: userId,
        goal: typeof goal === 'object' ? (goal?.value || '') : (goal || '')  // Add null check and default empty string
      }));
      
      const { error: goalsError } = await supabase
        .from('user_health_goals')
        .insert(formattedGoals);
      
      if (goalsError) {
        console.error("Error inserting health goals:", goalsError);
      }
    }
    
    // Insert dietary restrictions if provided
    if (Array.isArray(dietaryRestrictions) && dietaryRestrictions.length > 0) {
      const formattedRestrictions = dietaryRestrictions.map(restriction => ({
        user_id: userId,
        restriction: typeof restriction === 'object' ? (restriction?.value || '') : (restriction || '') // Add null check and default empty string
      }));
      
      const { error: restrictionsError } = await supabase
        .from('user_dietary_restrictions')
        .insert(formattedRestrictions);
      
      if (restrictionsError) {
        console.error("Error inserting dietary restrictions:", restrictionsError);
      }
    }
    
    console.log("Profile created successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    return false;
  }
}

// New function to update user metadata after verification
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
