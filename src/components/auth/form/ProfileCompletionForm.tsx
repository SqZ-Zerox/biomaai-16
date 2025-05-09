import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { completeUserProfile } from "@/services/auth";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProfileCompletionFormProps {
  provider: string;
}

const profileCompletionSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  birth_date: z.string().min(1, "Birth date is required"),
  gender: z.string().min(1, "Gender is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  activity_level: z.string().min(1, "Activity level is required"),
  health_goals: z.array(z.string()).min(1, "Please select at least one health goal"),
});

type ProfileCompletionValues = z.infer<typeof profileCompletionSchema>;

const ProfileCompletionForm: React.FC<ProfileCompletionFormProps> = ({ provider }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'personal' | 'health'>('personal');

  // Form
  const form = useForm<ProfileCompletionValues>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: "",
      gender: "",
      height: "",
      weight: "",
      activity_level: "moderate",
      health_goals: [],
    },
  });

  const proceedToHealthStep = () => {
    const { first_name, last_name, birth_date, gender } = form.getValues();
    
    // Validate current fields before proceeding
    if (!first_name || !last_name || !birth_date || !gender) {
      form.trigger(["first_name", "last_name", "birth_date", "gender"]);
      return;
    }
    
    setCurrentStep('health');
  };

  const backToPersonalStep = () => {
    setCurrentStep('personal');
  };

  const onSubmit = async (values: ProfileCompletionValues) => {
    setIsLoading(true);
    try {
      // Convert the health_goals from the form (string[]) to the expected format
      const success = await completeUserProfile({
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: values.birth_date,
        gender: values.gender,
        height: values.height,
        weight: values.weight,
        activity_level: values.activity_level,
        health_goals: values.health_goals,
      });
      
      if (success) {
        // Refresh the auth context to ensure it has the latest user data
        await checkSession();
        
        toast({
          title: "Profile Complete",
          description: "Your profile has been completed successfully.",
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Profile Update Failed",
          description: "We couldn't complete your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Profile completion error:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to complete your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const healthGoalsList = [
    { id: "lose_weight", label: "Lose Weight" },
    { id: "gain_muscle", label: "Gain Muscle" },
    { id: "improve_fitness", label: "Improve Fitness" },
    { id: "reduce_stress", label: "Reduce Stress" },
    { id: "better_sleep", label: "Better Sleep" },
    { id: "healthy_eating", label: "Healthy Eating" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg mx-auto bg-card border border-border/30 shadow-xl rounded-xl overflow-hidden p-6 md:p-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">
            We need a bit more information to personalize your experience.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 'personal' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">1</div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                  control={form.control}
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
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
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
                
                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={proceedToHealthStep}
                  disabled={isLoading}
                >
                  Next: Health Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
            
            {currentStep === 'health' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">2</div>
                  <h3 className="text-lg font-medium">Health Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="175" 
                            disabled={isLoading}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="70" 
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
                  control={form.control}
                  name="activity_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Very Active (exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="extra_active">Extra Active (very hard exercise or physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us tailor recommendations to your lifestyle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="health_goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Goals (Select at least one)</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            { id: "lose_weight", label: "Lose Weight" },
                            { id: "gain_muscle", label: "Gain Muscle" },
                            { id: "improve_fitness", label: "Improve Fitness" },
                            { id: "reduce_stress", label: "Reduce Stress" },
                            { id: "better_sleep", label: "Better Sleep" },
                            { id: "healthy_eating", label: "Healthy Eating" },
                          ].map((goal) => (
                            <Label
                              key={goal.id}
                              className={`flex items-center p-3 rounded-md border ${
                                field.value.includes(goal.id)
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border bg-background'
                              } hover:bg-accent cursor-pointer transition-colors`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                value={goal.id}
                                checked={field.value.includes(goal.id)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const value = e.target.value;
                                  if (checked) {
                                    field.onChange([...field.value, value]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((item) => item !== value)
                                    );
                                  }
                                }}
                                disabled={isLoading}
                              />
                              {goal.label}
                            </Label>
                          ))}
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
                    onClick={backToPersonalStep}
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
                    Complete Profile
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileCompletionForm;
