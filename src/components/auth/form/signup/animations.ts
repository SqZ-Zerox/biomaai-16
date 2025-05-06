
export const slideVariants = {
  enterFromRight: { x: 50, opacity: 0 },
  enterFromLeft: { x: -50, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exitToLeft: { x: -50, opacity: 0, transition: { duration: 0.3 } },
  exitToRight: { x: 50, opacity: 0, transition: { duration: 0.3 } }
};

export const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};
