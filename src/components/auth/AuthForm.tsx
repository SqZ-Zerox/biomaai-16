import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, 
  UserRound, School, Gavel, BookOpen, Calendar, 
  Phone, User, UserPlus, UserCheck, BookText,
  AlertCircle, MailOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signIn, signUp } from "@/services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  birth_date: z.string()
    .refine(val => {
      if (!val) return false;
      
      const birthDate = new Date(val);
      const today = new Date();
      
      // Check if date is invalid
      if (isNaN(birthDate.getTime())) return false;
      
      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Check if age is between 13 and 100
      return age >= 13 && age <= 100;
    }, { message: "You must be at least 13 years old and not older than 100 years" }),
  phone_number: z.string().optional().nullable(),
  profession: z.enum(["student", "professor", "legal_professional", "researcher"], {
    required_error: "Please select your profession",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSignupStep, setCurrentSignupStep] = useState<'credentials' | 'personal' | 'profession'>('credentials');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      birth_date: null,
      phone_number: null,
      profession: "student",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await signIn({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        let errorMessage = "Failed to login. Please try again.";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email before logging in.";
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      if (data?.session) {
        toast({
          title: "Success!",
          description: "You've been logged in successfully.",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToPersonalStep = () => {
    const { email, password, confirmPassword } = signupForm.getValues();
    
    // Validate current fields before proceeding
    if (!email || !password || !confirmPassword || password !== confirmPassword) {
      signupForm.trigger(["email", "password", "confirmPassword"]);
      return;
    }
    
    setCurrentSignupStep('personal');
  };

  const proceedToProfessionStep = () => {
    const { first_name, last_name } = signupForm.getValues();
    
    // Validate current fields before proceeding
    if (!first_name || !last_name) {
      signupForm.trigger(["first_name", "last_name"]);
      return;
    }
    
    setCurrentSignupStep('profession');
  };

  const backToCredentialsStep = () => {
    setCurrentSignupStep('credentials');
  };

  const backToPersonalStep = () => {
    setCurrentSignupStep('personal');
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await signUp({
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: values.birth_date,
        phone_number: values.phone_number,
        profession: values.profession
      });
      
      if (error) {
        let errorMessage = "Failed to create account. Please try again.";
        if (error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please login or use a different email.";
        }
        
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      // Set success state and store email for display
      setRegistrationSuccess(true);
      setRegisteredEmail(values.email);
      
      // Reset form and go back to login tab
      signupForm.reset();
      document.querySelector('[data-value="login"]')?.click();
      
      // Automatically navigate to dashboard if email confirmation is disabled in Supabase
      if (data?.session) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    { value: 'student', label: 'Law Student', icon: School, description: 'Currently enrolled in a law program' },
    { value: 'professor', label: 'Law Professor', icon: BookText, description: 'Teaching at a law school or university' },
    { value: 'legal_professional', label: 'Legal Professional', icon: Gavel, description: 'Working in the legal field' },
    { value: 'researcher', label: 'Legal Researcher', icon: BookOpen, description: 'Conducting legal research' },
  ];

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const slideVariants = {
    enterFromRight: { x: 50, opacity: 0 },
    enterFromLeft: { x: -50, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exitToLeft: { x: -50, opacity: 0, transition: { duration: 0.3 } },
    exitToRight: { x: 50, opacity: 0, transition: { duration: 0.3 } }
  };

  // Reset success notification when switching tabs
  const handleTabChange = (value: string) => {
    if (value === "login") {
      setRegistrationSuccess(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="w-full"
    >
      {registrationSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert className="bg-primary/10 border-primary text-foreground">
            <MailOpen className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary font-bold text-lg">Verification Email Sent!</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">We've sent a verification email to <span className="font-bold">{registeredEmail}</span></p>
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
                onClick={() => setRegistrationSuccess(false)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-10" 
                            disabled={isLoading}
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••" 
                            className="pl-10" 
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex justify-end"
              >
                <Button 
                  variant="link" 
                  className="px-0 font-normal text-sm text-muted-foreground"
                  onClick={() => navigate("/forgot-password")}
                  type="button"
                  disabled={isLoading}
                >
                  Forgot password?
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="signup">
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <AnimatePresence mode="wait">
                {currentSignupStep === 'credentials' && (
                  <motion.div
                    key="credentials"
                    initial="enterFromLeft"
                    animate="center"
                    exit="exitToLeft"
                    variants={slideVariants}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">1</div>
                      <h3 className="text-lg font-medium">Account Credentials</h3>
                    </div>
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="you@example.com" 
                                className="pl-10" 
                                disabled={isLoading}
                                {...field} 
                              />
                            </div>
                          </FormControl>
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
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                className="pl-10" 
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                className="pl-10" 
                                disabled={isLoading}
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="button" 
                      className="w-full mt-4" 
                      onClick={proceedToPersonalStep}
                      disabled={isLoading}
                    >
                      Next: Personal Information
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
                
                {currentSignupStep === 'personal' && (
                  <motion.div
                    key="personal"
                    initial="enterFromRight"
                    animate="center"
                    exit="exitToLeft"
                    variants={slideVariants}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">2</div>
                      <h3 className="text-lg font-medium">Personal Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={signupForm.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="John" 
                                  className="pl-10" 
                                  disabled={isLoading}
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="Doe" 
                                  className="pl-10" 
                                  disabled={isLoading}
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={signupForm.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="date"
                                className="pl-10" 
                                disabled={isLoading}
                                {...field}
                                value={field.value || ''}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="+1 (555) 000-0000" 
                                className="pl-10" 
                                disabled={isLoading}
                                {...field}
                                value={field.value || ''}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={backToCredentialsStep}
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        className="w-full" 
                        onClick={proceedToProfessionStep}
                        disabled={isLoading}
                      >
                        Next: Professional Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {currentSignupStep === 'profession' && (
                  <motion.div
                    key="profession"
                    initial="enterFromRight"
                    animate="center"
                    exit="exitToRight"
                    variants={slideVariants}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">3</div>
                      <h3 className="text-lg font-medium">Professional Details</h3>
                    </div>
                    
                    <FormField
                      control={signupForm.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>I am a...</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-3"
                              disabled={isLoading}
                            >
                              {userTypeOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <Label
                                    key={option.value}
                                    htmlFor={`userType-${option.value}`}
                                    className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-all duration-200 hover:bg-accent hover:border-primary ${field.value === option.value ? 'border-primary bg-primary/5' : 'border-input'}`}
                                  >
                                    <RadioGroupItem value={option.value} id={`userType-${option.value}`} />
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{option.label}</span>
                                      <span className="text-xs text-muted-foreground">{option.description}</span>
                                    </div>
                                  </Label>
                                );
                              })}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={backToPersonalStep}
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Account
                          </span>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Google
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              <path
