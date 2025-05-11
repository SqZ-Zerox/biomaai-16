
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, Loader2, UserCheck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signIn, resendVerificationEmail } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState<string | null>(null);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showResendDialog, setShowResendDialog] = useState(false);

  // Login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(current => current - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!emailNotVerified || resendCooldown > 0) return;
    
    setResendingVerification(true);
    try {
      const { data, error } = await resendVerificationEmail(emailNotVerified);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend verification email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox and verify your email address.",
        });
        // Start cooldown timer (45 seconds)
        setResendCooldown(45);
        // Close dialog if open
        setShowResendDialog(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendingVerification(false);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setEmailNotVerified(null);
    
    try {
      console.log("Attempting login with:", values.email);
      
      const { data, error } = await signIn({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        console.error("Login error:", error);
        
        let errorMessage = "Failed to login. Please try again.";
        if (error.message) {
          errorMessage = error.message;
        }
        
        // Check for email verification error
        if (
          error.message?.includes("not confirmed") || 
          error.message?.includes("not verified") ||
          error.message?.includes("email_not_confirmed")
        ) {
          setEmailNotVerified(values.email);
          // Show resend dialog automatically
          setShowResendDialog(true);
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      if (data?.session) {
        // Refresh the auth context to ensure it has the latest session data
        await checkSession();
        
        toast({
          title: "Success!",
          description: "You've been logged in successfully.",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login submission error:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6">
          {emailNotVerified && !showResendDialog && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mb-4">
                <AlertTitle className="text-amber-800 dark:text-amber-300">
                  Email verification required
                </AlertTitle>
                <AlertDescription className="text-sm">
                  <p className="text-muted-foreground mb-4">
                    Your email address hasn't been verified yet. Please check your inbox for a verification link or click the button below to resend the verification email.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/40 w-full sm:w-auto"
                      onClick={() => setShowResendDialog(true)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Verification Email
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="you@example.com" 
                        className="pl-10 h-12" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-xs text-primary"
                      onClick={() => navigate("/forgot-password")}
                      type="button"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        className="pl-10 h-12" 
                        disabled={isLoading}
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="pt-2"
          >
            <Button 
              type="submit" 
              className="w-full h-12 text-base" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Sign In
                </span>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Email verification resend dialog */}
      <Dialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resend verification email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              We'll send a new verification link to <span className="font-semibold text-foreground">{emailNotVerified}</span>
            </p>
            
            <div className="flex flex-col gap-4 items-center">
              <Button 
                onClick={handleResendVerification}
                disabled={resendingVerification || resendCooldown > 0}
                className="w-full"
              >
                {resendingVerification ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend available in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send verification email
                  </>
                )}
              </Button>
              
              <div className="text-sm text-muted-foreground mt-2">
                <p>Not seeing the email? Check your spam folder or try again in a minute.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
