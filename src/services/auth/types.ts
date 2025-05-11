export interface SignupData {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  phone_number?: string;
  profession?: string;
  gender?: string;
  height?: string;
  weight?: string;
  activity_level?: string;
  health_goals?: string[];
  dietary_restrictions?: string[];
  email_verified?: boolean;
  user_metadata?: any;
}

export interface UserProfile {
  id: string;
  email: string;
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

export interface ProfileResult {
  profile: UserProfile | null;
  error: Error | null;
}

export interface SupabaseUser {
  id: string;
  aud: string;
  role: string;
  email: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    [key: string]: any;
  };
  identities: any[];
  created_at: string;
  updated_at: string;
}

import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  user: User | null;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
