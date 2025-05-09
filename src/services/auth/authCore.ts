
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AuthResult, SessionResult, SignupData } from "./types";

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  birth_date,
  phone_number,
  gender = null,
  height = null,
  weight = null,
  activity_level = null,
  profession = null,
  health_goals = [],
  dietary_restrictions = [],
  user_metadata = {
    existing_conditions: [],
    allergies: '',
    medications: '',
    family_history: [],
    recent_lab_work: ''
  }
}: SignupData): Promise<AuthResult> {
  try {
    // Format user metadata for Supabase - but only include basic identification info
    // We'll save the full profile only after verification
    const formattedMetadata = {
      first_name,
      last_name,
      email_verified: false, // Add a flag to track verification status
      // Store all other data as temporary registration data
      registration_data: {
        birth_date,
        phone_number,
        profession,
        gender,
        height,
        weight,
        activity_level,
        health_goals: Array.isArray(health_goals) 
          ? health_goals
              .filter(Boolean) // Filter out null, undefined, and falsy values
              .map((goalItem) => {
                // TypeScript safety: explicitly check if goalItem is an object with value property
                if (goalItem && typeof goalItem === 'object' && 'value' in goalItem) {
                  return String(goalItem.value || ''); 
                }
                return String(goalItem || '');
              })
          : [],
        dietary_restrictions: Array.isArray(dietary_restrictions) 
          ? dietary_restrictions
              .filter(Boolean) // Filter out null, undefined, and falsy values
              .map((restrictionItem) => {
                // TypeScript safety: explicitly check if restrictionItem is an object with value property
                if (restrictionItem && typeof restrictionItem === 'object' && 'value' in restrictionItem) {
                  return String(restrictionItem.value || '');
                }
                return String(restrictionItem || '');
              })
          : [],
        ...user_metadata
      }
    };

    console.log("Signing up with minimal metadata:", formattedMetadata);
    
    const options = {
      data: formattedMetadata,
      emailRedirectTo: `${window.location.origin}/auth/callback` // Ensure correct callback URL format
    };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
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

export async function signIn({ 
  email, 
  password
}: { 
  email: string; 
  password: string;
}): Promise<AuthResult> {
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

export async function signOut(): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error signing out:", error.message);
    return { error };
  }
}

export async function getCurrentSession(): Promise<SessionResult> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error: any) {
    console.error("Error getting session:", error.message);
    return { session: null, error };
  }
}

export async function updateUserVerificationStatus(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.warn("No active session to update verification status");
      return false;
    }
    
    console.log("Updating verification status for user:", session.user.id);
    
    // Mark the user as email verified
    const { error } = await supabase.auth.updateUser({
      data: { 
        email_verified: true 
      }
    });
    
    if (error) {
      console.error("Error updating user verification status:", error);
      return false;
    }
    
    console.log("User verification status updated successfully");
    
    // After verification, ensure profile exists
    const currentMetadata = session.user.user_metadata;
    if (currentMetadata && currentMetadata.registration_data) {
      const { error: profileError } = await supabase.from('profiles')
        .upsert([{
          id: session.user.id,
          first_name: currentMetadata.first_name || '',
          last_name: currentMetadata.last_name || '',
          birth_date: currentMetadata.registration_data.birth_date || null,
          phone_number: currentMetadata.registration_data.phone_number || null,
          profession: currentMetadata.registration_data.profession || null,
          gender: currentMetadata.registration_data.gender || null,
          height: currentMetadata.registration_data.height || null,
          weight: currentMetadata.registration_data.weight || null,
          activity_level: currentMetadata.registration_data.activity_level || null
        }], { onConflict: 'id' });
      
      if (profileError) {
        console.error("Error creating user profile:", profileError);
      } else {
        console.log("User profile created successfully");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateUserVerificationStatus:", error);
    return false;
  }
}
