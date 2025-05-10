
import { supabase } from "@/integrations/supabase/client";

export const processHealthGoals = async (userId: string, healthGoals: any[]) => {
  try {
    console.log("Processing health goals for user:", userId, healthGoals);
    
    // Early return if there are no health goals
    if (!healthGoals || healthGoals.length === 0) {
      console.log("No health goals to process");
      return false;
    }
    
    // Make sure we have valid health goal data
    const validGoals = healthGoals
      .filter(goal => {
        // Handle both string values and objects with 'value' property
        const isValid = typeof goal === 'string' || 
                       (typeof goal === 'object' && goal !== null && 'value' in goal);
        
        if (!isValid) {
          console.warn("Invalid health goal format:", goal);
        }
        return isValid;
      })
      .map(goal => {
        // Extract the goal value
        const goalValue = typeof goal === 'string' ? goal : goal.value;
        
        return {
          user_id: userId,
          goal: goalValue
        };
      });
    
    console.log("Formatted goals:", validGoals);
    
    if (validGoals.length === 0) {
      console.warn("No valid health goals to insert");
      return false;
    }
    
    // Delete any existing health goals for this user to prevent duplicates
    await supabase
      .from('user_health_goals')
      .delete()
      .eq('user_id', userId);
    
    // Insert the health goals
    const { error } = await supabase
      .from('user_health_goals')
      .insert(validGoals);
    
    if (error) {
      console.error("Error adding health goals:", error);
      return false;
    }
    
    console.log("Health goals processed successfully");
    return true;
  } catch (error) {
    console.error("Error in processHealthGoals:", error);
    return false;
  }
};

export const processDietaryRestrictions = async (userId: string, dietaryRestrictions: any[]) => {
  try {
    console.log("Processing dietary restrictions for user:", userId, dietaryRestrictions);
    
    // Early return if there are no dietary restrictions
    if (!dietaryRestrictions || dietaryRestrictions.length === 0) {
      console.log("No dietary restrictions to process");
      return true; // Return true as this is not an error condition
    }
    
    // Make sure we have valid dietary restriction data
    const validRestrictions = dietaryRestrictions
      .filter(restriction => {
        // Handle both string values and objects with 'value' property
        const isValid = typeof restriction === 'string' || 
                       (typeof restriction === 'object' && restriction !== null && 'value' in restriction);
        
        if (!isValid) {
          console.warn("Invalid dietary restriction format:", restriction);
        }
        return isValid;
      })
      .map(restriction => {
        // Extract the restriction value
        const restrictionValue = typeof restriction === 'string' ? restriction : restriction.value;
        
        return {
          user_id: userId,
          restriction: restrictionValue
        };
      });
    
    console.log("Formatted restrictions:", validRestrictions);
    
    if (validRestrictions.length === 0) {
      console.log("No valid dietary restrictions to insert");
      return true; // Return true as this is not an error condition
    }
    
    // Delete any existing dietary restrictions for this user to prevent duplicates
    await supabase
      .from('user_dietary_restrictions')
      .delete()
      .eq('user_id', userId);
    
    // Insert the dietary restrictions
    const { error } = await supabase
      .from('user_dietary_restrictions')
      .insert(validRestrictions);
    
    if (error) {
      console.error("Error adding dietary restrictions:", error);
      return false;
    }
    
    console.log("Dietary restrictions processed successfully");
    return true;
  } catch (error) {
    console.error("Error in processDietaryRestrictions:", error);
    return false;
  }
};
