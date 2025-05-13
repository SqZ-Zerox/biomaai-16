
// Import the original toast components from shadcn/ui
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

// Create our own hook instead of importing
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define our custom variant type that extends the original
export type ToastVariant = "default" | "destructive" | "success" | "warning";

// Create an extended toast props interface that includes optional variant
export interface ExtendedToastProps extends Omit<ShadcnToastProps, "variant"> {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: ToastActionElement;
}

// Create internal toast state
type Toast = ExtendedToastProps & {
  id: string;
};

// Create our custom hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (props: ExtendedToastProps) => {
      const id = props.id || uuidv4();
      const { variant, ...otherProps } = props;
      
      // Add variant-specific class names
      const className = variant === "success" 
        ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300" 
        : variant === "warning"
          ? "bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
          : undefined;

      // Map our variants to the ones supported by shadcn UI
      const mappedVariant = variant === "default" || variant === "destructive" 
        ? variant 
        : "default";

      setToasts((prevToasts) => [
        ...prevToasts,
        { id, variant: mappedVariant, className, ...otherProps },
      ]);

      return { id, update: (props: ExtendedToastProps) => updateToast(id, props) };
    },
    [setToasts]
  );

  const updateToast = useCallback(
    (id: string, props: ExtendedToastProps) => {
      setToasts((prevToasts) => 
        prevToasts.map((toast) => 
          toast.id === id ? { ...toast, ...props } : toast
        )
      );
    }, 
    [setToasts]
  );

  const dismissToast = useCallback(
    (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  return {
    toast,
    toasts,
    dismissToast,
    updateToast,
  };
};

// Global toast state for the application
const toastState = {
  toasts: [] as Toast[],
  toast: null as ((props: ExtendedToastProps) => { id: string; update: (props: ExtendedToastProps) => void }) | null,
};

// Initialize the global toast function
if (typeof window !== 'undefined') {
  const initialize = () => {
    const { toast } = useToast();
    toastState.toast = toast;
  };
  
  if (document.readyState !== 'loading') {
    initialize();
  } else {
    window.addEventListener('DOMContentLoaded', initialize);
  }
}

// Re-export the toast function to make it available directly
export const toast = (props: ExtendedToastProps) => {
  if (typeof window === 'undefined') {
    // SSR environment - do nothing
    return { id: '', update: () => {} };
  }
  
  // Try to use the real toast implementation
  if (toastState.toast) {
    return toastState.toast(props);
  }

  // Fallback if toast is not initialized yet - queue it
  console.warn('Toast used before initialization');
  const id = props.id || uuidv4();
  return {
    id,
    update: () => console.warn('Cannot update toast before initialization')
  };
};

// Re-export the types
export type { ToastActionElement };
