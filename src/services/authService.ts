import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  phone_number: string | null;
  profession: string | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  activity_level: string | null;
  created_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  phone_number: string | null;
  profession?: string;
  gender?: string;
  height?: string;
  weight?: string;
  activity_level?: string;
  health_goals?: string[];
  dietary_restrictions?: string[];
  user_metadata?: any;
}

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  birth_date,
  phone_number,
  profession = null,
  gender = null,
  height = null,
  weight = null,
  activity_level = null,
  health_goals = [],
  dietary_restrictions = [],
  user_metadata = {}
}: SignUpData) {
  try {
    // Format user metadata for Supabase
    const formattedMetadata = {
      first_name,
      last_name,
      birth_date,
      phone_number,
      profession,
      gender,
      height,
      weight,
      activity_level,
      // Format health goals and restrictions to match the expected format
      health_goals: Array.isArray(health_goals) 
        ? health_goals.map(goal => ({ value: goal }))  // Ensure each goal has a value property
        : [],
      dietary_restrictions: Array.isArray(dietary_restrictions) 
        ? dietary_restrictions.map(restriction => ({ value: restriction }))  // Ensure each restriction has a value property
        : [],
      ...user_metadata
    };

    console.log("Signing up with metadata:", formattedMetadata);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: formattedMetadata
      }
    });

    if (error) {
      console.error("Supabase signup error:", error);
      throw error;
    }
    
    console.log("Signup response:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to create account. Please try again.";
    
    if (error.message) {
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please login or use a different email.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password error: " + error.message;
      } else if (error.message.includes("email")) {
        errorMessage = "Email error: " + error.message;
      }
    }
    
    toast({
      title: "Signup Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { data: null, error: { ...error, message: errorMessage } };
  }
}

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    console.log("Attempting signin with email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Signin error:", error);
      throw error;
    }
    
    console.log("Signin successful:", data.session?.user?.id);
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing in:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to sign in. Please try again.";
    
    if (error.message) {
      if (error.message.includes("Invalid login")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email before logging in.";
      }
    }
    
    toast({
      title: "Login Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { data: null, error: { ...error, message: errorMessage } };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error signing out:", error.message);
    return { error };
  }
}

export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error: any) {
    console.error("Error getting session:", error.message);
    return { session: null, error };
  }
}

export async function getUserProfile(): Promise<{ profile: UserProfile | null; error: any }> {
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

// New function to create user profile if it doesn't exist
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
    
    // If profile doesn't exist, create it
    console.log("Creating profile for user:", userId);
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        first_name: userData.first_name || null,
        last_name: userData.last_name || null,
        birth_date: userData.birth_date || null,
        phone_number: userData.phone_number || null,
        profession: userData.profession || null,
        gender: userData.gender || null,
        height: userData.height || null,
        weight: userData.weight || null,
        activity_level: userData.activity_level || null
      }]);
    
    if (insertError) {
      console.error("Error creating profile:", insertError);
      return false;
    }
    
    // Insert health goals if provided and properly formatted
    if (userData.health_goals && Array.isArray(userData.health_goals)) {
      // Extract goals, handling either plain strings or objects with a "value" property
      const healthGoals = userData.health_goals
        .filter((goal: any) => {
          // Filter out null or empty values
          const goalValue = typeof goal === 'object' ? goal.value : goal;
          return goalValue && goalValue.trim() !== '';
        })
        .map((goal: any) => ({
          user_id: userId,
          goal: typeof goal === 'object' ? goal.value : goal
        }));
      
      if (healthGoals.length > 0) {
        const { error: goalsError } = await supabase
          .from('user_health_goals')
          .insert(healthGoals);
        
        if (goalsError) {
          console.error("Error inserting health goals:", goalsError);
        }
      }
    }
    
    // Insert dietary restrictions if provided and properly formatted
    if (userData.dietary_restrictions && Array.isArray(userData.dietary_restrictions)) {
      // Extract restrictions, handling either plain strings or objects with a "value" property
      const dietaryRestrictions = userData.dietary_restrictions
        .filter((restriction: any) => {
          // Filter out null or empty values
          const restrictionValue = typeof restriction === 'object' ? restriction.value : restriction;
          return restrictionValue && restrictionValue.trim() !== '';
        })
        .map((restriction: any) => ({
          user_id: userId,
          restriction: typeof restriction === 'object' ? restriction.value : restriction
        }));
      
      if (dietaryRestrictions.length > 0) {
        const { error: restrictionsError } = await supabase
          .from('user_dietary_restrictions')
          .insert(dietaryRestrictions);
        
        if (restrictionsError) {
          console.error("Error inserting dietary restrictions:", restrictionsError);
        }
      }
    }
    
    console.log("Profile created successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    return false;
  }
}
