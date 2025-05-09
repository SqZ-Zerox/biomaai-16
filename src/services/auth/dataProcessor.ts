
import { supabase } from "@/integrations/supabase/client";

// Helper function to process health goals
export async function processHealthGoals(userId: string, healthGoals: any[]): Promise<void> {
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
export async function processDietaryRestrictions(userId: string, dietaryRestrictions: any[]): Promise<void> {
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
