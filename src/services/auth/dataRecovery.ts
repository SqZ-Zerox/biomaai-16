
import { supabase } from "@/integrations/supabase/client";
import { processHealthGoals, processDietaryRestrictions } from "./dataProcessor";
import { toast } from "sonner";

/**
 * Attempts to recover and fix user profile data
 * This function will check if a user has a complete profile and try to fix it if not
 */
export const attemptUserDataRecovery = async (userId: string): Promise<boolean> => {
  try {
    console.log("Attempting data recovery for user:", userId);
    
    // First, get the user's metadata directly from auth.users
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.error("Failed to get user data for recovery:", userError);
      return false;
    }
    
    // Check if the user already has a profile
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // Extract metadata from user
    const metadata = userData.user.user_metadata;
    console.log("User metadata for recovery:", metadata);
    
    // Prepare recovery data with fallbacks
    const recoveryData = {
      id: userId,
      first_name: metadata.first_name || metadata.name || null,
      last_name: metadata.last_name || null,
      birth_date: metadata.birth_date || null,
      phone_number: metadata.phone_number || null,
      profession: metadata.profession || null,
      gender: metadata.gender || null,
      height: metadata.height || null,
      weight: metadata.weight || null,
      activity_level: metadata.activity_level || null
    };
    
    // If no profile exists, create one
    if (profileError && profileError.code === 'PGRST116') { // Not found
      console.log("No profile found, creating new one with recovery data");
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([recoveryData]);
      
      if (insertError) {
        console.error("Error creating profile during recovery:", insertError);
        return false;
      }
    } 
    // If profile exists but has null values, update them
    else if (existingProfile) {
      console.log("Existing profile found, updating missing fields");
      
      // Only update fields that are currently null in the profile
      const updateData: any = {};
      for (const [key, value] of Object.entries(recoveryData)) {
        if (key !== 'id' && existingProfile[key] === null && value !== null) {
          updateData[key] = value;
        }
      }
      
      // Only update if we have fields to update
      if (Object.keys(updateData).length > 0) {
        console.log("Updating profile with recovery data:", updateData);
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);
        
        if (updateError) {
          console.error("Error updating profile during recovery:", updateError);
        }
      }
    }
    
    // Process health goals and dietary restrictions if available in any format
    await recoverUserPreferences(userId, metadata);
    
    return true;
  } catch (error) {
    console.error("Error in attemptUserDataRecovery:", error);
    return false;
  }
};

/**
 * Try to recover user preferences (health goals and dietary restrictions)
 */
const recoverUserPreferences = async (userId: string, metadata: any): Promise<void> => {
  try {
    console.log("Recovering user preferences");
    
    // Process health goals with multiple possible formats
    const healthGoalsData = extractPreferenceData(metadata, ['health_goals', 'healthGoals', 'goals']);
    if (healthGoalsData.length > 0) {
      console.log("Found health goals to recover:", healthGoalsData);
      await processHealthGoals(userId, healthGoalsData);
    }
    
    // Process dietary restrictions with multiple possible formats
    const dietaryRestrictionsData = extractPreferenceData(metadata, ['dietary_restrictions', 'dietaryRestrictions', 'restrictions']);
    if (dietaryRestrictionsData.length > 0) {
      console.log("Found dietary restrictions to recover:", dietaryRestrictionsData);
      await processDietaryRestrictions(userId, dietaryRestrictionsData);
    }
  } catch (error) {
    console.error("Error recovering user preferences:", error);
  }
};

/**
 * Helper function to extract preference data from metadata with multiple possible keys
 */
const extractPreferenceData = (metadata: any, possibleKeys: string[]): any[] => {
  for (const key of possibleKeys) {
    const data = metadata[key];
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
  }
  return [];
};
