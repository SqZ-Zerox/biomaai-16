
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

import { Form } from "@/components/ui/form";
import SignupCredentialsStep from "./signup/SignupCredentialsStep";
import SignupPersonalStep from "./signup/SignupPersonalStep";
import SignupHealthStep from "./signup/SignupHealthStep";
import SignupMedicalStep from "./signup/SignupMedicalStep";
import SignupTermsStep from "./signup/SignupTermsStep";
import { signupSchema, SignupFormValues } from "./signup/types";

interface SignupFormProps {
  onRegistrationSuccess: (email: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onRegistrationSuccess }) => {
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
      
      // Format data for API
      const signupData = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: values.birth_date,
        phone_number: values.phone_number || null,
        profession: null,
        user_metadata: {
          gender: values.gender,
          height: values.height,
          weight: values.weight,
          activity_level: values.activity_level,
          health_goals: values.health_goals,
          dietary_restrictions: values.dietary_restrictions,
          existing_conditions: values.existing_conditions,
          allergies: values.allergies,
          medications: values.medications,
          family_history: values.family_history,
          recent_lab_work: values.recent_lab_work
        }
      };

      // Call signup API
      const { data, error } = await signUp(signupData);
      
      if (error) {
        let errorMessage = "Failed to create account. Please try again.";
        if (error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please login or use a different email.";
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
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          {currentStep === 'credentials' && (
            <SignupCredentialsStep 
              form={form} 
              isLoading={isLoading} 
              onNext={proceedToPersonalStep} 
            />
          )}
          
          {currentStep === 'personal' && (
            <SignupPersonalStep 
              form={form} 
              isLoading={isLoading} 
              onNext={proceedToHealthStep} 
              onBack={backToCredentialsStep} 
            />
          )}
          
          {currentStep === 'health' && (
            <SignupHealthStep 
              form={form} 
              isLoading={isLoading} 
              onNext={proceedToMedicalStep} 
              onBack={backToPersonalStep} 
            />
          )}
          
          {currentStep === 'medical' && (
            <SignupMedicalStep 
              form={form} 
              isLoading={isLoading} 
              onNext={proceedToTermsStep} 
              onBack={backToHealthStep} 
            />
          )}
          
          {currentStep === 'terms' && (
            <SignupTermsStep 
              form={form} 
              isLoading={isLoading} 
              onBack={backToMedicalStep}
              onSubmit={onSubmit}
            />
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
};

export default SignupForm;
