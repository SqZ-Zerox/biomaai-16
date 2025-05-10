import { supabase } from "@/integrations/supabase/client";
import { SignupData } from "./types";
import { processHealthGoals, processDietaryRestrictions } from "./dataProcessor";
import { ProfileResult, UserProfile } from "./types";

// Ensure user profile exists in the database
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

// Get user profile - moved from profileService.ts
export async function getUserProfile(): Promise<ProfileResult> {
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
    
    // Get user email from auth session
    const userEmail = session.user.email || '';
    
    // Combine profile data with email from session to create complete UserProfile
    const userProfile: UserProfile = {
      ...data,
      email: userEmail
    };
    
    console.log("Profile retrieved:", userProfile);
    return { profile: userProfile, error: null };
  } catch (error: any) {
    console.error("Error in getUserProfile:", error.message);
    return { profile: null, error };
  }
}

// Update user profile
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<ProfileResult> {
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

    // Remove email from the update payload as it's not a column in the profiles table
    const { email, ...profileWithoutEmail } = profile;
    
    // Update the profile in the database
    const { data, error } = await supabase
      .from('profiles')
      .update(profileWithoutEmail)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    
    // Return updated profile with email from session
    const updatedProfile: UserProfile = {
      ...data,
      email: session.user.email || ''
    };
    
    console.log("Profile updated:", updatedProfile);
    return { profile: updatedProfile, error: null };
  } catch (error: any) {
    console.error("Error in updateUserProfile:", error.message);
    return { profile: null, error };
  }
}

// Extract health goals and dietary restrictions functions for clarity
export async function extractHealthGoals(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_health_goals')
      .select('goal')
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error fetching health goals:", error);
      return [];
    }
    
    return data.map(item => item.goal);
  } catch (error) {
    console.error("Error in extractHealthGoals:", error);
    return [];
  }
}

export async function extractDietaryRestrictions(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_dietary_restrictions')
      .select('restriction')
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error fetching dietary restrictions:", error);
      return [];
    }
    
    return data.map(item => item.restriction);
  } catch (error) {
    console.error("Error in extractDietaryRestrictions:", error);
    return [];
  }
}
