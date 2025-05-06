
import React from "react";
import { motion } from "framer-motion";
import { MailOpen, AlertCircle, Dna } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RegistrationSuccessAlertProps {
  email: string;
  onDismiss: () => void;
}

const RegistrationSuccessAlert: React.FC<RegistrationSuccessAlertProps> = ({ 
  email,
  onDismiss
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Alert className="bg-primary/10 border-primary text-foreground">
        <MailOpen className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-bold text-lg">Verification Email Sent!</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">We've sent a verification email to <span className="font-bold">{email}</span></p>
          <p>Please check your inbox and click the verification link to activate your account and start analyzing your health data.</p>
          
          <div className="mt-3 p-3 bg-background/60 rounded-lg border border-primary/20 flex items-start gap-3">
            <Dna className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Genetic Analysis</h4>
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                While we're currently showcasing our lab test analysis capabilities, our advanced genetic analysis feature is in development. Soon you'll be able to unlock deeper insights from your DNA profile for even more personalized health recommendations.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              className="bg-background border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => window.open(`https://mail.google.com`, '_blank')}
            >
              Open Gmail
            </Button>
            <Button 
              variant="outline" 
              className="bg-background border-primary text-primary hover:bg-primary hover:text-white"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default RegistrationSuccessAlert;
