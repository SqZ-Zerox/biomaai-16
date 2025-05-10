export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lab_insights: {
        Row: {
          created_at: string
          follow_ups: Json
          id: string
          insights: Json
          recommendations: Json
          report_id: string
          warnings: Json
        }
        Insert: {
          created_at?: string
          follow_ups?: Json
          id?: string
          insights?: Json
          recommendations?: Json
          report_id: string
          warnings?: Json
        }
        Update: {
          created_at?: string
          follow_ups?: Json
          id?: string
          insights?: Json
          recommendations?: Json
          report_id?: string
          warnings?: Json
        }
        Relationships: [
          {
            foreignKeyName: "lab_insights_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "lab_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_reports: {
        Row: {
          file_name: string
          file_path: string
          id: string
          is_deleted: boolean
          status: string
          test_types: string[] | null
          upload_date: string
          user_id: string
        }
        Insert: {
          file_name: string
          file_path: string
          id?: string
          is_deleted?: boolean
          status?: string
          test_types?: string[] | null
          upload_date?: string
          user_id: string
        }
        Update: {
          file_name?: string
          file_path?: string
          id?: string
          is_deleted?: boolean
          status?: string
          test_types?: string[] | null
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      lab_results: {
        Row: {
          biomarker_name: string
          category: string | null
          created_at: string
          id: string
          reference_range: string | null
          report_id: string
          status: string
          unit: string | null
          value: string
        }
        Insert: {
          biomarker_name: string
          category?: string | null
          created_at?: string
          id?: string
          reference_range?: string | null
          report_id: string
          status: string
          unit?: string | null
          value: string
        }
        Update: {
          biomarker_name?: string
          category?: string | null
          created_at?: string
          id?: string
          reference_range?: string | null
          report_id?: string
          status?: string
          unit?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "lab_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          birth_date: string | null
          created_at: string
          first_name: string | null
          gender: string | null
          height: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          profession: string | null
          weight: string | null
        }
        Insert: {
          activity_level?: string | null
          birth_date?: string | null
          created_at?: string
          first_name?: string | null
          gender?: string | null
          height?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          profession?: string | null
          weight?: string | null
        }
        Update: {
          activity_level?: string | null
          birth_date?: string | null
          created_at?: string
          first_name?: string | null
          gender?: string | null
          height?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          profession?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      user_dietary_restrictions: {
        Row: {
          created_at: string
          id: string
          restriction: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          restriction: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          restriction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dietary_restrictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_health_goals: {
        Row: {
          created_at: string
          goal: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_health_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_medical_history: {
        Row: {
          condition_type: string
          created_at: string
          description: string
          id: string
          user_id: string
        }
        Insert: {
          condition_type: string
          created_at?: string
          description: string
          id?: string
          user_id: string
        }
        Update: {
          condition_type?: string
          created_at?: string
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_medical_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_nutrition_preferences: {
        Row: {
          breakfast: boolean | null
          calorie_target: number | null
          created_at: string
          dinner: boolean | null
          id: string
          lunch: boolean | null
          meal_count: number | null
          preferred_diet: string | null
          snacks: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          breakfast?: boolean | null
          calorie_target?: number | null
          created_at?: string
          dinner?: boolean | null
          id?: string
          lunch?: boolean | null
          meal_count?: number | null
          preferred_diet?: string | null
          snacks?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          breakfast?: boolean | null
          calorie_target?: number | null
          created_at?: string
          dinner?: boolean | null
          id?: string
          lunch?: boolean | null
          meal_count?: number | null
          preferred_diet?: string | null
          snacks?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_nutrition_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
