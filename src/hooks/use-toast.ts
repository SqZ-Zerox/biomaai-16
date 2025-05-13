
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

import {
  useToast as useShadcnToast,
} from "@/components/ui/toaster";

// Creating an extended toast props interface that includes optional variant
export interface ToastProps extends ShadcnToastProps {
  variant?: "default" | "destructive" | "success" | "warning" | null | undefined;
}

// Create our custom hook that extends the original hook
export const useToast = () => {
  const shadcnToast = useShadcnToast();
  
  // Return the original methods but with our extended type
  return {
    ...shadcnToast,
    toast: (props: ToastProps) => shadcnToast.toast(props),
  };
};

// Re-export the toast function to make it available directly
export const toast = (props: ToastProps) => {
  const { toast } = useToast();
  toast(props);
};

// Export the types
export type { ToastActionElement };
