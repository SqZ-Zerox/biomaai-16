
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  phone_number: string | null;
  profession: string | null;
  created_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  phone_number: string | null;
  profession: string;
}

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  birth_date,
  phone_number,
  profession
}: SignUpData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          birth_date,
          phone_number,
          profession
        }
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    return { data: null, error };
  }
}

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    return { data: null, error };
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
    if (sessionError) throw sessionError;
    if (!session?.user) return { profile: null, error: new Error("No user logged in") };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    return { profile: data as UserProfile, error: null };
  } catch (error: any) {
    console.error("Error fetching user profile:", error.message);
    return { profile: null, error };
  }
}
