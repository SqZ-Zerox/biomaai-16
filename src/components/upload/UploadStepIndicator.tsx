
import React from "react";
import { Check } from "lucide-react";

interface UploadStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const UploadStepIndicator: React.FC<UploadStepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center w-full max-w-md">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
          <React.Fragment key={stepNum}>
            <div 
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                stepNum === currentStep 
                  ? 'bg-primary text-primary-foreground'
                  : stepNum < currentStep 
                    ? 'bg-primary/70 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {stepNum < currentStep ? <Check className="h-4 w-4" /> : stepNum}
            </div>
            {stepNum < totalSteps && (
              <div 
                className={`h-1 flex-grow mx-1 rounded-full ${
                  stepNum < currentStep
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

export default UploadStepIndicator;
