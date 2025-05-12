
import { supabase } from "@/integrations/supabase/client";

/**
 * Process health goals with improved format detection and conversion
 */
export const processHealthGoals = async (userId: string, healthGoals: any[]): Promise<boolean> => {
  try {
    console.log("Processing health goals for user:", userId, healthGoals);
    
    // Early return if there are no health goals
    if (!healthGoals || healthGoals.length === 0) {
      console.log("No health goals to process");
      return false;
    }
    
    // Format health goals correctly for insertion with enhanced format detection
    const validGoals = healthGoals
      .filter(goal => {
        // Handle various possible formats
        const isValid = 
          // String format
          typeof goal === 'string' || 
          // Object with 'value' property
          (typeof goal === 'object' && goal !== null && 'value' in goal) ||
          // Object with 'id' and 'name' properties (UI format)
          (typeof goal === 'object' && goal !== null && 'id' in goal && 'name' in goal) ||
          // Object with 'label' property (alt UI format)
          (typeof goal === 'object' && goal !== null && 'label' in goal);
        
        if (!isValid) {
          console.warn("Invalid health goal format:", goal);
        }
        return isValid;
      })
      .map(goal => {
        // Extract the goal value based on format
        let goalValue;
        
        if (typeof goal === 'string') {
          goalValue = goal;
        } else if ('value' in goal) {
          goalValue = goal.value;
        } else if ('name' in goal) {
          goalValue = goal.name;
        } else if ('label' in goal) {
          goalValue = goal.label;
        } else {
          // Default case for unknown format - use string representation
          goalValue = String(goal);
        }
        
        return {
          user_id: userId,
          goal: goalValue
        };
      });
    
    console.log("Formatted goals for insertion:", validGoals);
    
    if (validGoals.length === 0) {
      console.warn("No valid health goals to insert");
      return false;
    }
    
    // Delete any existing health goals for this user to prevent duplicates
    const { error: deleteError } = await supabase
      .from('user_health_goals')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error("Error deleting existing health goals:", deleteError);
      return false;
    }
    
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

/**
 * Process dietary restrictions with improved format detection and conversion
 */
export const processDietaryRestrictions = async (userId: string, dietaryRestrictions: any[]): Promise<boolean> => {
  try {
    console.log("Processing dietary restrictions for user:", userId, dietaryRestrictions);
    
    // Early return if there are no dietary restrictions
    if (!dietaryRestrictions || dietaryRestrictions.length === 0) {
      console.log("No dietary restrictions to process");
      return true; // Return true as this is not an error condition
    }
    
    // Format dietary restrictions correctly for insertion with enhanced format detection
    const validRestrictions = dietaryRestrictions
      .filter(restriction => {
        // Handle various possible formats
        const isValid = 
          // String format
          typeof restriction === 'string' || 
          // Object with 'value' property
          (typeof restriction === 'object' && restriction !== null && 'value' in restriction) ||
          // Object with 'id' and 'name' properties (UI format)
          (typeof restriction === 'object' && restriction !== null && 'id' in restriction && 'name' in restriction) ||
          // Object with 'label' property (alt UI format)
          (typeof restriction === 'object' && restriction !== null && 'label' in restriction);
        
        if (!isValid) {
          console.warn("Invalid dietary restriction format:", restriction);
        }
        return isValid;
      })
      .map(restriction => {
        // Extract the restriction value based on format
        let restrictionValue;
        
        if (typeof restriction === 'string') {
          restrictionValue = restriction;
        } else if ('value' in restriction) {
          restrictionValue = restriction.value;
        } else if ('name' in restriction) {
          restrictionValue = restriction.name;
        } else if ('label' in restriction) {
          restrictionValue = restriction.label;
        } else {
          // Default case for unknown format - use string representation
          restrictionValue = String(restriction);
        }
        
        return {
          user_id: userId,
          restriction: restrictionValue
        };
      });
    
    console.log("Formatted restrictions for insertion:", validRestrictions);
    
    if (validRestrictions.length === 0) {
      console.log("No valid dietary restrictions to insert");
      return true; // Return true as this is not an error condition
    }
    
    // Delete any existing dietary restrictions for this user to prevent duplicates
    const { error: deleteError } = await supabase
      .from('user_dietary_restrictions')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error("Error deleting existing dietary restrictions:", deleteError);
      return false;
    }
    
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
