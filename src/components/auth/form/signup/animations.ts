
import { Variants } from "framer-motion";

// Animation variants for step transitions
export const stepAnimation: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    x: -20, 
    scale: 0.95, 
    transition: { 
      duration: 0.2 
    } 
  }
};

// Animation variants for step indicator
export const stepIndicatorAnimation: Variants = {
  inactive: {
    scale: 1,
    backgroundColor: "var(--muted)", 
    color: "var(--muted-foreground)"
  },
  active: {
    scale: 1.1,
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  complete: {
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)"
  }
};

// Animation for form fields
export const formItemAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3
    }
  })
};
