
import { z } from "zod";

export const signupSchema = z.object({
  // Account Credentials
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  
  // Personal Information
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  birth_date: z.string()
    .refine(val => {
      if (!val) return false;
      
      const birthDate = new Date(val);
      const today = new Date();
      
      // Check if date is invalid
      if (isNaN(birthDate.getTime())) return false;
      
      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Check if age is between 13 and 100
      return age >= 13 && age <= 100;
    }, { message: "You must be at least 13 years old and not older than 100 years" }),
  phone_number: z.string().optional(),
  gender: z.enum(["male", "female", "non_binary", "prefer_not_to_say"], {
    required_error: "Please select your gender",
  }),
  
  // Health Profile
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "very_active"], {
    required_error: "Please select your activity level",
  }),
  health_goals: z.array(z.string()).min(1, { message: "Please select at least one health goal" }),
  dietary_restrictions: z.array(z.string()).optional(),
  
  // Medical History
  existing_conditions: z.array(z.string()).optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  family_history: z.array(z.string()).optional(),
  recent_lab_work: z.enum(["yes", "no", "not_sure"], {
    required_error: "Please indicate if you've had recent lab work",
  }),
  
  // Terms
  terms_accepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupSchema>;
