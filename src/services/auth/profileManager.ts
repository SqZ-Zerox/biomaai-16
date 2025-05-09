
import { supabase } from "@/integrations/supabase/client";
import { SignupData } from "./types";
import { processHealthGoals, processDietaryRestrictions } from "./dataProcessor";

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
