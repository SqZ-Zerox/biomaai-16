
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
