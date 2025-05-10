
import React from "react";
import { CheckCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CompletionStepProps {
  selectedFiles: File[];
}

const CompletionStep: React.FC<CompletionStepProps> = ({ selectedFiles }) => {
  return (
    <div className="py-8">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
        </div>
        <h3 className="text-xl font-medium mb-2">Analysis Complete!</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We've analyzed your lab reports and generated personalized insights and recommendations.
        </p>
      </div>
      
      <div className="space-y-4">
        <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Report Summary</h4>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documents Processed:</span>
                <span className="font-medium">{selectedFiles.length} files</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tests Detected:</span>
                <span className="font-medium">Automatically identified</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-muted-foreground">Values Outside Reference:</span>
                <span className="font-medium">5 markers</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-muted-foreground">Generated Insights:</span>
                <span className="font-medium">4 recommendations</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Alert className="bg-primary/5 border-primary/30">
          <FileText className="h-4 w-4 text-primary" />
          <AlertTitle>Next Steps</AlertTitle>
          <AlertDescription className="text-sm">
            Go to your dashboard to view your complete health analysis and personalized recommendations based on your lab results.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default CompletionStep;
