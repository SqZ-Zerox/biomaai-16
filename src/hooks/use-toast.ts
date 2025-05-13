
// Import the original toast components from shadcn/ui
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import {
  type ToastActionElement,
  type ToastProps,
} from "@/components/ui/toast"

// Create our own hook instead of importing
import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Define our custom variant type
export type ToastVariant = "default" | "destructive" | "success" | "warning"

// Create an extended toast props interface
export interface ExtendedToastProps extends Omit<ToastProps, "variant"> {
  id?: string
  title?: string
  description?: string
  variant?: ToastVariant
  action?: ToastActionElement
  className?: string
}

// Create internal toast state type
type ToastWithId = ExtendedToastProps & {
  id: string
}

// Create our custom hook
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastWithId[]>([])

  const toast = useCallback(
    (props: ExtendedToastProps) => {
      const id = props.id || uuidv4()
      const { variant, ...otherProps } = props
      
      // Add variant-specific class names
      const className = variant === "success" 
        ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300" 
        : variant === "warning"
          ? "bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
          : props.className

      setToasts((prevToasts) => [
        ...prevToasts,
        { id, variant, className, ...otherProps } as ToastWithId,
      ])

      return {
        id,
        update: (props: ExtendedToastProps) => updateToast(id, props),
        dismiss: () => dismissToast(id),
      }
    },
    [setToasts]
  )

  const updateToast = useCallback(
    (id: string, props: ExtendedToastProps) => {
      setToasts((prevToasts) => 
        prevToasts.map((toast) => 
          toast.id === id ? { ...toast, ...props } : toast
        )
      )
    }, 
    [setToasts]
  )

  const dismissToast = useCallback(
    (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    },
    [setToasts]
  )

  return {
    toast,
    toasts,
    dismissToast,
    updateToast,
  }
}

// Create a singleton instance of the toast
let toastInstance: ReturnType<typeof useToast> | null = null

// Global toast function for convenience
export const toast = (props: ExtendedToastProps) => {
  // Server-side rendering check
  if (typeof window === 'undefined') {
    return {
      id: '',
      update: () => {},
      dismiss: () => {},
    }
  }
  
  // Create the toast instance if it doesn't exist
  if (!toastInstance) {
    console.warn('Toast used before initialization - this may not work correctly')
    const tempUseToast = useToast()
    toastInstance = tempUseToast
  }
  
  // Use the instance to create the toast
  return toastInstance.toast(props)
}

// Re-export types
export type { ToastActionElement }
export type { ToastProps }
