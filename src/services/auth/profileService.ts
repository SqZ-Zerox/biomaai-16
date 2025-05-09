
import { supabase } from "@/integrations/supabase/client";
import { ProfileResult, UserProfile } from "./types";

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
    
    console.log("Profile retrieved:", data);
    return { profile: data as UserProfile, error: null };
  } catch (error: any) {
    console.error("Error in getUserProfile:", error.message);
    return { profile: null, error };
  }
}

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
      const formattedGoals = healthGoals.map(goal => {
        // Ensure goal is not null/undefined before accessing properties
        if (!goal) return { user_id: userId, goal: '' };
        
        // Safely access properties with proper type checking
        return {
          user_id: userId,
          goal: typeof goal === 'object' && goal !== null && 'value' in goal ? 
                String(goal.value || '') : 
                String(goal || '')
        };
      });
      
      const { error: goalsError } = await supabase
        .from('user_health_goals')
        .insert(formattedGoals);
      
      if (goalsError) {
        console.error("Error inserting health goals:", goalsError);
      }
    }
    
    // Insert dietary restrictions if provided
    if (Array.isArray(dietaryRestrictions) && dietaryRestrictions.length > 0) {
      const formattedRestrictions = dietaryRestrictions.map(restriction => {
        // Ensure restriction is not null/undefined before accessing properties
        if (!restriction) return { user_id: userId, restriction: '' };
        
        // Safely access properties with proper type checking
        return {
          user_id: userId,
          restriction: typeof restriction === 'object' && restriction !== null && 'value' in restriction ? 
                      String(restriction.value || '') : 
                      String(restriction || '')
        };
      });
      
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
