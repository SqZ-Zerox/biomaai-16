
import React from "react";
import { motion } from "framer-motion";
import { MailOpen, AlertCircle, Dna, Info, ExternalLink } from "lucide-react";
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
          <p className="font-medium text-foreground">Please check your inbox and click the verification link to activate your account before attempting to log in.</p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {/* Left column */}
            <div className="space-y-3">
              <div className="p-3 bg-background/60 rounded-lg border border-primary/20 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-amber-600">Important: Email Verification Required</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You <strong>must verify your email address</strong> before you can log in. If you don't see the verification email, check your spam/junk folder.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-background/60 rounded-lg border border-primary/20 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Next Steps</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    1. Open the verification email<br />
                    2. Click the verification link<br />
                    3. Return to login page<br />
                    4. Sign in with your credentials
                  </p>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div>
              <div className="p-3 bg-background/60 rounded-lg border border-primary/20 flex items-start gap-3">
                <Dna className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">Genetic Analysis</h4>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">Coming Soon</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    While we're currently showcasing our lab test analysis capabilities, our advanced genetic analysis feature is coming soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              className="bg-background border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => window.open(`https://mail.google.com`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Gmail
            </Button>
            <Button 
              variant="outline" 
              className="bg-background border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => window.open(`https://outlook.live.com`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Outlook
            </Button>
            <Button 
              variant="default" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                onDismiss();
                // Navigate to login page
                window.location.href = '/login';
              }}
            >
              Go to Login Page
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default RegistrationSuccessAlert;
