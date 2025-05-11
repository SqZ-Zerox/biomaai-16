
import React from "react";
import { motion } from "framer-motion";
import { MailOpen, AlertCircle, Info, ExternalLink } from "lucide-react";
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
      className="mb-8 w-full"
    >
      <Alert className="bg-primary/10 border-primary text-foreground">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="flex items-start">
              <MailOpen className="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
              <div>
                <AlertTitle className="text-primary font-bold text-xl">Verification Email Sent!</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-2 text-base">We've sent a verification email to <span className="font-bold">{email}</span></p>
                  <p className="text-sm text-muted-foreground">Please check your inbox and click the verification link to activate your account.</p>
                </AlertDescription>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/60 rounded-lg border border-primary/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-600 dark:text-amber-400 text-sm">Verification Required</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You <strong>must verify your email</strong> before you can log in.
                </p>
              </div>
            </div>

            <div className="p-4 bg-background/60 rounded-lg border border-primary/20 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Next Steps</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  1. Open the verification email<br />
                  2. Click the verification link<br />
                  3. Return to login and sign in
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Button 
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                onClick={() => {
                  onDismiss();
                  // Navigate to login page
                  window.location.href = '/login';
                }}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-5 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-background border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => window.open(`https://mail.google.com`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Gmail
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="bg-background border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => window.open(`https://outlook.live.com`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Outlook
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="bg-background border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => window.open(`https://mail.yahoo.com`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Yahoo Mail
          </Button>
        </div>
      </Alert>
    </motion.div>
  );
};

export default RegistrationSuccessAlert;
