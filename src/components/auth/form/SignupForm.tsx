
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import SignupCredentialsStep from "./signup/SignupCredentialsStep";
import SignupPersonalStep from "./signup/SignupPersonalStep";
import SignupHealthStep from "./signup/SignupHealthStep";
import SignupMedicalStep from "./signup/SignupMedicalStep";
import SignupTermsStep from "./signup/SignupTermsStep";
import SignupStepIndicator from "./signup/SignupStepIndicator";
import { useSignupForm } from "@/hooks/use-signup-form";

interface SignupFormProps {
  onRegistrationSuccess: (email: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onRegistrationSuccess }) => {
  const {
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
  } = useSignupForm(onRegistrationSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          {/* Step progress indicator */}
          <SignupStepIndicator currentStep={currentStep} />
          
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
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
