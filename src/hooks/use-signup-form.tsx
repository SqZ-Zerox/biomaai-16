
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { signupSchema, SignupFormValues } from "@/components/auth/form/signup/types";

export function useSignupForm(onRegistrationSuccess: (email: string) => void) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'credentials' | 'personal' | 'health' | 'medical' | 'terms'>('credentials');
  
  // Signup form with expanded health information
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      // Account Credentials
      email: "",
      password: "",
      confirmPassword: "",
      
      // Personal Information
      first_name: "",
      last_name: "",
      birth_date: "",
      phone_number: "",
      gender: "prefer_not_to_say",
      
      // Health Profile
      height: "",
      weight: "",
      activity_level: "moderate",
      health_goals: [],
      dietary_restrictions: [],
      
      // Medical History
      existing_conditions: [],
      allergies: "",
      medications: "",
      family_history: [],
      recent_lab_work: "not_sure",
      
      // Terms
      terms_accepted: false,
    },
  });

  // Step navigation functions
  const proceedToPersonalStep = () => {
    const { email, password, confirmPassword } = form.getValues();
    
    // Validate current fields before proceeding
    if (!email || !password || !confirmPassword || password !== confirmPassword) {
      form.trigger(["email", "password", "confirmPassword"]);
      return;
    }
    
    setCurrentStep('personal');
  };

  const proceedToHealthStep = () => {
    const { first_name, last_name, birth_date, gender } = form.getValues();
    
    // Validate current fields before proceeding
    if (!first_name || !last_name || !birth_date || !gender) {
      form.trigger(["first_name", "last_name", "birth_date", "gender"]);
      return;
    }
    
    setCurrentStep('health');
  };

  const proceedToMedicalStep = () => {
    const { height, weight, activity_level, health_goals } = form.getValues();
    
    // Validate current fields before proceeding
    if (!height || !weight || !activity_level || health_goals.length === 0) {
      form.trigger(["height", "weight", "activity_level", "health_goals"]);
      return;
    }
    
    setCurrentStep('medical');
  };

  const proceedToTermsStep = () => {
    const { recent_lab_work } = form.getValues();
    
    // Validate current fields before proceeding
    if (!recent_lab_work) {
      form.trigger(["recent_lab_work"]);
      return;
    }
    
    setCurrentStep('terms');
  };

  const backToCredentialsStep = () => {
    setCurrentStep('credentials');
  };

  const backToPersonalStep = () => {
    setCurrentStep('personal');
  };

  const backToHealthStep = () => {
    setCurrentStep('health');
  };

  const backToMedicalStep = () => {
    setCurrentStep('medical');
  };

  const onSubmit = async () => {
    try {
      const values = form.getValues();
      
      // Ensure terms are accepted
      if (!values.terms_accepted) {
        toast({
          title: "Terms Required",
          description: "You must accept the terms and conditions to create an account.",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      
      // Ensure we have at least one health goal to prevent null constraint errors
      if (!values.health_goals || values.health_goals.length === 0) {
        toast({
          title: "Health Goals Required",
          description: "Please select at least one health goal.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Format data for API - make sure to include raw values, not objects
      const signupData = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: values.birth_date,
        phone_number: values.phone_number || null,
        gender: values.gender,
        height: values.height,
        weight: values.weight,
        activity_level: values.activity_level,
        health_goals: values.health_goals,
        dietary_restrictions: values.dietary_restrictions || [],
        user_metadata: {
          existing_conditions: values.existing_conditions || [],
          allergies: values.allergies || "",
          medications: values.medications || "",
          family_history: values.family_history || [],
          recent_lab_work: values.recent_lab_work
        }
      };

      console.log("Submitting signup data:", signupData);

      // Call signup API
      const { data, error } = await signUp(signupData);
      
      if (error) {
        console.error("Signup error:", error);
        
        let errorMessage = "Failed to create account. Please try again.";
        if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      // Reset form and notify parent component of success
      form.reset();
      onRegistrationSuccess(values.email);
      
      // Automatically navigate to dashboard if email confirmation is disabled in Supabase
      if (data?.session) {
        // Refresh the auth context to ensure it has the latest session data
        await checkSession();
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
      
      toast({
        title: "Account created!",
        description: data?.session 
          ? "Your account has been created successfully. Redirecting to dashboard..."
          : "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Signup submission error:", error);
      
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    currentStep,
    proceedToPersonalStep,
    proceedToHealthStep,
    proceedToMedicalStep,
    proceedToTermsStep,
    backToCredentialsStep,
    backToPersonalStep,
    backToHealthStep,
    backToMedicalStep,
    onSubmit
  };
}
