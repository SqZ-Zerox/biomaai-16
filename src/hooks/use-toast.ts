
import { toast as sonnerToast, type ToastT } from "sonner"

type ToastProps = ToastT & {
  description?: React.ReactNode
}

export function toast(props: ToastProps) {
  return sonnerToast(props)
}

export const useToast = () => {
  return {
    toast,
  }
}
