
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Activity, Weight, Dumbbell } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignupFormValues } from "./types";
import { slideVariants } from "./animations";

interface SignupHealthStepProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
}

const SignupHealthStep: React.FC<SignupHealthStepProps> = ({ 
  form, 
  isLoading, 
  onNext, 
  onBack 
}) => {
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
  
  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little to no exercise)', icon: Activity },
    { value: 'light', label: 'Light (light exercise 1-3 days/week)', icon: Activity },
    { value: 'moderate', label: 'Moderate (moderate exercise 3-5 days/week)', icon: Activity },
    { value: 'active', label: 'Active (intense exercise 5-6 days/week)', icon: Dumbbell },
    { value: 'very_active', label: 'Very Active (intense exercise daily)', icon: Dumbbell },
  ];

  return (
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
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Activity className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
          control={form.control}
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
        control={form.control}
        name="activity_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activity Level</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {activityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <option.icon className="mr-2 h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="health_goals"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Health Goals (select at least one)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {healthGoalOptions.map((option) => (
                <FormField
                  key={option.value}
                  control={form.control}
                  name="health_goals"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const updatedGoals = checked
                                ? [...field.value, option.value]
                                : field.value?.filter(
                                    (value) => value !== option.value
                                  );
                              field.onChange(updatedGoals);
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dietary_restrictions"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Dietary Restrictions (if any)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dietaryRestrictionOptions.map((option) => (
                <FormField
                  key={option.value}
                  control={form.control}
                  name="dietary_restrictions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const updatedRestrictions = checked
                                ? [...(field.value || []), option.value]
                                : (field.value || [])?.filter(
                                    (value) => value !== option.value
                                  );
                              field.onChange(updatedRestrictions);
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
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
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="button" 
          className="w-full" 
          onClick={onNext}
          disabled={isLoading}
        >
          Next: Medical History
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SignupHealthStep;
