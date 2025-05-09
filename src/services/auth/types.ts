
import { SupabaseClient, Session } from '@supabase/supabase-js';

export interface AuthResult {
  data: {
    session: Session | null;
    user: any | null;
  } | null;
  error: Error | null;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  phone_number: string | null;
  gender: string;
  height: string;
  weight: string;
  activity_level: string;
  health_goals: string[];
  dietary_restrictions: string[];
  captchaToken: string | null;
  user_metadata: {
    existing_conditions: string[];
    allergies: string;
    medications: string;
    family_history: string[];
    recent_lab_work: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
  captchaToken: string | null;
}

export interface ResetPasswordData {
  accessToken: string;
  password: string;
}

export interface RequestPasswordResetData {
  email: string;
}

// User profile interfaces
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date?: string;
  gender?: string;
  avatar_url?: string;
  phone_number?: string;
  height?: string;
  weight?: string;
  activity_level?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileResult {
  data: UserProfile | null;
  error: Error | null;
}

export interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  supabase: SupabaseClient | null;
  isLoading: boolean;
  isDemoMode: boolean;
  signIn: (data: LoginData) => Promise<AuthResult>;
  signUp: (data: SignupData) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (data: ResetPasswordData) => Promise<{ error: Error | null }>;
  checkSession: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<ProfileResult>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}
