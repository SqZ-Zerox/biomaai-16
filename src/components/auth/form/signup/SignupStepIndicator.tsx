
import React from "react";

type SignupStep = 'credentials' | 'personal' | 'health' | 'medical' | 'terms';

interface SignupStepIndicatorProps {
  currentStep: SignupStep;
}

const SignupStepIndicator: React.FC<SignupStepIndicatorProps> = ({ currentStep }) => {
  const steps: SignupStep[] = ['credentials', 'personal', 'health', 'medical', 'terms'];
  
  return (
    <div className="flex items-center justify-center mb-8 px-4 py-2">
      <div className="flex items-center w-full max-w-xs">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div 
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step 
                  ? 'bg-primary text-primary-foreground'
                  : index < steps.indexOf(currentStep) 
                    ? 'bg-primary/70 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
            {index < 4 && (
              <div 
                className={`h-1 flex-grow mx-1 rounded-full ${
                  index < steps.indexOf(currentStep)
                    ? 'bg-primary/70'
                    : 'bg-muted'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SignupStepIndicator;
