
import { supabase } from "@/integrations/supabase/client";

// Helper function to process health goals
export async function processHealthGoals(userId: string, healthGoals: any[]): Promise<void> {
  if (healthGoals && healthGoals.length > 0) {
    // First filter out null/undefined values
    const validGoals = healthGoals.filter(goal => goal !== null && goal !== undefined);
    
    const formattedGoals = validGoals.map(goal => {
      // Process goal object or primitive
      return {
        user_id: userId,
        goal: typeof goal === 'object' && goal !== null && 'value' in goal ? 
              String(goal.value || '') : 
              String(goal || '')
      };
    });
    
    if (formattedGoals.length > 0) {
      const { error } = await supabase
        .from('user_health_goals')
        .insert(formattedGoals);
      
      if (error) {
        console.error("Error inserting health goals:", error);
      }
    }
  }
}

// Helper function to process dietary restrictions
export async function processDietaryRestrictions(userId: string, dietaryRestrictions: any[]): Promise<void> {
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    // First filter out null/undefined values
    const validRestrictions = dietaryRestrictions.filter(
      restriction => restriction !== null && restriction !== undefined
    );
    
    const formattedRestrictions = validRestrictions.map(restriction => {
      // Process restriction object or primitive
      return {
        user_id: userId,
        restriction: typeof restriction === 'object' && restriction !== null && 'value' in restriction ? 
                    String(restriction.value || '') : 
                    String(restriction || '')
      };
    });
    
    if (formattedRestrictions.length > 0) {
      const { error } = await supabase
        .from('user_dietary_restrictions')
        .insert(formattedRestrictions);
      
      if (error) {
        console.error("Error inserting dietary restrictions:", error);
      }
    }
  }
}
