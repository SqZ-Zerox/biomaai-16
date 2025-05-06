
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, 
  ArrowLeft, Calendar, Phone, User, UserPlus, UserCheck,
  AlertCircle, MailOpen, Dna, Weight, Activity, Heart,
  Thermometer, Apple, Dumbbell
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
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  // Account Credentials
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  
  // Personal Information
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
  phone_number: z.string().optional(),
  gender: z.enum(["male", "female", "non_binary", "prefer_not_to_say"], {
    required_error: "Please select your gender",
  }),
  
  // Health Profile
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "very_active"], {
    required_error: "Please select your activity level",
  }),
  health_goals: z.array(z.string()).min(1, { message: "Please select at least one health goal" }),
  dietary_restrictions: z.array(z.string()).optional(),
  
  // Medical History
  existing_conditions: z.array(z.string()).optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  family_history: z.array(z.string()).optional(),
  recent_lab_work: z.enum(["yes", "no", "not_sure"], {
    required_error: "Please indicate if you've had recent lab work",
  }),
  
  // Terms
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
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
  const { checkSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSignupStep, setCurrentSignupStep] = useState<'credentials' | 'personal' | 'health' | 'medical' | 'terms'>('credentials');
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

  // Signup form with expanded health information
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      // Account Credentials
      email: "",
      password: "",
      confirmPassword: "",
      
      // Personal Information
      first_name: "",
      last_name: "",
      birth_date: "",
      phone_number: "",
      gender: "prefer_not_to_say",
      
      // Health Profile
      height: "",
      weight: "",
      activity_level: "moderate",
      health_goals: [],
      dietary_restrictions: [],
      
      // Medical History
      existing_conditions: [],
      allergies: "",
      medications: "",
      family_history: [],
      recent_lab_work: "not_sure",
      
      // Terms
      terms_accepted: false,
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
        // Refresh the auth context to ensure it has the latest session data
        await checkSession();
        
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

  const proceedToHealthStep = () => {
    const { first_name, last_name, birth_date, gender } = signupForm.getValues();
    
    // Validate current fields before proceeding
    if (!first_name || !last_name || !birth_date || !gender) {
      signupForm.trigger(["first_name", "last_name", "birth_date", "gender"]);
      return;
    }
    
    setCurrentSignupStep('health');
  };

  const proceedToMedicalStep = () => {
    const { height, weight, activity_level, health_goals } = signupForm.getValues();
    
    // Validate current fields before proceeding
    if (!height || !weight || !activity_level || health_goals.length === 0) {
      signupForm.trigger(["height", "weight", "activity_level", "health_goals"]);
      return;
    }
    
    setCurrentSignupStep('medical');
  };

  const proceedToTermsStep = () => {
    const { recent_lab_work } = signupForm.getValues();
    
    // Validate current fields before proceeding
    if (!recent_lab_work) {
      signupForm.trigger(["recent_lab_work"]);
      return;
    }
    
    setCurrentSignupStep('terms');
  };

  const backToCredentialsStep = () => {
    setCurrentSignupStep('credentials');
  };

  const backToPersonalStep = () => {
    setCurrentSignupStep('personal');
  };

  const backToHealthStep = () => {
    setCurrentSignupStep('health');
  };

  const backToMedicalStep = () => {
    setCurrentSignupStep('medical');
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      // Ensure terms are accepted
      if (!values.terms_accepted) {
        toast({
          title: "Terms Required",
          description: "You must accept the terms and conditions to create an account.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Format data for API
      const signupData = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: values.birth_date,
        phone_number: values.phone_number || null,
        user_metadata: {
          gender: values.gender,
          height: values.height,
          weight: values.weight,
          activity_level: values.activity_level,
          health_goals: values.health_goals,
          dietary_restrictions: values.dietary_restrictions,
          existing_conditions: values.existing_conditions,
          allergies: values.allergies,
          medications: values.medications,
          family_history: values.family_history,
          recent_lab_work: values.recent_lab_work
        }
      };

      // Call signup API
      const { data, error } = await signUp(signupData);
      
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
        setIsLoading(false);
        return;
      }
      
      // Set success state and store email for display
      setRegistrationSuccess(true);
      setRegisteredEmail(values.email);
      
      // Reset form and go back to login tab
      signupForm.reset();
      
      // Switch to the login tab
      const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
      if (loginTab) {
        loginTab.click();
      }
      
      // Automatically navigate to dashboard if email confirmation is disabled in Supabase
      if (data?.session) {
        // Refresh the auth context to ensure it has the latest session data
        await checkSession();
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
      
      toast({
        title: "Account created!",
        description: data?.session 
          ? "Your account has been created successfully. Redirecting to dashboard..."
          : "Please check your email to verify your account.",
      });
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

  // Health-related options
  const healthGoalOptions = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'improve_endurance', label: 'Improve Endurance' },
    { value: 'reduce_cholesterol', label: 'Reduce Cholesterol' },
    { value: 'better_sleep', label: 'Better Sleep' },
    { value: 'reduce_stress', label: 'Reduce Stress' },
    { value: 'increase_energy', label: 'Increase Energy' },
    { value: 'improve_digestion', label: 'Improve Digestion' },
    { value: 'hormonal_balance', label: 'Hormonal Balance' },
  ];
  
  const dietaryRestrictionOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten-Free' },
    { value: 'dairy_free', label: 'Dairy-Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'low_carb', label: 'Low-Carb' },
    { value: 'pescatarian', label: 'Pescatarian' },
  ];
  
  const medicalConditionOptions = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'high_cholesterol', label: 'High Cholesterol' },
    { value: 'thyroid_disorder', label: 'Thyroid Disorder' },
    { value: 'heart_disease', label: 'Heart Disease' },
    { value: 'autoimmune', label: 'Autoimmune Condition' },
    { value: 'respiratory', label: 'Respiratory Condition' },
    { value: 'digestive', label: 'Digestive Condition' },
    { value: 'hormonal', label: 'Hormonal Imbalance' },
  ];
  
  const familyHistoryOptions = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'heart_disease', label: 'Heart Disease' },
    { value: 'cancer', label: 'Cancer' },
    { value: 'stroke', label: 'Stroke' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'thyroid_disorder', label: 'Thyroid Disorder' },
    { value: 'autoimmune', label: 'Autoimmune Condition' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little to no exercise)', icon: User },
    { value: 'light', label: 'Light (light exercise 1-3 days/week)', icon: User },
    { value: 'moderate', label: 'Moderate (moderate exercise 3-5 days/week)', icon: Activity },
    { value: 'active', label: 'Active (intense exercise 5-6 days/week)', icon: Dumbbell },
    { value: 'very_active', label: 'Very Active (intense exercise daily)', icon: Dumbbell },
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
                {/* STEP 1: Account Credentials */}
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
                
                {/* STEP 2: Personal Information */}
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
                    
                    <FormField
                      control={signupForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-3"
                              disabled={isLoading}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="gender-male" />
                                <Label htmlFor="gender-male">Male</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="gender-female" />
                                <Label htmlFor="gender-female">Female</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="non_binary" id="gender-non-binary" />
                                <Label htmlFor="gender-non-binary">Non-Binary</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="prefer_not_to_say" id="gender-prefer-not" />
                                <Label htmlFor="gender-prefer-not">Prefer not to say</Label>
                              </div>
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
                        onClick={backToCredentialsStep}
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        className="w-full" 
                        onClick={proceedToHealthStep}
                        disabled={isLoading}
                      >
                        Next: Health Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* STEP 3: Health Profile */}
                {currentSignupStep === 'health' && (
                  <motion.div
                    key="health"
                    initial="enterFromRight"
                    animate="center"
                    exit="exitToLeft"
                    variants={slideVariants}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">3</div>
                      <h3 className="text-lg font-medium">Health Profile</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={signupForm.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Thermometer className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="number"
                                  placeholder="175" 
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
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Weight className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="number" 
                                  placeholder="70" 
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
                      name="activity_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-3"
                              disabled={isLoading}
                            >
                              {activityOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <Label
                                    key={option.value}
                                    htmlFor={`activity-${option.value}`}
                                    className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-all duration-200 hover:bg-accent hover:border-primary ${field.value === option.value ? 'border-primary bg-primary/5' : 'border-input'}`}
                                  >
                                    <RadioGroupItem value={option.value} id={`activity-${option.value}`} />
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{option.label}</span>
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
                    
                    <FormField
                      control={signupForm.control}
                      name="health_goals"
                      render={() => (
                        <FormItem>
                          <FormLabel>Health Goals (Select at least one)</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {healthGoalOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={signupForm.control}
                                name="health_goals"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="dietary_restrictions"
                      render={() => (
                        <FormItem>
                          <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {dietaryRestrictionOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={signupForm.control}
                                name="dietary_restrictions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], option.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
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
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        className="w-full" 
                        onClick={proceedToMedicalStep}
                        disabled={isLoading}
                      >
                        Next: Medical History
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* STEP 4: Medical History */}
                {currentSignupStep === 'medical' && (
                  <motion.div
                    key="medical"
                    initial="enterFromRight"
                    animate="center"
                    exit="exitToLeft"
                    variants={slideVariants}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">4</div>
                      <h3 className="text-lg font-medium">Medical History</h3>
                      <div className="ml-auto text-xs text-muted-foreground">Optional</div>
                    </div>
                    
                    <FormField
                      control={signupForm.control}
                      name="existing_conditions"
                      render={() => (
                        <FormItem>
                          <FormLabel>Existing Health Conditions (Optional)</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {medicalConditionOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={signupForm.control}
                                name="existing_conditions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], option.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={signupForm.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any allergies..." 
                                className="min-h-[80px]" 
                                disabled={isLoading}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Medications (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any medications..." 
                                className="min-h-[80px]" 
                                disabled={isLoading}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={signupForm.control}
                      name="family_history"
                      render={() => (
                        <FormItem>
                          <FormLabel>Family Medical History (Optional)</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {familyHistoryOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={signupForm.control}
                                name="family_history"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], option.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="recent_lab_work"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Have you had lab work done in the last 6 months?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                              disabled={isLoading}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="lab-yes" />
                                <Label htmlFor="lab-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="lab-no" />
                                <Label htmlFor="lab-no">No</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="not_sure" id="lab-not-sure" />
                                <Label htmlFor="lab-not-sure">Not Sure</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <Alert className="bg-primary/5 border-primary/20">
                        <Dna className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-sm font-medium">Upload Lab Results Later</AlertTitle>
                        <AlertDescription className="text-xs text-muted-foreground">
                          You'll be able to securely upload your recent lab results after creating your account for more personalized insights.
                        </AlertDescription>
                      </Alert>
                    </div>
                    
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={backToHealthStep}
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        className="w-full" 
                        onClick={proceedToTermsStep}
                        disabled={isLoading}
                      >
                        Next: Finalize
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* STEP 5: Terms and Submit */}
                {currentSignupStep === 'terms' && (
                  <motion.div
                    key="terms"
                    initial="enterFromRight"
                    animate="center"
                    exit="exitToRight"
                    variants={slideVariants}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">5</div>
                      <h3 className="text-lg font-medium">Terms & Conditions</h3>
                    </div>
                    
                    <div className="rounded-md border p-4 space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center">
                          <Dna className="h-4 w-4 mr-2 text-primary" />
                          Health Data Privacy
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Your health data is encrypted and stored securely. We only use your data to provide personalized recommendations and insights.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-primary" />
                          Not Medical Advice
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          BIOMA AI provides informational content only and is not a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                      </div>
                    </div>
                    
                    <FormField
                      control={signupForm.control}
                      name="terms_accepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <Button variant="link" className="h-auto p-0">Terms of Service</Button> and <Button variant="link" className="h-auto p-0">Privacy Policy</Button>
                            </FormLabel>
                            <FormDescription className="text-xs">
                              By creating an account, you agree to our Terms of Service and Privacy Policy, and consent to our use of your data to provide personalized health insights.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={backToMedicalStep}
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
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
              <path d="M10 2c1 .5 2 2 2 5" />
            </svg>
            Apple
          </Button>
        </motion.div>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6 text-center text-sm text-muted-foreground"
      >
        By continuing, you agree to our{" "}
        <Button variant="link" className="p-0 font-normal text-sm h-auto">Terms of Service</Button>
        {" "}and{" "}
        <Button variant="link" className="p-0 font-normal text-sm h-auto">Privacy Policy</Button>
      </motion.p>
    </motion.div>
  );
};

export default AuthForm;
