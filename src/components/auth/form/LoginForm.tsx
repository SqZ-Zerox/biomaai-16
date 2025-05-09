import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, Loader2, UserCheck, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import GoogleSignInButton from "./GoogleSignInButton";
import { Separator } from "@/components/ui/separator";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { CaptchaVerificationService } from "@/services/securityService";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  captchaToken: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha | null>(null);

  // Login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      captchaToken: "",
    },
  });

  const handleCaptchaVerify = (token: string) => {
    setCaptchaError(null);
    if (!CaptchaVerificationService.validateToken(token)) {
      setCaptchaError("Invalid captcha verification. Please try again.");
      captchaRef.current?.resetCaptcha();
      return;
    }
    
    setCaptchaToken(token);
    form.setValue("captchaToken", token);
  };
  
  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    form.setValue("captchaToken", "");
    setCaptchaError("Captcha verification expired. Please complete the verification again.");
  };
  
  const handleCaptchaError = () => {
    setCaptchaError("An error occurred with captcha verification. Please try again.");
    captchaRef.current?.resetCaptcha();
  };

  const onSubmit = async (values: LoginFormValues) => {
    if (!captchaToken) {
      setCaptchaError("Please complete the captcha verification");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting login with:", values.email);
      
      const { data, error } = await signIn({
        email: values.email,
        password: values.password,
        captchaToken
      });
      
      if (error) {
        console.error("Login error:", error);
        
        let errorMessage = "Failed to login. Please try again.";
        if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Reset captcha on failure
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
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
      
      // Reset captcha on error
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6">
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
          transition={{ delay: 0.25, duration: 0.3 }}
          className="space-y-2"
        >
          <div className="flex flex-col items-center">
            <label className="flex items-center text-sm mb-2 gap-1 font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Security Verification
            </label>
            <HCaptcha
              sitekey={CaptchaVerificationService.getSiteKey()}
              onVerify={handleCaptchaVerify}
              onExpire={handleCaptchaExpire}
              onError={handleCaptchaError}
              ref={captchaRef}
            />
          </div>
          
          {captchaError && (
            <Alert variant="destructive" className="mt-2 py-2">
              <AlertDescription className="text-xs">{captchaError}</AlertDescription>
            </Alert>
          )}
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
            disabled={isLoading || !captchaToken}
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

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <GoogleSignInButton 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
          </div>
        </motion.div>
      </form>
    </Form>
  );
};

export default LoginForm;
