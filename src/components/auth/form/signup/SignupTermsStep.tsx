
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft } from "lucide-react";
import { stepAnimation } from "./animations";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "./types";

interface SignupTermsStepProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

const SignupTermsStep: React.FC<SignupTermsStepProps> = ({ 
  form, 
  isLoading, 
  onBack,
  onSubmit
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    onSubmit();
  };

  return (
    <motion.div
      key="terms-step"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={stepAnimation}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Terms & Conditions</h2>
        <p className="text-muted-foreground text-center mb-6">
          Please review and accept our terms to complete your registration
        </p>
        
        <div className="bg-muted/50 rounded-md p-4 h-48 overflow-y-auto text-sm mb-6">
          <h3 className="font-semibold mb-2">Terms of Service</h3>
          <p className="mb-4">
            By using our service, you agree to the following terms and conditions. These terms govern your access to and use of BIOMA AI, including any content, functionality, and services offered through our website.
          </p>
          <p className="mb-4">
            Our platform provides AI-powered health recommendations based on the information you provide. These recommendations are not medical advice, and we are not responsible for any actions taken based on our recommendations.
          </p>
          <p className="mb-4">
            You agree to provide accurate information about your health status. We collect and process this information according to our Privacy Policy, which you should also review.
          </p>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
          <p className="mb-4">
            We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.
          </p>
        </div>

        <FormField
          control={form.control}
          name="terms_accepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading || isSubmitted}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormDescription>
                  I agree to the Terms of Service and Privacy Policy
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading || isSubmitted}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !form.getValues().terms_accepted || isSubmitted}
        >
          {isLoading || isSubmitted ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSubmitted ? "Processing..." : "Creating Account..."}
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default SignupTermsStep;
