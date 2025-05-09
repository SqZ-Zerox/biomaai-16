
import { User, Session } from "@supabase/supabase-js";

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

export interface AuthResult<T> {
  data: T | null;
  error: any;
}

export interface SessionResult {
  session: Session | null;
  error: any;
}

export interface ProfileResult {
  profile: UserProfile | null;
  error: any;
}
