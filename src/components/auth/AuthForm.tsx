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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
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
        profession: null,
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
