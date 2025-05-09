
import { supabase } from "@/integrations/supabase/client";

// Helper function to process health goals
export async function processHealthGoals(userId: string, healthGoals: any[]): Promise<void> {
  // Return early if healthGoals is not an array or is empty
  if (!Array.isArray(healthGoals) || healthGoals.length === 0) {
    return;
  }
  
  // Filter out null/undefined values
  const validGoals = healthGoals.filter(Boolean);
  
  if (validGoals.length === 0) {
    return;
  }
  
  const formattedGoals = validGoals.map(goal => {
    // Process goal object or primitive
    return {
      user_id: userId,
      goal: typeof goal === 'object' && goal !== null && 'value' in goal 
        ? String(goal.value || '') 
        : String(goal || '')
    };
  });
  
  const { error } = await supabase
    .from('user_health_goals')
    .insert(formattedGoals);
  
  if (error) {
    console.error("Error inserting health goals:", error);
  }
}

// Helper function to process dietary restrictions
export async function processDietaryRestrictions(userId: string, dietaryRestrictions: any[]): Promise<void> {
  // Return early if dietaryRestrictions is not an array or is empty
  if (!Array.isArray(dietaryRestrictions) || dietaryRestrictions.length === 0) {
    return;
  }
  
  // Filter out null/undefined values
  const validRestrictions = dietaryRestrictions.filter(Boolean);
  
  if (validRestrictions.length === 0) {
    return;
  }
  
  const formattedRestrictions = validRestrictions.map(restriction => {
    // Process restriction object or primitive
    return {
      user_id: userId,
      restriction: typeof restriction === 'object' && restriction !== null && 'value' in restriction 
        ? String(restriction.value || '') 
        : String(restriction || '')
    };
  });
  
  const { error } = await supabase
    .from('user_dietary_restrictions')
    .insert(formattedRestrictions);
  
  if (error) {
    console.error("Error inserting dietary restrictions:", error);
  }
}
