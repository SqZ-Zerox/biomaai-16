
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignupFormValues } from "./types";
import { slideVariants } from "./animations";

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
  return (
    <motion.div
      key="terms"
      initial="enterFromRight"
      animate="center"
      exit="exitToLeft"
      variants={slideVariants}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">5</div>
        <h3 className="text-lg font-medium">Terms & Conditions</h3>
      </div>
      
      <div className="bg-background/50 border border-border/40 rounded-md p-4 max-h-48 overflow-y-auto text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground mb-2">BIOMA AI Terms of Service</h4>
        <p className="mb-2">
          By creating an account, you agree to our Terms of Service and Privacy Policy. 
          BIOMA AI is a health and wellness platform that uses AI to analyze your health data and provide personalized recommendations.
        </p>
        <p className="mb-2">
          <strong>Health Data:</strong> We collect and process your health data to provide our services. This includes information 
          you provide during signup, lab results you upload, and data from connected devices.
        </p>
        <p className="mb-2">
          <strong>Security:</strong> We employ industry-standard security measures to protect your personal information.
          All health data is encrypted both in transit and at rest.
        </p>
        <p className="mb-2">
          <strong>Data Usage:</strong> We use your data to provide personalized health insights and recommendations.
          We may use anonymized data for research and to improve our services.
        </p>
        <p>
          <strong>Third Parties:</strong> We do not sell your personal information to third parties.
          We may share anonymized data with research partners to improve our AI models.
        </p>
        
        <Separator className="my-4" />
        
        <h4 className="font-semibold text-foreground mb-2">Privacy Policy</h4>
        <p className="mb-2">
          Our Privacy Policy explains how we collect, use, and protect your personal information.
          Please review it carefully before creating an account.
        </p>
        <p>
          You can manage your data and privacy settings in your account dashboard after signing up.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="terms_accepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/40 p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="cursor-pointer">
                I agree to the Terms of Service and Privacy Policy
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="submit" 
          className="w-full" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default SignupTermsStep;
