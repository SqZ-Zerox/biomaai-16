import { User } from "@supabase/supabase-js";

// Define the structure for health goals and dietary restrictions
interface SelectOption {
  id: string;
  name: string;
  selected: boolean;
}

// Define the structure for user profile data
export interface UserProfileData {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  healthGoals: SelectOption[];
  dietaryRestrictions: SelectOption[];
}

/**
 * Helper function to check if an item is not null and has a 'value' property
 */
function isValidItem<T extends { value: string }>(item: T | null): item is T {
  return item !== null && typeof item === 'object' && 'value' in item;
}

/**
 * Process raw user data into a standardized UserProfileData format
 */
export const processProfileData = (userData: any): UserProfileData => {
  const profileData: UserProfileData = {
    fullName: userData.raw_user_meta_data?.full_name || userData.email,
    email: userData.email,
    avatarUrl: userData.raw_user_meta_data?.avatar_url || null,
    healthGoals: [],
    dietaryRestrictions: [],
  };

  // Process health goals if present and valid
  if (
    userData.raw_user_meta_data?.health_goals &&
    Array.isArray(userData.raw_user_meta_data.health_goals)
  ) {
    const healthGoals = userData.raw_user_meta_data.health_goals
      .filter(isValidItem)
      .map(goalItem => ({
        id: goalItem.value,
        name: goalItem.value,
        selected: true
      }));

    if (healthGoals.length > 0) {
      profileData.healthGoals = healthGoals;
    }
  }

  // Process dietary restrictions if present and valid
  if (
    userData.raw_user_meta_data?.dietary_restrictions &&
    Array.isArray(userData.raw_user_meta_data.dietary_restrictions)
  ) {
    const dietaryRestrictions = userData.raw_user_meta_data.dietary_restrictions
      .filter(isValidItem)
      .map(restrictionItem => ({
        id: restrictionItem.value,
        name: restrictionItem.value,
        selected: true
      }));

    if (dietaryRestrictions.length > 0) {
      profileData.dietaryRestrictions = dietaryRestrictions;
    }
  }

  return profileData;
};

/**
 * Extract essential user data from Supabase User object
 */
export const extractSupabaseUser = (user: User) => {
  return {
    id: user.id,
    email: user.email!,
    user_metadata: user.user_metadata,
  };
};
