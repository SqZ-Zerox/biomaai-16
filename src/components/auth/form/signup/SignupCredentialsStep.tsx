
import React, { useState, useRef, useEffect } from "react";
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
import { checkIfEmailExists } from "@/services/auth";
import { debounce } from "lodash";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignupCredentialsStepProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
  onNext: () => void;
}

// Cache for emails that have already been checked
const emailCheckCache = new Map<string, boolean>();

const SignupCredentialsStep: React.FC<SignupCredentialsStepProps> = ({ 
  form, 
  isLoading, 
  onNext 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Create a debounced email check function that only runs after 500ms of inactivity
  const debouncedEmailCheck = useRef(
    debounce(async (email: string) => {
      if (!email || form.formState.errors.email) {
        setCheckingEmail(false);
        setEmailExists(false);
        return;
      }

      try {
        // Check cache first to avoid unnecessary API calls
        if (emailCheckCache.has(email)) {
          const exists = emailCheckCache.get(email);
          if (exists) {
            form.setError("email", {
              type: "manual",
              message: "This email is already registered. Please try logging in or use a different email."
            });
            setEmailExists(true);
          } else {
            setEmailExists(false);
          }
          setCheckingEmail(false);
          return;
        }

        const exists = await checkIfEmailExists(email);
        // Save result in cache
        emailCheckCache.set(email, exists);
        
        if (exists) {
          form.setError("email", {
            type: "manual",
            message: "This email is already registered. Please try logging in or use a different email."
          });
          setEmailExists(true);
        } else {
          setEmailExists(false);
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setEmailExists(false);
      } finally {
        setCheckingEmail(false);
      }
    }, 500)
  ).current;

  // Handle email blur to check if email exists
  const handleEmailBlur = async () => {
    const email = form.getValues("email");
    if (!email || form.formState.errors.email) return;
    
    setEmailTouched(true);
    setCheckingEmail(true);
    
    // Use debounced function to avoid too many API calls
    debouncedEmailCheck(email);
  };

  // Clear email error and emailExists state when user starts typing again
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentErrors = form.formState.errors;
    if (currentErrors.email && currentErrors.email.type === "manual") {
      form.clearErrors("email");
      setEmailExists(false);
    }
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedEmailCheck.cancel();
    };
  }, [debouncedEmailCheck]);

  // Determine if Next button should be disabled
  const isNextDisabled = isLoading || checkingEmail || emailExists || (emailTouched && !!form.formState.errors.email);

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
      
      {emailExists && (
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
                  className={`pl-10 bg-background ${emailExists ? 'border-destructive' : ''}`} 
                  disabled={isLoading || checkingEmail}
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
                {emailExists && !checkingEmail && (
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
        {emailExists ? (
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
