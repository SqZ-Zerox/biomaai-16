
import { supabase } from "@/integrations/supabase/client";
import { SignupData } from "./types";
import { processHealthGoals, processDietaryRestrictions } from "./dataProcessor";
import { ProfileResult, UserProfile } from "./types";
import { AppError } from "@/lib/error";

// Ensure user profile exists in the database
export async function ensureUserProfile(userId: string, userData: any): Promise<boolean> {
  try {
    console.log("Ensuring profile exists for user:", userId);
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (checkError) {
      if (checkError.code !== 'PGRST116') { // Not found error is expected
        console.error("Error checking profile:", checkError);
        return false;
      } else {
        console.log("Profile not found, will create new one");
      }
    }
    
    // If profile exists, we're done
    if (existingProfile) {
      console.log("Profile already exists for user:", userId);
      return true;
    }
    
    // Get registration data from user metadata
    const registrationData = userData.registration_data || {};
    
    // Create profile regardless of verification status - will rely on RLS
    console.log("Creating profile for user:", userId);
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
};

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
    console.log("Starting getUserProfile");
    
    // First check if we're logged in
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
    
    // Add retry logic for fetching the profile
    let retries = 0;
    const maxRetries = 2;
    let data = null;
    let error = null;
    
    while (retries <= maxRetries && !data) {
      try {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        data = result.data;
        error = result.error;
        
        if (error) {
          if (error.code === 'PGRST116') {
            console.warn(`Profile not found for user (retry ${retries}):`, session.user.id);
            // If profile not found, try to create it
            const created = await ensureUserProfile(session.user.id, session.user.user_metadata);
            if (created) {
              console.log("Profile created successfully on retry");
              // If profile was created, try fetching again after a small delay
              await new Promise(resolve => setTimeout(resolve, 500));
              continue; // Skip incrementing retries since we just created the profile
            }
          } else {
            console.error(`Error fetching profile (retry ${retries}):`, error);
          }
          retries++;
          
          // Wait before retry
          if (retries <= maxRetries) {
            console.log(`Waiting before retry ${retries}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          }
        } else if (data) {
          // Success!
          console.log("Profile data retrieved:", data);
          break;
        }
      } catch (fetchError) {
        console.error(`Exception during fetch (retry ${retries}):`, fetchError);
        error = fetchError;
        retries++;
        
        if (retries <= maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }
    
    // Final check - if still no profile and all retries exhausted
    if (!data && retries > maxRetries) {
      console.error("All retries exhausted, unable to fetch profile");
      // Try one last attempt to create the profile
      const created = await ensureUserProfile(session.user.id, session.user.user_metadata);
      if (!created) {
        throw new AppError("Could not fetch or create user profile after multiple attempts", 404);
      } else {
        // Fetch the newly created profile
        const { data: freshData, error: freshError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (freshError || !freshData) {
          console.error("Error fetching newly created profile:", freshError);
          throw new AppError("Created profile but failed to retrieve it", 404);
        }
        
        data = freshData;
      }
    }
    
    // Get user email from auth session
    const userEmail = session.user.email || '';
    
    // Combine profile data with email from session to create complete UserProfile
    const userProfile: UserProfile = {
      ...(data as any),
      email: userEmail
    };
    
    console.log("Profile successfully retrieved:", userProfile);
    return { profile: userProfile, error: null };
  } catch (error: any) {
    console.error("Error in getUserProfile:", error.message);
    return { profile: null, error };
  }
}

// Update user profile
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<ProfileResult> {
  try {
    console.log("Starting updateUserProfile with data:", profile);
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

// Force refresh of profile
export async function forceProfileRefresh(): Promise<ProfileResult> {
  try {
    // Clear any cached session data
    localStorage.removeItem('bioma_auth_session_cache');
    console.log("Forcing profile refresh with cleared cache");
    
    // Force a new session fetch
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.warn("No valid session found during force refresh");
      return { profile: null, error: new Error("No valid session") };
    }
    
    // Try to explicitly create the profile if it doesn't exist
    await ensureUserProfile(session.user.id, session.user.user_metadata);
    
    // Now fetch the profile
    return await getUserProfile();
  } catch (error: any) {
    console.error("Error in forceProfileRefresh:", error);
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

// New functions to update health goals and dietary restrictions
export async function updateHealthGoals(goals: string[]): Promise<{success: boolean, error: Error | null}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { success: false, error: new Error("No user logged in") };
    }
    
    const userId = session.user.id;
    
    // First delete existing goals
    const { error: deleteError } = await supabase
      .from('user_health_goals')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error("Error deleting existing health goals:", deleteError);
      return { success: false, error: deleteError };
    }
    
    // Insert new goals if any
    if (goals.length > 0) {
      const goalsToInsert = goals.map(goal => ({
        user_id: userId,
        goal
      }));
      
      const { error: insertError } = await supabase
        .from('user_health_goals')
        .insert(goalsToInsert);
      
      if (insertError) {
        console.error("Error inserting new health goals:", insertError);
        return { success: false, error: insertError };
      }
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in updateHealthGoals:", error);
    return { success: false, error };
  }
}

export async function updateDietaryRestrictions(restrictions: string[]): Promise<{success: boolean, error: Error | null}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { success: false, error: new Error("No user logged in") };
    }
    
    const userId = session.user.id;
    
    // First delete existing restrictions
    const { error: deleteError } = await supabase
      .from('user_dietary_restrictions')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error("Error deleting existing dietary restrictions:", deleteError);
      return { success: false, error: deleteError };
    }
    
    // Insert new restrictions if any
    if (restrictions.length > 0) {
      const restrictionsToInsert = restrictions.map(restriction => ({
        user_id: userId,
        restriction
      }));
      
      const { error: insertError } = await supabase
        .from('user_dietary_restrictions')
        .insert(restrictionsToInsert);
      
      if (insertError) {
        console.error("Error inserting new dietary restrictions:", insertError);
        return { success: false, error: insertError };
      }
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in updateDietaryRestrictions:", error);
    return { success: false, error };
  }
}
