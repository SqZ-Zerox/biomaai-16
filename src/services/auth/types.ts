
export interface AuthResult<T> {
  data: T | null;
  error: Error | null;
}

export interface SessionResult {
  session: any | null;
  error: Error | null;
}

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  phone_number?: string | null;
  profession?: string | null;
  gender?: string | null;
  height?: string | null;
  weight?: string | null;
  activity_level?: string | null;
  health_goals?: any[];
  dietary_restrictions?: any[];
  user_metadata?: Record<string, any>;
  captchaToken?: string | null;
}
