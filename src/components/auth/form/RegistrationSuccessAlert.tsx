
import React from "react";
import { motion } from "framer-motion";
import { MailOpen, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
          <p>Please check your inbox and click the verification link to activate your account.</p>
          <Button 
            variant="outline" 
            className="mt-3 bg-background border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => window.open(`https://mail.google.com`, '_blank')}
          >
            Open Gmail
          </Button>
          <Button 
            variant="outline" 
            className="mt-3 ml-2 bg-background border-primary text-primary hover:bg-primary hover:text-white"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default RegistrationSuccessAlert;
