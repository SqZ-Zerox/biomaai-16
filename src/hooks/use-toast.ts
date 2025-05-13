
// Import the original toast component from shadcn/ui
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import {
  type ToastActionElement,
  type ToastProps as ShadcnToastProps,
} from "@/components/ui/toast";

// Import the original hook
import {
  useToast as useShadcnToast,
} from "@/components/ui/toast";

// Define our custom variant type that extends the original
export type ToastVariant = "default" | "destructive" | "success" | "warning";

// Create an extended toast props interface that includes optional variant
export interface ExtendedToastProps extends Omit<ShadcnToastProps, "variant"> {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: ToastActionElement;
}

// Create our custom hook that extends the original hook
export const useToast = () => {
  const { toast: originalToast, ...rest } = useShadcnToast();
  
  // Return the original methods but with our extended type
  return {
    ...rest,
    toast: (props: ExtendedToastProps) => {
      // Map our extended props to the original toast props
      const { variant, ...otherProps } = props;
      
      // Only pass variant if it's default or destructive (the only ones supported by shadcn)
      const mappedVariant = variant === "default" || variant === "destructive" 
        ? variant 
        : "default";
      
      return originalToast({
        ...otherProps,
        variant: mappedVariant,
        className: variant === "success" 
          ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300" 
          : variant === "warning"
            ? "bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
            : undefined
      });
    }
  };
};

// Re-export the toast function to make it available directly
export const toast = (props: ExtendedToastProps) => {
  const { toast } = useToast();
  toast(props);
};

// Re-export the types
export type { ToastActionElement };

