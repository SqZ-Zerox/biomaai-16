
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignupFormValues } from "./types";
import { slideVariants } from "./animations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEmailValidation } from "@/hooks/useEmailValidation";

interface SignupCredentialsStepProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
  onNext: () => void;
}

const SignupCredentialsStep: React.FC<SignupCredentialsStepProps> = ({ 
  form, 
  isLoading, 
  onNext 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Use our custom email validation hook
  const {
    checkingEmail,
    emailExists,
    isEmailFocused,
    isEmailInvalid,
    handleEmailBlur,
    handleEmailFocus,
    handleEmailChange
  } = useEmailValidation({ form });

  // Determine if Next button should be disabled
  const isNextDisabled = isLoading || isEmailInvalid || !!form.formState.errors.email;

  return (
    <motion.div
      key="credentials"
      initial="enterFromLeft"
      animate="center"
      exit="exitToLeft"
      variants={slideVariants}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/90 text-primary-foreground text-sm font-medium">1</div>
        <h3 className="text-lg font-medium">Account Credentials</h3>
      </div>
      
      {emailExists && !isEmailFocused && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This email is already registered. Please try logging in or use a different email.
          </AlertDescription>
        </Alert>
      )}
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="you@example.com" 
                  className={`pl-10 bg-background ${emailExists && !isEmailFocused ? 'border-destructive' : ''}`} 
                  disabled={isLoading || checkingEmail}
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                  onChange={(e) => {
                    field.onChange(e);
                    handleEmailChange(e);
                  }}
                  {...field} 
                />
                {checkingEmail && (
                  <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground animate-spin" />
                )}
                {emailExists && !isEmailFocused && !checkingEmail && (
                  <AlertCircle className="absolute right-3 top-2.5 h-5 w-5 text-destructive" />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  className="pl-10 bg-background" 
                  disabled={isLoading}
                  {...field} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  className="pl-10 bg-background" 
                  disabled={isLoading}
                  {...field} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Button 
        type="button" 
        className="w-full mt-6" 
        onClick={onNext}
        disabled={isNextDisabled}
      >
        {emailExists && !isEmailFocused ? (
          "Email already in use"
        ) : (
          <>
            Next: Personal Information
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default SignupCredentialsStep;
