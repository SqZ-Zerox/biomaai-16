
import { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { checkIfEmailExists } from "@/services/auth/emailUtils";
import { UseFormReturn } from "react-hook-form";

type UseEmailValidationProps = {
  form: UseFormReturn<any>;
};

export function useEmailValidation({ form }: UseEmailValidationProps) {
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Create a debounced email check function that runs after 500ms of inactivity
  const debouncedEmailCheck = useRef(
    debounce(async (email: string) => {
      if (!email || form.formState.errors.email?.type !== "manual") {
        setCheckingEmail(false);
        setEmailExists(false);
        return;
      }

      try {
        // Check cache first to avoid unnecessary API calls
        const exists = await checkIfEmailExists(email);
        
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
    setIsEmailFocused(false);
    const email = form.getValues("email");
    if (!email) return;
    
    // Only check if there are no validation errors from the form schema
    // Don't do the check if there are already validation errors like "invalid email format"
    if (form.formState.errors.email && form.formState.errors.email.type !== "manual") {
      return;
    }
    
    setEmailTouched(true);
    setCheckingEmail(true);
    
    // Use debounced function to avoid too many API calls
    debouncedEmailCheck(email);
  };

  // Handle email focus
  const handleEmailFocus = () => {
    setIsEmailFocused(true);
    
    // Always clear email exists error when focused
    if (form.formState.errors.email?.type === "manual") {
      form.clearErrors("email");
    }
    
    if (emailExists) {
      setEmailExists(false);
    }
  };

  // Clear email error and emailExists state when user starts typing again
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentErrors = form.formState.errors;
    
    // Always clear manual errors when typing
    if (currentErrors.email && currentErrors.email.type === "manual") {
      form.clearErrors("email");
    }
    
    // Reset the emailExists state when the user changes the input
    if (emailExists) {
      setEmailExists(false);
    }
    
    // Remove the email from cache to force a fresh check
    if (emailCheckCache.has(e.target.value)) {
      emailCheckCache.delete(e.target.value);
    }
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedEmailCheck.cancel();
    };
  }, [debouncedEmailCheck]);

  // Determine if Next button should be disabled due to email issues
  // Only disable if checking email or if email exists and not focused
  const isEmailInvalid = checkingEmail || (emailExists && !isEmailFocused);

  return {
    checkingEmail,
    emailExists,
    isEmailFocused,
    isEmailInvalid,
    handleEmailBlur,
    handleEmailFocus,
    handleEmailChange
  };
}

// Cache for emails that have already been checked - moved from component
const emailCheckCache = new Map<string, boolean>();
