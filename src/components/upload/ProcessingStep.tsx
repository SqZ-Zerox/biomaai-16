
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Loader, Clock } from "lucide-react";

interface ProcessingStepProps {
  processingProgress: number;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ processingProgress }) => {
  const getCurrentStep = (progress: number) => {
    if (progress < 30) return "Extracting Text & Detecting Tests";
    if (progress < 60) return "Identifying Lab Values";
    if (progress < 90) return "Comparing to Reference Ranges";
    return "Generating Insights";
  };

  return (
    <div className="py-12">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="p-4 bg-primary/10 rounded-full">
            <Loader className="h-12 w-12 text-primary animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Analyzing Your Reports</h3>
          <p className="text-muted-foreground mb-6">This may take a few moments</p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <Progress value={processingProgress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm">
            <span>Analyzing</span>
            <span>{processingProgress}%</span>
          </div>
        </div>
        
        <div className="w-full max-w-md mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Current step:</span>
            </div>
            <span className="text-sm font-medium">
              {getCurrentStep(processingProgress)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStep;
