
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  redirectUrl?: string;
  onSuccess?: () => void;
}

// Schema for authentication form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean().default(false),
});

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Please enter your full name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
  occupation: z.string().optional(),
  legalInterest: z.string().optional(),
});

const AuthForm: React.FC<AuthFormProps> = ({ 
  redirectUrl = "/dashboard", 
  onSuccess 
}) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      acceptTerms: false,
      occupation: "",
      legalInterest: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
        variant: "default",
      });
      
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate(redirectUrl);
        }, 1000);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Sign in failed",
        description: error?.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            occupation: values.occupation || null,
            legal_interest: values.legalInterest || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
        variant: "default",
      });
      
      setShowFeedback(true);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      
      toast({
        title: "Registration failed",
        description: error?.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      loginForm.setValue('email', rememberedEmail);
      loginForm.setValue('rememberMe', true);
    }
  }, [loginForm]);

  const legalInterestOptions = [
    { value: 'constitutional', label: 'Constitutional Law' },
    { value: 'criminal', label: 'Criminal Law' },
    { value: 'corporate', label: 'Corporate Law' },
    { value: 'intellectual', label: 'Intellectual Property' },
    { value: 'international', label: 'International Law' },
    { value: 'environmental', label: 'Environmental Law' },
    { value: 'family', label: 'Family Law' },
    { value: 'other', label: 'Other' },
  ];

  const occupationOptions = [
    { value: 'student', label: 'Law Student' },
    { value: 'attorney', label: 'Attorney' },
    { value: 'professor', label: 'Law Professor' },
    { value: 'judge', label: 'Judge' },
    { value: 'paralegal', label: 'Paralegal' },
    { value: 'other', label: 'Other Legal Professional' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto border-border/30 shadow-xl bg-card/70 backdrop-blur-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="login" className="rounded-md">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-md">Create Account</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="login" className="mt-0">
                {showFeedback ? (
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Check Your Email</h3>
                      <p className="text-muted-foreground">
                        We've sent a verification link to your email address.
                        Please check your inbox and follow the instructions.
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        onClick={() => setShowFeedback(false)}
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 px-4 py-2">
                      <CardContent className="space-y-4 p-2">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    placeholder="your.email@example.com"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <Button
                                  variant="link"
                                  className="px-0 h-auto text-xs font-normal"
                                  type="button"
                                  onClick={() => {
                                    toast({
                                      title: "Reset password",
                                      description: "Password reset functionality coming soon.",
                                    });
                                  }}
                                >
                                  Forgot password?
                                </Button>
                              </div>
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  Remember me
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      
                      <CardFooter className="flex flex-col space-y-3 px-2 pt-0">
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing in..." : "Sign In"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        
                        <p className="px-2 text-center text-sm text-muted-foreground">
                          Don't have an account?{" "}
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => setActiveTab("signup")}
                            type="button"
                          >
                            Sign up
                          </Button>
                        </p>
                      </CardFooter>
                    </form>
                  </Form>
                )}
              </TabsContent>
            </motion.div>

            <motion.div
              key={activeTab === "signup" ? "signup" : "login-placeholder"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="signup" className="mt-0">
                {showFeedback ? (
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Check Your Email</h3>
                      <p className="text-muted-foreground">
                        We've sent a verification link to your email address.
                        Please check your inbox and follow the instructions.
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        onClick={() => {
                          setShowFeedback(false);
                          setActiveTab("login");
                        }}
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4 px-4 py-2">
                      <CardContent className="space-y-4 p-2">
                        <FormField
                          control={signupForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    placeholder="John Doe"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                              <FormMessage />
                              <FormDescription className="text-xs">
                                Must be at least 6 characters
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signupForm.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation (Optional)</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your occupation" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {occupationOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                This helps us personalize your experience
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signupForm.control}
                          name="legalInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Area of Legal Interest (Optional)</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an area of interest" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {legalInterestOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Helps us tailor content to your interests
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signupForm.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-xs font-normal">
                                  I accept the <Button variant="link" className="p-0 h-auto text-xs" type="button" onClick={() => window.open('/terms', '_blank')}>
                                    Terms of Service
                                  </Button> and{" "}
                                  <Button variant="link" className="p-0 h-auto text-xs" type="button" onClick={() => window.open('/privacy', '_blank')}>
                                    Privacy Policy
                                  </Button>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      
                      <CardFooter className="flex flex-col space-y-3 px-2 pt-0">
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Account..." : "Create Account"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        
                        <p className="px-2 text-center text-sm text-muted-foreground">
                          Already have an account?{" "}
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => setActiveTab("login")}
                            type="button"
                          >
                            Sign in
                          </Button>
                        </p>
                      </CardFooter>
                    </form>
                  </Form>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
