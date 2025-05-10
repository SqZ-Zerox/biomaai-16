
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const UploadAlert: React.FC = () => {
  return (
    <Alert className="bg-muted/50 border-primary/20">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertTitle>Automatic Test Detection</AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground">
        Our AI will automatically identify the types of tests in your lab report. You don't need to specify them manually.
      </AlertDescription>
    </Alert>
  );
};

export default UploadAlert;
