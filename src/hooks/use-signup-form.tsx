
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { signupSchema, SignupFormValues } from "@/components/auth/form/signup/types";
import { clearEmailExistsCache } from "@/services/auth/emailUtils";

export function useSignupForm(onRegistrationSuccess: (email: string) => void) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'credentials' | 'personal' | 'health' | 'medical' | 'terms'>('credentials');
  
  // Clear email cache when form is initialized
  clearEmailExistsCache();
  
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
    
    // Check for email error before proceeding
    if (form.formState.errors.email) {
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
    
    console.log("Health goals when proceeding to medical step:", health_goals);
    
    // Validate current fields before proceeding
    if (!height || !weight || !activity_level) {
      form.trigger(["height", "weight", "activity_level"]);
      return;
    }
    
    // Specific validation for health goals
    if (!health_goals || health_goals.length === 0) {
      form.setError('health_goals', {
        type: 'manual',
        message: 'Please select at least one health goal'
      });
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
      setIsLoading(true);
      
      const values = form.getValues();
      
      // Ensure terms are accepted
      if (!values.terms_accepted) {
        toast({
          title: "Terms Required",
          description: "You must accept the terms and conditions to create an account.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Enhanced validation for health goals
      console.log("Health goals selected:", values.health_goals);
      
      if (!values.health_goals || values.health_goals.length === 0) {
        toast({
          title: "Health Goals Required",
          description: "Please select at least one health goal.",
          variant: "destructive",
        });
        setIsLoading(false);
        setCurrentStep('health'); // Take user back to health goals section
        return;
      }
      
      // Format data for API - make sure to send raw string values for health goals and dietary restrictions
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
        },
        // Flag to indicate email has already been checked
        _emailChecked: true
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
        
        // Handle specific error cases
        if (errorMessage.includes("already registered") || errorMessage.includes("already exists")) {
          errorMessage = "This email is already registered. Please use a different email or try logging in.";
          form.setError('email', {
            type: 'manual',
            message: 'This email is already registered'
          });
          setCurrentStep('credentials');
        }
        
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Reset form and notify parent component of success
      form.reset();
      onRegistrationSuccess(values.email);
      
      // Show appropriate message based on email verification requirement
      const emailVerificationRequired = !data?.session;
      
      if (emailVerificationRequired) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before attempting to log in.",
        });
      } else {
        // Automatically navigate to dashboard if email confirmation is disabled in Supabase
        // Refresh the auth context to ensure it has the latest session data
        await checkSession();
        
        toast({
          title: "Account created!",
          description: "Your account has been created successfully. Redirecting to dashboard...",
        });
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
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
